<template>
	<div class="bios">
		<div class="tlt">{{title}} &#0007</div>
		<div class="menu">
			<div class="item" v-for="(item,id) in menuList" v-bind:class="{active: (id == selItem)}">{{item.title}}</div>
		</div>
		<div class="main">
			<div class="sections">
				<div v-for="(sect,id) in menuList[selItem].sections" v-bind:class="{active: (id == selSection)}" v-bind:style="sect.style" class="section">
					<div class="title">{{sect.title}}</div>
					<div v-if="sect.value" class="value">[{{getVar(sect.value)}}]</div>
					<div v-else-if="sect.hidevalue" class="value">[&#0007&#0007&#0007]</div>
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
					<div v-if="Object.keys(getVar(modal.values)).length" class="list">
						<div v-for="(item, id) in getVar(modal.values)" v-bind:class="{active: (modal.selItem == modal.selItems.indexOf(id))}" class="item">{{genTitle(modal.optionTitle,item)}}</div>
					</div>
					<div class="message" v-else>{{modal.empty}}</div>
				</div>

				<div v-if="modal.type == 'select_editor'" class="body">
					<div v-if="Object.keys(getVar(modal.values)).length" class="list">
						<div v-for="(item, id) in getVar(modal.values)" v-bind:class="{active: (modal.selItem == modal.selItems.indexOf(id))}" class="item">{{genTitle(modal.optionTitle,item)}}</div>
					</div>
					<div class="message" v-else>{{modal.empty}}</div>
				</div>

				<div v-if="modal.type == 'input_text'" class="body">
					<div class="input">
						<input v-if="modal.hide" v-model="modal.input" ref="modal_input" type="password">
						<input v-else v-model="modal.input" ref="modal_input" type="text">
					</div>
				</div>

				<div v-if="modal.type == 'register_connect'" class="body">
					<div class="message">
						{{modal.statuses[modal.status]}}
					</div>
				</div>

				<div v-if="modal.type == 'register_process'" class="body">
					<div class="message">
						{{modal.statuses[modal.status]}}
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

				serverList: (_cfg.get().serverList) ? _cfg.get().serverList : {},
				userData: {
					selectedServer: (_cfg.get().selectedServer) ? _cfg.get().selectedServer : "",
					auth: {
						login: (_cfg.get().login) ? _cfg.get().login : "",
						password: (_cfg.get().password) ? _cfg.get().password : ""
					}
				},
				menuList: [
					{
						title: "Сервера",
						sections:[
							{
								title:"Выбор сервера",
								notuse:true,
								style:{
									"margin":"0px 0px 10px 0px",
									"border-bottom":"2px solid",
									"opacity":0.6
								}
							},
							{
								title:"Сервер",
								action:"modal",
								value: "userData.selectedServer",
								description:`Выберите игровой сервер из списка.
									Для добавления сервера, нажмите клавишу INSERT
									Для удаления сервера, нажмите клавишу DEL
								`,
								modal: {
									title:"Выберите сервер из списка",
									type:"select_editor",
									empty:"Список серверов пуст. Для добавления нажмите на клавишу INSERT",
									payloadVars: {name:"",ip:""},
									payloadVarsKey: "ip",
									payloadModals:[
										{
											title:"Введите адрес сервера",
											type:"input_text",
											hide:false,
											model:"modal.payload.vars.ip"
										},
										{
											title:"Введите название сервера",
											type:"input_text",
											hide:false,
											model:"modal.payload.vars.name"
										}
									],
									values:"serverList",
									optionTitle:["name"," [","ip","]"],
									model:"userData.selectedServer"
								}
							},
							{
								title:"Авторизация",
								notuse:true,
								style:{
									"margin":"10px 0px 10px 0px",
									"border-bottom":"2px solid",
									"opacity":0.6
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
									model:"userData.auth.login",
									hide:false
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
							},
							{
								title:"[ Войти на сервер ]",
								action:function(){alert("Конкратулейшон")}
							},
							{
								title:"Регистрация",
								notuse:true,
								style:{
									"margin":"10px 0px 10px 0px",
									"border-bottom":"2px solid",
									"opacity":0.6
								}
							},
							{
								title:"Регистрация",
								action:"modal",
								description:``,
								modal: {
									title:"Подключение к серверу",
									type:"register_connect",
									button:"Регистрация",
									statuses:{
										0:"Подключение к серверу...",
										200:"Подключено!",
										401:"Не удалось подключиться к серверу"
									},
									status:200,
									payloadVars: {login:"",password:""},
									payloadModals:[
										{
											title:"Введите предпочитаемый логин",
											type:"input_text",
											hide:false,
											model:"modal.payload.vars.login"
										},
										{
											title:"Введите предпочитаемый пароль",
											type:"input_text",
											hide:true,
											model:"modal.payload.vars.password"
										},
										{
											title:"Регистрация",
											type:"register_process",
											statuses:{
												0:"Отправление запроса на регистрацию...",
												200:"Регистрация прошла успешно!",
												401:"Пользователь с таким логином уже существует",
												402:"Неизвестная ошибка"
											},
											status:0,
											button:"Ок"
										}
									]
								}
							},

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
				],

				modalTypes:{
					input_text:{
						onKey:{
							13:function(b){ //ENTER
								model = b;
				  				vars = b.modal.model.split('.');
						  		for (var k in vars) {
						  			if (k == vars.length-1) { break; };
						  			model = model[vars[k]];
						  		};
						  		model[vars.pop()] = b.modal.input;
						  		b.closeModal();
						  		b.updateCFG();
							},
							27:function(b){ //ESC
								b.closeModal();
							}
						},
						onOpen:function(b){
							b.$nextTick(() => {
				  				b.$nextTick(() => {
			  						b.$refs.modal_input.addEventListener("blur",b.modalFocusInput,false);
						        	b.modalFocusInput();
						        });
						    });
			  				b.modal.input = b.getVar(b.modal.model);
						},
						onClose:function(b){
							b.$refs.modal_input.removeEventListener("blur",b.modalFocusInput,false);
						}
					},
					select:{
						onKey:{
							13:function(b){ //ENTER
								model = b;
				  				vars = b.modal.model.split('.');
						  		for (var k in vars) {
						  			if (k == vars.length-1) { break; };
						  			model = model[vars[k]];
						  		};
						  		model[vars.pop()] = b.modal.selItems[b.modal.selItem];
				  				b.closeModal();
				  				b.updateCFG();
							},
							27:function(b){ //ESC
								b.closeModal();
							}
						},
						onOpen:function(b){
							b.modal.selItems = [];
			  				for (var k in b.getVar(b.modal.values)) {
			  					b.modal.selItems.push(k);
			  				};
			  				b.modal.selItem = b.modal.selItems.indexOf(b.getVar(b.modal.model));
						}
					},
					select_editor:{
						onKey:{
							13:function(b){ //ENTER
								model = b;
				  				vars = b.modal.model.split('.');
						  		for (var k in vars) {
						  			if (k == vars.length-1) { break; };
						  			model = model[vars[k]];
						  		};
						  		model[vars.pop()] = b.modal.selItems[b.modal.selItem];
						  		b.updateCFG();
				  				b.closeModal();
							},
							38:function(b){ //UP
								if (b.modal.selItem-1 == -1) { b.modal.selItem = b.modal.selItems.length-1;} else {b.modal.selItem--;};
							},
							40:function(b){ //DOWN
								if (b.modal.selItem+1 == b.modal.selItems.length) { b.modal.selItem = 0;} else {b.modal.selItem++;};
							},
							27:function(b){ //ESC
								b.closeModal();
							},
							45:function(b) {// INSERT
								let payloadVars = JSON.parse(JSON.stringify(b.modal.payloadVars));
				  				let payloadModals = JSON.parse(JSON.stringify(b.modal.payloadModals));
				  				let payloadVarsKey = false;
				  				if (b.modal.payloadVarsKey) {payloadVarsKey = b.modal.payloadVarsKey;};
				  				let list = b.modal.values;
				  				let mod = payloadModals.shift();
				  				mod.opened = true;
				  				mod.payload = {
				  					list:list,
				  					modals:payloadModals,
				  					vars:payloadVars,
				  					varsKey:payloadVarsKey,
				  					end:function(a,payload){
				  						let model = a;
						  				let vars = payload.list.split('.');
								  		for (var k in vars) {
								  			if (k == vars.length-1) { break; };
								  			model = model[vars[k]];
								  		};
								  		if (payload.varsKey) {
								  			model[vars.pop()][payload.vars[payload.varsKey]] = payload.vars;
								  		} else {
								  			model[vars.pop()].push(payload.vars);
								  		};
								  		b.updateCFG();
								  		a.enterSection(a.menuList[a.selItem].sections[a.selSection]);
				  					}
				  				};
				  				b.openModal(mod);
							},
							46:function(b){ //DELETE
								model = b;
				  				vars = b.modal.values.split('.');
						  		for (var k in vars) {
						  			if (k == vars.length-1) { break; };
						  			model = model[vars[k]];
						  		};
						  		v = vars.pop();
						  		let isArr = Array.isArray(model[v]);
						  		let nv = {};
						  		if (isArr) {nv = [];};
						  		for (var i in model[v]) {
						  			console.log(i, b.modal.selItems[b.modal.selItem]);
						  			if (i !== b.modal.selItems[b.modal.selItem]) {
						  				if (isArr) {
						  					nv.push(model[v][i])
						  				} else {
						  					nv[i] = model[v][i];
						  				};
						  			}
						  		};
						  		model[v] = JSON.parse(JSON.stringify(nv));
						  		b.$nextTick(()=>{
						  			if (b.modal.selItem-1 == -1) { b.modal.selItem = b.modal.selItems.length-1;} else {b.modal.selItem--;};
						  		})
						  		b.updateCFG();
							},
						},
						onOpen:function(b){
							b.modal.selItems = [];
			  				for (var k in b.getVar(b.modal.values)) {
			  					b.modal.selItems.push(k);
			  				};
			  				let ind = b.modal.selItems.indexOf(b.getVar(b.modal.model));
			  				if (ind >=0) {
			  					b.modal.selItem = b.modal.selItems.indexOf(b.getVar(b.modal.model));
			  				} else {
			  					if (b.modal.selItems.length > 0) {
			  						b.modal.selItem = 0;
			  					} else {
			  						b.modal.selItem = "";
			  					};
			  				};
						}
					},

					register_connect:{
						onKey:{
							13:function(b){ //ENTER
								if (b.modal.status == 200) {
									let payloadVars = b.modal.payloadVars;
					  				let payloadModals = b.modal.payloadModals;
					  				let mod = payloadModals.shift();
					  				mod.opened = true;
					  				mod.payload = {
					  					modals:payloadModals,
					  					vars:payloadVars,
					  					end:function(a,payload){
					  						
					  					}
					  				};
					  				b.openModal(mod);
								} else {
									b.closeModal();
								};
							},
							27:function(b){ //ESC
								b.closeModal();
							}
						},
						onOpen:function(b){
							b.modal.connected = true;
						},
						onClose:function(b){
							
						}
					},

					register_process:{
						onKey:{
							13:function(b){ //ENTER
								if (b.modal.status == 200) {
					  				b.closeModal(mod);
								}
							},
							27:function(b){ //ESC
								b.closeModal();
							}
						},
						onOpen:function(b){
							
						},
						onClose:function(b){
							
						}
					},
				}
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
		  		if (this.modalTypes[this.modal.type]) {
		  			let type = this.modalTypes[this.modal.type]
		  			if (typeof(type.onClose) == "function") {
		  				type.onClose(this);
		  			};
		  		};

		  		if (this.modal.payload) {
		  			if (this.modal.payload.modals.length) {
		  				let mod = this.modal.payload.modals.shift();
		  				let payload = this.modal.payload;
		  				mod.payload = payload;
		  				this.openModal(mod);
		  			} else {
		  				if (typeof(this.modal.payload.end) == "function") {
		  					this.modal.payload.end(this,this.modal.payload);
		  					delete this.modal.payload;
		  				}
		  			};
		  		}
		  		
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
		  		if (this.modalTypes[modal.type]) {
		  			let type = this.modalTypes[modal.type]
		  			if (typeof(type.onOpen) == "function") {
		  				type.onOpen(this);
		  			};
		  		};
		  		this.modal.opened = true;
		  	},

		  	modalFocusInput: function() {
		  		if (this.$refs.modal_input) {
		  			this.$refs.modal_input.focus();
		  		};
		  	},

		  	onModalKey(key) {
		  		if (this.modalTypes[this.modal.type]) {
		  			let type = this.modalTypes[this.modal.type];
		  			if (typeof(type.onKey[key]) == "function") {
		  				type.onKey[key](this);
		  			};
		  		}
		  	},

		  	updateCFG() {
		  		_cfg.set({
		  			serverList: this.serverList,
		  			selectedServer: this.userData.selectedServer,
		  			login: this.userData.auth.login,
		  			password: this.userData.auth.login
		  		});
		  		_cfg.save();
		  	},

		  	onkeyup: function(e) {
		  		let b = BIOS;
		  		if (!b.modal.opened) { //SECTIONS
		  			if (e.which == 39) {//Right arrow
		  				if (b.selItem+1 == b.menuList.length) { b.selItem = 0;} else {b.selItem++;};
		  				b.selSection = -1;
		  				do {
		  					if (b.selSection+1 == b.menuList[b.selItem].sections.length) { b.selSection = 0;} else {b.selSection++;};
		  				} while (b.menuList[b.selItem].sections[b.selSection].notuse);
			  		} else if (e.which == 37) {//Left arrow
			  			if (b.selItem-1 == -1) { b.selItem = b.menuList.length-1;} else {b.selItem--;};
			  			b.selSection = -1;
			  			do {
		  					if (b.selSection+1 == b.menuList[b.selItem].sections.length) { b.selSection = 0;} else {b.selSection++;};
		  				} while (b.menuList[b.selItem].sections[b.selSection].notuse);
			  		};
			  		if (e.which == 40) {//Down arrow
			  			do {
			  				if (b.selSection+1 == b.menuList[b.selItem].sections.length) { b.selSection = 0;} else {b.selSection++;};
			  			} while (b.menuList[b.selItem].sections[b.selSection].notuse);

			  		} else if (e.which == 38) {//Up arrow
			  			do {
			  				if (b.selSection-1 == -1) { b.selSection = b.menuList[b.selItem].sections.length-1;} else {b.selSection--;};
			  			} while (b.menuList[b.selItem].sections[b.selSection].notuse);
			  		};

			  		if (e.which == 13) {//Enter
			  			b.enterSection(b.menuList[b.selItem].sections[b.selSection]);
			  		};
		  		} else { //MODAL
		  			b.onModalKey(e.which);
		  		};
		  	}
	  	},

		mounted: function() {
		  	// Проверка нажати клавиш
		  	document.body.addEventListener('keyup', this.onkeyup,false);
		  	window.BIOS = this;
		  	let b = this;
		  	b.selSection = -1;
		  	do {
				if (b.selSection+1 == b.menuList[b.selItem].sections.length) { b.selSection = 0;} else {b.selSection++;};
			} while (b.menuList[b.selItem].sections[b.selSection].notuse);
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
		text-align: center;
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

	.bios .modal .message {
		text-align:center;
		padding:8px;
	}
	.bios .modal .btn {
	    text-align: center;
	    margin: 0 auto;
	    border: 2px solid;
	    width: fit-content;
	    padding: 2px 10px;
	    margin-bottom: 6px;
	    background-color:black;
	    color:white;
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