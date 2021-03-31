class router {
	#_ctx = {};

	#_fork = require('child_process').fork;
	#_proc = false;
	
	#_booted = false;
	_boot_storage = false;
	
	#_power = false;

	#_cmdBuffer = {};
	#_cmdBuffNum = 0;

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

	#_boot = function(script) {
		this.#_reloadContext();
		this.#_proc = this.#_fork('assets/scripts/js/vmrunner.js');
		this.#_proc.on('message', this._onMessage);
		this._sendCommand("setCTX",{context:this.#_ctx});
		this._sendCommand("runScript",{script:script});
		this.#_booted = true;
	};

	_sendCommand(command,data=false,callback=false) { // Отправить комманду в proc
		let pay = {
            type:"command",
            command:command,
            data:data
        };
		if (command) { // Если пришла комманда
			if (callback) { // Если есть коллбек, и нужно слушать ответ
				this.#_cmdBuffer[this.#_cmdBuffNum] = callback; // Записываем коллбек ожидания
				pay.bufferId = this.#_cmdBuffNum;
				this.#_proc.send(pay);
				this.#_cmdBuffNum++;
			} else { // Если ответ не нужен
				this.#_proc.send(pay);
			};
			return true;
		} else {
			return false;
		}	

	};

	_sendResponse(data=false,bufferId=false) { // Отправить ответ в proc
		let pay = {
            type:"response",
            data:data,
            bufferId:bufferId
        };
		this.#_proc.send(pay);
	};

	_onMessage = function(msg) { // Обработка входящих данных
		global.__csl.log(msg);
		switch (msg.type) {
			case "command":
				this._onCommand(msg);
			break;
			case "response":
				this._onReponse(msg);
			break;
			case "log":
				global.__csl.log(msg);
			break;
		}
	};

	_onCommand = function(msg) { // Функция обработки запроса команды
		if (msg.command) {
			if (!msg.bufferId) {
				// Если команда не должна ничего возвращать
			} else {
				// Если должна вернуть
			}
		}
	};

	_onResponse = function(msg) { // Функция обработки ответа
		if (this.#_cmdBuffer[msg.bufferId]) {
		  	this.#_cmdBuffer[msg.bufferId](msg.data);
		  	delete cmdBuffer[msg.bufferId];
		};
	};

	#_reloadContext = function() {
		this.#_ctx = {
			hi:1
		};
	};
	_updateCfg() { // Функция, которую надо будет переписать, ибо она должна сохранять изменения на сервере
		let __pth = require("path");
		let fcfg = __pth.join(global.__cfg.get().serversDir,global.__connectedServer.address,"devices.json");
	}
}
module.exports = router