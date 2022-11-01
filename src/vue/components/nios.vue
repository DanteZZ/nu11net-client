<template>
	<div v-if="showed" class="bios">
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
		</div>
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

				<div v-if="modal.type == 'auth'" class="body">
					<div class="message">
						{{modal.statuses[modal.status]}}
					</div>
				</div>
			</div>
		</div>
		<div v-if="disconnected" class="modalwrapper">
			<div class="modal-disconnected">
				Потеряна связь с сервером
			</div>
		</div>
	</div>
</template>

<script lang="js">
	import conf from "../../utils/conf";
	export default {
		name: "nios",
		data() {
			return {
			    title: "NIOS - Настройка CMOS",
				footer: `v${nw.App.manifest.version} (C) Copyright 2015-${new Date().getFullYear()}, Nu11Net, Ltd`,
				showed:true,
				selItem: 0,
				selSection: 0,
				disconnected: false,
				modal: {
					opened:false,
					title:"",
					selItem:0,
					input:"",
					selItems:[]
				},

				serverList: (conf.get().serverList) ? conf.get().serverList : {},
				userData: {
					selectedServer: (conf.get().selectedServer) ? conf.get().selectedServer : "",
					auth: {
						login: (conf.get().login) ? conf.get().login : "",
						password: (conf.get().password) ? conf.get().password : ""
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
								action:"modal",
								modal: {
									title:"Подключение к серверу",
									type:"auth",
									button:"Авторизация",
									statuses:{
										0:"Подключение к серверу...",
										200:"Авторизация...",
										300:"Авторизация прошла успешно!",
										401:"Неверный логин или пароль",
										402:"Неизвестная ошибка",
									},
									status:0,
								}
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
										401:"Не удалось подключиться к серверу",
									},
									status:0,
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
												402:"Неизвестная ошибка",
												403:"Слишком короткий логин или пароль"
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
								titleText:"Полноэкранный режим",
								title:`Полноэкранный режим [${conf.get().fullscreen ? "*" : "-"}]`,
								action(){
									if (!global?.deviceDisplay) {
										const nww = nw.Window.get()
										this.title = this.titleText+` [${nww.isFullscreen ? "-" : "*"}]`
										nww.toggleFullscreen();
										setTimeout(()=>{
											conf.set({fullscreen:nww.isFullscreen})
											conf.save();
										},200);
									}; 
								}
							},
							{
								title:`Выход`,
								action(){
									nw.App.quit();
								}
							}
						]
					}
				],

				modalTypes:{
					input_text:{
						onKey:{
							13:function(b){ //ENTER
								let model = b;
				  				const vars = b.modal.model.split('.');
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
								let model = b;
				  				const vars = b.modal.model.split('.');
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
								let model = b;
				  				const vars = b.modal.model.split('.');
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
								let model = b;
				  				const vars = b.modal.values.split('.');
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

					auth:{
						onKey:{
							13:function(b){ //ENTER
								if (b.modal.status !== 0) {
					  				b.closeModal();
								}
							},
							27:function(b){ //ESC
								b.closeModal();
							}
						},
						onOpen: async (b) => {
							try {
								const {login,password,selectedServer} = conf.get();
								await _ws.tryConnect(selectedServer);
								await _ws.loadServerInfo();
								await b.sleep(500);
								b.modal.status = 200;
								b.$forceUpdate();
								const {status,result} = await _ws.sendResponsableCommand("auth",{login,password});
								console.log(status,result);
								await b.sleep(500);
								b.modal.status = status;
								b.$forceUpdate();
								if (status == 300) { // Если авторизация прошла
									_ws.setAuth(result);
									_ws.checkFiles();
									global._dv.init(result.inf);
									_oge.play();
									_oge.buffer.scene.reloadDevices();
									b.showed = false;
									b.closeModal();
									_ws.setOnClose(b.onDisconnect);
									b.$forceUpdate();
								};
							} catch (e) {
								console.log(e);
								b.modal.status = 401;
							}				
						},
						onClose:function(b){
							b.modal.status = 0;
							b.modal.connected = false;
						}
					},

					register_connect:{
						onKey:{
							13:function(b){ //ENTER
								if (b.modal.status == 200) {
									let payloadVars = b.modal.payloadVars;
					  				let payloadModals = JSON.parse(JSON.stringify(b.modal.payloadModals));
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
						onOpen: async (b) => {
							try {
								await _ws.tryConnect(conf.get().selectedServer);
								await _ws.loadServerInfo();
								b.modal.connected = true;
								b.modal.status = 200;
								setTimeout(()=>{
									b.$forceUpdate();
								},500)
							} catch (e) {
								b.modal.connected = false;
								b.modal.status = 401;
							}					
						},
						onClose:function(b){
							b.modal.status = 0;
							b.modal.connected = false;
						}
					},

					register_process:{
						onKey:{
							13:function(b){ //ENTER
								if (b.modal.status !== 0) {
					  				b.closeModal();
								}
							},
							27:function(b){ //ESC
								b.closeModal();
							}
						},
						onOpen:async (b) => {
							const {login,password} =  b.modal.payloadVars;
							const {status} = await _ws.sendResponsableCommand("register",{login,password});
							if (status == 200) {
								b.userData.auth.login = login;
								b.userData.auth.password = password;
								b.updateCFG();
							}
							b.modal.status = status;
							b.$forceUpdate();
						},
						onClose:function(b){
							b.modal.payloadVars.login = "";
							b.modal.payloadVars.password = "";
						}
					},
				}
		  	}
	  	},

	  	methods: {
			sleep: async (time) => new Promise((res)=>setTimeout(res,time)),
		  	enterSection(section) {
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
			onDisconnect() {
				this.disconnected = true;
				this.showed = true;
				try {
					global._oge.buffer.scene.clearDevices();
					global.vmrun.clearAll();
				} catch (e) {
					console.log(e);
				};
				global._oge.pause();
				this.$forceUpdate();
			},
		  	getVar(name){
		  		let vars = name.split('.');
		  		let res = this;
		  		for (var k in vars) {
		  			res = res[vars[k]];
		  		};
		  		return res;
		  	},

		  	closeModal() {
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

		  	genTitle(arr,vals=false){
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
		  	openModal(modal) {
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

		  	modalFocusInput() {
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
		  		conf.set({
		  			serverList: this.serverList,
		  			selectedServer: this.userData.selectedServer,
		  			login: this.userData.auth.login,
		  			password: this.userData.auth.password
		  		});
		  		conf.save();
		  	},

		  	onkeyup(e) {
		  		let b = BIOS;
		  		if (!b.modal.opened && !b.disconnected) { //SECTIONS
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

					if (e.which == 27) {//ESC
			  			if (_ws.authenticated) {
							if (b.showed) {
								_oge.play();
								b.showed = false;
							} else {
								_oge.pause();
								b.showed = true;
							}
						}
			  		};
				} else if (b.disconnected) {
					if ((e.which == 13) || (e.which == 27)) {//Enter
			  			b.disconnected = false;
			  		};
		  		} else { //MODAL
		  			b.onModalKey(e.which);
		  		};
		  	}
	  	},

		mounted() {
		  	// Проверка нажати клавиш
		  	document.body.addEventListener('keyup', this.onkeyup,false);
		  	window.BIOS = this;
		  	let b = this;
		  	b.selSection = -1;
		  	do {
				if (b.selSection+1 == b.menuList[b.selItem].sections.length) { b.selSection = 0;} else {b.selSection++;};
			} while (b.menuList[b.selItem].sections[b.selSection].notuse);
		},
		beforeDestroy() {
			document.body.removeEventListener('keyup', this.onkeyup,false);
		}
	}
</script>