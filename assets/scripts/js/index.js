const _vm = require("vm");
const _fs = require("fs");
const _util = require("util");


// Create Seemple objects
var BIOS = new Vue({
  	el: '#__bios',
  	data: {
	    title: "HIOS - Настройка CMOS",
		footer: "v0.1 (C) Copyright 2015-2021, H4CK-IT, Inc",
		
		selItem: 0,
		selSection: 0,
		
		isModal:false,
		modalTitle: "",

		serverList: {
			"localhost:1337":{
				name:"Локальный сервер",
				ip: "127.0.0.1",
				port:"1337"
			}
		},
		userData: {
			selectedServer: "localhost",
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
						value: "selectedServer",
						modal: {
							title:"Выберите сервер из списка",
							type:"select",
							values:"serverList",
							optionTitle:["name"," [","op",":","port","]"],
							model:"selectedServer"
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
	  		section.action();
	  	},
	  	closeModal: function() {
	  		this.isModal = false;
	  	},
	  	openModal: function(modal) {

	  	},
	  	onkeyup: function(e) {
	  		let b = BIOS;
	  		if (e.which == 39) {//Right arrow
	  			if (b.selItem+1 == b.menuList.length) { b.selItem = 0;} else {b.selItem++;};
	  			b.selSection = 0;
	  		} else if (e.which == 37) {//Left arrow
	  			if (b.selItem-1 == -1) { b.selItem = b.menuList.length-1;} else {b.selItem--;};
	  			b.selSection = 0;
	  		};
	  		if (e.which == 40) {//Down arrow
	  			if (b.selSection+1 == b.menuList[b.selItem].sections.length) { b.selSection = 0;} else {b.selSection++;};
	  		} else if (e.which == 38) {//Up arrow
	  			if (b.selSection-1 == -1) { b.selSection = b.menuList[b.selItem].sections.length-1;} else {b.selSection--;};
	  		};

	  		if (e.which == 13) {//Enter
	  			b.enterSection(b.menuList[b.selItem].sections[b.selSection]);
	  		};

	  		if (e.which == 27) {//Escape
	  			if (b.isModal) {b.closeModal();};
	  		}
	  	}
  	},

	mounted: function() {
	  	// Проверка нажати клавиш
	  	window.addEventListener('keyup', this.onkeyup,false);
	},
	beforeDestroy: function() {
		window.removeEventListener('keyup', this.onkeyup,false);
	}
});