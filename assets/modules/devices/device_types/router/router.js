class router {
	#_ctx = {};
	#_vm = require('vm');
	#_booted = false;
	_boot_storage = false;
	#_power = false;
	constructor(a,b,c,d) {
		this._init(a,b,c,d);
		this._powerON();
	}

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
							try {
							   this.#_reloadContext();
							   this.#_vm.createContext(this.#_ctx);
							   this.#_vm.runInContext(f,this.#_ctx);
							} catch (e) {
								/*
		
									Здесь будет код с выводом ошибок в BOOT

								*/
								alert(e);
								break;
							}
							this.#_booted = true;
							break;
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

	_vm_run(code) { // Вполнение кода в контексте девайса
		try {
			this.#_vm.runInContext(code,this.#_ctx);
		} catch (e) {
			this._vm_wlog(e);
			return e
		};
	};

	_vm_create_thread(ctx) { // Создать независимый поток для выполнения кода
		this.#_vm.createContext(ctx);
		return ctx;
	};

	_vm_run_in_thread(code,ctx) { // Выполнение кода внутри независимого потока
		try {
			this.#_vm.runInContext(code,ctx);
		} catch (e) {
			this._vm_wlog(e);
			return e
		};
	};

	_vm_wlog(log) {
		try {
			alert(log)
			/*

				Здесь будет логирование в консоль бута

			*/
		} catch (e) {
			return e
		};
	};

	#_reloadContext = function() {
		this.#_ctx = {
			__hw : {
				__ints:this.interfaces,
				__device:this,
				__sys_storage: this._boot_storage,
				__csl:global.__csl
			},
			_time: {
				setInterval:setInterval,
				setTimeout:setTimeout,
				clearInterval:clearInterval,
				clearTimeout:clearTimeout
			},
			alert: alert,
		};
	};
	_updateCfg() { // Функция, которую надо будет переписать, ибо она должна сохранять изменения на сервере
		let __pth = require("path");
		let fcfg = __pth.join(global.__cfg.get().serversDir,global.__connectedServer.address,"devices.json");
	}
}
module.exports = router