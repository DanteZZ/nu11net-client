<template>
	<div class="bios">
		<div class="tlt">{{title}} &#0007</div>
		<div class="menu">
			<div class="item" v-for="(item,id) in menuList" v-bind:class="{active: (id == selItem)}">{{item.title}}</div>
		</div>
		<div class="main">
			<div class="sections">
				<div v-for="(sect,id) in menuList[selItem].sections" v-bind:class="{active: (id == selSection)}" class="section">
					<div class="title">{{sect.title}}</div>
					<div v-if="sect.value" class="value">[{{getVar(sect.value)}}]</div>
					<div v-else-if="sect.hidevalue" class="value">[Скрыто]</div>
				</div>
			</div>
			<div class="desc">
				<pre v-if="menuList[selItem].sections[selSection].description">{{menuList[selItem].sections[selSection].description}}</pre>
			</div>
		</div class="main">
		<div class="ftr">
			{{footer}}
		</div>
		<div v-if="modal.opened" class="modalwrapper">
			<div class="modal">
				<div class="tlt">{{modal.title}}</div>
				<div v-if="modal.type == 'select'" class="body">
					<div class="list">
						<div v-for="(item, id) in getVar(modal.values)" v-bind:class="{active: (modal.selItem == modal.selItems.indexOf(id))}" class="item">{{genTitle(modal.optionTitle,item)}}</div>
					</div>
				</div>

				<div v-if="modal.type == 'input_text'" class="body">
					<div class="input">
						<input v-if="modal.hide" v-model="modal.input" ref="modal_input" type="password">
						<input v-else v-model="modal.input" ref="modal_input" type="text">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
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
		  	}
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
		  	window.BIOS = this;
		},
		beforeDestroy: function() {
			document.body.removeEventListener('keyup', this.onkeyup,false);
		}
	}
</script>
<style>
	
	.bios, .bios .tlt, .bios .ftr, .bios .main, .bios .sections, .bios .desc, .bios .menu {
		display: block;
		box-sizing: border-box;
		overflow:hidden;
		padding:0px;
		margin:0px;
		user-select: none;
	}

	.bios {
		padding:10px;
		width:900px;
		height:700px;
		display:flex;
		flex-direction: column;
		position:relative;
	}

	.bios .modalwrapper {
		position:absolute;
		left:0px;
		top:0px;
		width:100%;
		height:100%;
		display:flex;
		align-items:center;
		justify-content: center;
	}

	.bios .modalwrapper .modal {
		background-color:#dcdbdb;
		color: black;
	}

	.bios .modal .list {
		background-color:#dcdbdb;
		color: black;
		position:relative;
		padding:6px;
	}

	.bios .modal .list .item {
		position:relative;
		padding-left:20px;
	}

	.bios .modal .list .item.active:before {
		content:"\2666\a0\A0";
		position: absolute;
		left:4px;
		top:0px;
	}

	.bios .modal .input {
		padding:10px;
		padding-top:0px;
	}

	.bios .modal .input input {
		font-family: "VGA";
	    font-size: 16px;
	    border: 2px solid;
	    background-color: #dcdbdb;
	    color: black;
	    border-radius: 0px;
	    outline: none;
	}

	.bios .menu {
		padding:12px;
		padding-top:9px;
		padding-bottom:4px;
		display: flex;
	}
	.bios .menu .item {
		padding:4px;
		margin-right:8px;
	}
	.bios .menu .item.active {
		background-color:white;
		color:black;
	}

	.bios .main {
		display:flex;
		flex-grow:1;
		position:relative;
		padding: 5px 0px;
	}

	.bios .main:before {
	    content: " ";
	    position: absolute;
	    z-index: 0;
	    top: 5px;
	    left: 0px;
	    right: 0px;
	    bottom: 5px;
	    border: 2px solid #5a5a5a;
	}

	.bios .main .sections {
		flex-grow:1;
		position:relative;
	    padding: 12px;
	}

	.bios .main .sections .section {
		padding:2px;
	}

	.bios .main .sections .section div {
		display:inline-block;
	}

	.bios .main .sections .section.active {
		background-color:white;
		color:black;
	}

	.bios .main .desc {
		width:250px;
		min-width:250px;
		position:relative;
	    padding: 12px;
	    margin-left: -6px;
	}
	.bios .main .desc pre {
		font-family: 'VGA';
	    white-space: pre-wrap;
	    margin: 0px;
	}

	.bios .main .sections:before, .bios .main .desc:before {
	    content: " ";
	    position: absolute;
	    z-index: 0;
	    top: 5px;
	    left: 5px;
	    right: 5px;
	    bottom: 5px;
	    border: 2px solid #5a5a5a;
	}

	.bios .tlt {
		text-align:center;
		width:100%;
		background-color: #dcdbdb;
	    color: black;
	    padding: 5px;
	}

	.bios .ftr {
		text-align:center;
		width:100%;
		background-color: #dcdbdb;
	    color: black;
	    padding: 5px;
	}
</style>