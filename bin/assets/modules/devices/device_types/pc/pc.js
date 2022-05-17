class pc {
	#_ctx = {};
	#_vm = false;
	#_booted = false;
	_boot_storage = false;
	#_power = false;

	__contextmenu = {
		"check":{
			label: "Перезагрузить ПК",
			func: function() {
				this.__restart();
			}
		}
	}

	constructor(a,b,c,d) {
		this._init(a,b,c,d);
	};

	__powerON() { // Включить устройство
		this._status = 1;
		if (this.#_power) {return false;} else {this.#_power = true; this.#_booted = false;};
		this._initCommands();
		if (this.__boot) { // Проверка BOOT накопителя
			let b_list = [];
			if (this.__boot.priority) { // Если есть BOOT запись накопителей
				for (var k in this.__boot.priority) { // Проверяем записи, и заменяем ID на интерфейсы
					let st = this.__boot.priority[k];
					if (typeof(st) == "string") {
						let intr = this.interfaces[st];
						if (!intr || intr.__type !== "storage") { // Если интерфейса не существует или интерфейс не является накопителем, сбрасываем записи
							b_list = [];
							break;
						} else {
							b_list.push(intr);
						}
					} else {
						if (st.__type !== "storage") {
							b_list = [];
							break;
						} else {
							b_list.push(st);
						};
					};
				};
			};

			if (!b_list.length) { // Если бут лист пустой, пытаемся сгенерить его
				let ints = this._getInterfacesByType("storage");
				for (var k in ints) {
					b_list.push(ints[k]);
				};
			};

			if (b_list.length) { // Если накопители с возможность загрузки, пытаемся их бутнуть
				this.__boot.priority = b_list;

				for (var k in this.__boot.priority) { // Перебираем все накопители по порядку

					let st = this.__boot.priority[k];
					if (st.__boot_file) { // Если есть boot запись на носителе
						let f = st._readData(st.__boot_file);
						this._boot_storage = st;
						if (f) {// Если файл boot есть на носителе, то пытаемся его запустить
							this.#_boot(st.__boot_file,f); // пытаемся Бутнуть файл
						}
						
					}
				};
			} else { // Если ничерта не нашли, ничего не делаем :/
				return false;
			};

		} else { // Если нет BOOT секции, то и не пытаемся его грузить, а вообще тут надо будет сделать генератор BOOT записи
			return false;
		}
	};

	__powerOFF() { // Выключить устройство
		if (this._status == 0) {return false;}
		this.#_booted = false;
		this.#_power = false;
		this.#_vm.remove();
		this.#_ctx = {};
		this._cmd._clear();
		this._status = 0;
		this._clearCommands();
	};

	__restart() {
		this.__powerOFF();
		this.__powerON();
	};

	#_boot = function(path,script) {
		let _device = this;

		this._reloadInterfaceCommands();

		this.#_reloadContext();
		global.vmrun.createVM(function(vm){
			this.#_vm = vm;
			this.#_vm.__device = this;
			this._cmd._setVM(this.#_vm);
			this._cmd._setPoster(this.#_vm.contentWindow);
			this.#_vm.onmsg = this._cmd._onMessage;
			
			this._cmd._sendCommand("vm/setCTX",{context:this.#_ctx},function(res){
				if (res) {global.__csl.log("Device "+_device._id+": vm.context created");}
			});
			
			this._cmd._sendCommand("vm/runScript",{script:script},function(res){
				if (res) {global.__csl.log("Device "+_device._id+": boot file executed");}
			});

			this.#_bootend(path,true);
		},this);
	};

	#_bootend = function(path,res) {
		if (res) {
			this.#_booted = true;
		} else {
			global.__csl.error("Can't boot: "+path);
		}
	}

	#_reloadContext = function() {
		this.#_ctx = {
			__boot:{
				storage:this._boot_storage._id
			},
			__interfaces:this._interfacesList()
		};
	};

	_updateCfg() { // Функция, которую надо будет переписать, ибо она должна сохранять изменения на сервере
		let __pth = require("path");
		let fcfg = __pth.join(global.__cfg.get().serversDir,global.__connectedServer.address,"devices.json");
	};

	_interfacesList(type=false) { // Получить список интерфесов по типу
		let res = [];
		for (var n in this.interfaces) {
			if (!type) {
				res.push({name:n,type:this.interfaces[n].__type});
			} else {
				if (this.interfaces[n].__type == type) {
					res.push({name:n,type:this.interfaces[n].__type});
				}
			}
			
		}
		return res;
	}

	_getWV() {
		return this.#_vm;
	}

	_clearCommands() {
		this._cmd._remove("device");
	};

	_initCommands() { // Регистрация команд устройства
		/*
			DEVICE
		*/

		this._cmd._regCat("device"); // CAT
		this._cmd._reg("device/restart",function(){
			this.__restart();
		},this);
		this._cmd._reg("device/poweroff",function(){
			this.__powerOFF();
		},this);

		/*
			INTERFACES
		*/

		this._cmd._regCat("interfaces"); // CAT
		this._cmd._reg("interfaces/list",function(){
			return this._interfacesList();
		},this);
		this._cmd._reg("interfaces/listbytype",function(d){
			return this._interfacesList(d.type);
		},this);
	};
}
module.exports = pc