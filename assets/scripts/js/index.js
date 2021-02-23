const _vm = require("vm");
const _fs = require("fs");
const _util = require("util");


// Create Seemple objects
var BIOS = new Vue({
  	el: '#__bios',
  	data: {
	    title: "HIOS - Настройка CMOS",
		footer: "v0.1 (C) Copyright 2015-2021, H4CK-IT, Ltd",
		
		selItem: 0,
		selSection: 0,
		modal: {
			opened:false,
			title:"",
			selItem:0,
			input:"",
			selItems:[]
		},

		serverList: {
			"localhost:1337":{
				name:"Локальный сервер",
				ip: "127.0.0.1",
				port:"1337"
			},
			"localhost:13372":{
				name:"Локальный сервер",
				ip: "127.0.0.1",
				port:"13372"
			}
		},
		userData: {
			selectedServer: "localhost:1337",
			auth: {
				login: "",
				password: ""
			}
		},
		menuList: [
			{
				title: "Основное",
				sections:[
					{
						title:"Сервер",
						action:"modal",
						value: "userData.selectedServer",
						description:"Выберите игровой сервер из списка.",
						modal: {
							title:"Выберите сервер из списка",
							type:"select",
							values:"serverList",
							optionTitle:["name"," [","ip",":","port","]"],
							model:"userData.selectedServer"
						}
					},
					{
						title:"Логин",
						action:"modal",
						description:"Введите логин для авторизации на сервере.",
						value: "userData.auth.login",
						modal: {
							title:"Введите логин",
							type:"input_text",
							model:"userData.auth.login"
						}
					},
					{
						title:"Пароль",
						action:"modal",
						description:"Введите пароль для авторизации на сервере.",
						hidevalue:true,
						modal: {
							title:"Введите пароль",
							type:"input_text",
							hide:true,
							model:"userData.auth.password"
						}
					}
				]
			},
			{
				title: "Настройки",
				sections:[
					{
						title:"Авторизация 2",
						action:function(){
							window.ck = this;
						}
					},
					{
						title:"Авторизация 2",
						action:function(){
							alert("Авторизация");
						}
					},
					{
						title:"Авторизация 2",
						action:function(){
							alert("Авторизация");
						}
					}
				]
			}
		]
  	},

  	methods: {
	  	enterSection: function(section) {
	  		switch (typeof(section.action)) {
	  			case "function":
	  				section.action(this);
	  			break;
	  			case "string":
	  				if (section.action == "modal") {
	  					this.openModal(section.modal);
	  				};
	  			break;
	  		};
	  	},
	  	getVar: function(name){
	  		let vars = name.split('.');
	  		let res = this;
	  		for (var k in vars) {
	  			res = res[vars[k]];
	  		};
	  		return res;
	  	},
	  	closeModal: function() {
	  		this.modal.opened = false;
	  		document.body.focus();
	  		switch (this.modal.type) {
	  			case "input_text":
	  				this.$refs.modal_input.removeEventListener("blur",this.modalFocusInput,false);
	  			break;
	  		};
	  	},
	  	enterModal: function() {
	  		let model = this;
	  		let vars = "";
	  		switch (this.modal.type) {
	  			case "select":
	  				model = this;
	  				vars = this.modal.model.split('.');
			  		for (var k in vars) {
			  			if (k == vars.length-1) { break; };
			  			model = model[vars[k]];
			  		};
			  		model[vars.pop()] = this.modal.selItems[this.modal.selItem];
			  		this.closeModal();
	  			break;
	  			case "input_text":
	  				model = this;
	  				vars = this.modal.model.split('.');
			  		for (var k in vars) {
			  			if (k == vars.length-1) { break; };
			  			model = model[vars[k]];
			  		};
			  		model[vars.pop()] = this.modal.input;
			  		this.closeModal();
	  			break;
	  		};
	  	},
	  	genTitle: function(arr,vals=false){
	  		if (typeof(arr) == "object") {
	  			let res = "";
	  			if (vals == false) {vals = this;};
	  			for (var k in arr) {
	  				if (vals[arr[k]]) {
	  					res+=vals[arr[k]];
	  				} else {
	  					res+=arr[k];
	  				};
	  			};
	  			return res;
	  		} else {
	  			return arr;
	  		};
	  	},
	  	openModal: function(modal) {
	  		for (var k in modal) {
	  			this.modal[k] = modal[k];
	  		};
	  		switch (modal.type) {
	  			case "select":
	  				this.modal.selItems = [];
	  				for (var k in this.getVar(this.modal.values)) {
	  					this.modal.selItems.push(k);
	  				};
	  				this.modal.selItem = this.modal.selItems.indexOf(this.getVar(this.modal.model));
	  			break;
	  			case "input_text":
	  			this.$nextTick(() => {
	  				this.$nextTick(() => {
  						this.$refs.modal_input.addEventListener("blur",this.modalFocusInput,false);
			        	this.modalFocusInput();
			        });
			    });
	  				this.modal.input = this.getVar(this.modal.model);
	  			break;
	  		};
	  		this.modal.opened = true;
	  	},

	  	modalFocusInput: function() {
	  		if (this.$refs.modal_input) {
	  			this.$refs.modal_input.focus();
	  		};
	  	},

	  	onkeyup: function(e) {
	  		let b = BIOS;
	  		if (e.which == 39) {//Right arrow
	  			if (!b.modal.opened) {
	  				if (b.selItem+1 == b.menuList.length) { b.selItem = 0;} else {b.selItem++;};
	  				b.selSection = 0;
	  			};
	  		} else if (e.which == 37) {//Left arrow
	  			if (!b.modal.opened) {
		  			if (b.selItem-1 == -1) { b.selItem = b.menuList.length-1;} else {b.selItem--;};
		  			b.selSection = 0;
		  		};
	  		};
	  		if (e.which == 40) {//Down arrow
	  			if (!b.modal.opened) {
	  				if (b.selSection+1 == b.menuList[b.selItem].sections.length) { b.selSection = 0;} else {b.selSection++;};
	  			} else {
	  				if (b.modal.selItem+1 == b.modal.selItems.length) { b.modal.selItem = 0;} else {b.modal.selItem++;};
	  			};
	  		} else if (e.which == 38) {//Up arrow
	  			if (!b.modal.opened) {
	  				if (b.selSection-1 == -1) { b.selSection = b.menuList[b.selItem].sections.length-1;} else {b.selSection--;};
	  			} else {
	  				if (b.modal.selItem-1 == -1) { b.modal.selItem = b.modal.selItems.length-1;} else {b.modal.selItem--;};
	  			};
	  		};

	  		if (e.which == 13) {//Enter
	  			if (!b.modal.opened) {
	  				b.enterSection(b.menuList[b.selItem].sections[b.selSection]);
	  			} else {
	  				b.enterModal();
	  			};
	  		};

	  		if (e.which == 27) {//Escape
	  			if (b.modal.opened) {
	  				b.closeModal();
	  			};
	  		}
	  	}
  	},

	mounted: function() {
	  	// Проверка нажати клавиш
	  	document.body.addEventListener('keyup', this.onkeyup,false);
	},
	beforeDestroy: function() {
		document.body.removeEventListener('keyup', this.onkeyup,false);
	}
});