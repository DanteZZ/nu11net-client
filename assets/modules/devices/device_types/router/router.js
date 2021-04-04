class router {
	#_ctx = {};

	#_fork = require('child_process').fork;
	#_proc = false;
	
	#_booted = false;
	_boot_storage = false;
	
	#_power = false;

	constructor(a,b,c,d) {
		this._init(a,b,c,d);
		this._initCommands();
		this._powerON();
	};

	_powerON() { // Включить устройство
		if (this.#_power) {return false;} else {this.#_power = true; this.#_booted = false;};
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
							this.#_boot(f); // пытаемся Бутнуть файл
							if (this.#_booted) { // Если бут прошёл успешно, то отлично
								break;
							} else {
								alert("Can't boot "+st.__boot_file)
							};
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

	_powerOFF() { // Выключить устройство
		this.#_booted = false;
		this.#_power = false;
		this.#_proc.kill();
		this.#_ctx = {};
		this._cmd._clear();
	};

	_restart() {
		this._powerOFF();
		this._powerON();
	};

	#_boot = function(script) {
		let _device = this;

		this._reloadInterfaceCommands();
		this._reloadInterfaceEvents();

		this.#_reloadContext();
		this.#_proc = this.#_fork('assets/modules/vmrunner.js');
		this.#_proc.__device = this;
		this._cmd._setProc(this.#_proc);
		this._proc = this.#_proc;
		this.#_proc.on('message', this._cmd._onMessage);
		
		this._cmd._sendCommand("vm/setCTX",{context:this.#_ctx},function(res){
			if (res) {global.__csl.log("Device "+_device._id+": vm.context created");}
		});
		
		this._cmd._sendCommand("vm/runScript",{script:script},function(res){
			if (res) {global.__csl.log("Device "+_device._id+": boot file executed");}
		});

		this.#_booted = true;

	};

	#_reloadContext = function() {
		this.#_ctx = {
			hi:1
		};
	};

	_updateCfg() { // Функция, которую надо будет переписать, ибо она должна сохранять изменения на сервере
		let __pth = require("path");
		let fcfg = __pth.join(global.__cfg.get().serversDir,global.__connectedServer.address,"devices.json");
	};

	_initCommands() { // Регистрация команд устройства
		this._cmd._regCat("device");
		this._cmd._reg("device/restart",function(){
			this.ctx._restart();
		},this);
		this._cmd._reg("device/powerOFF",function(){
			this.ctx._powerOFF();
		},this);
	};
}
module.exports = router