class CMD {
	#_commands = {};
	#_events = {};
	_cmdBuffer = {};
	_cmdBuffNum = 0;
	#_proc = false;
	_main = false;
	_setProc(proc) {
		this.#_proc = proc;
	};

	_clear() {
		this.#_commands = {};
		this.#_events = {};
		this._cmdBuffer = {};
		this._cmdBuffNum = 0;
	};

	_commands() {
		return this.#_commands;
	}

	/*
		COMMANDS
	*/
	_reg(command,func,ctx=null,async = false) { // Зарегистрировать комманду
		let p = command.split("/");
		let n = p.pop(); // Название создаваемой команды
		let ct = this.#_commands; // Текущий директория поиска
		for (var k in p) {
			if (ct[p[k]]) {
				ct = ct[p[k]]
			} else {
				return false;
			}
		};
		ct[n] = {
			async:async,
			fn:func,
			ctx:ctx
		};
		return true;
	};

	_regCat(name) {
		let p = name.split("/");
		let n = p.pop(); // Название создаваемой категории
		let ct = this.#_commands; // Текущий директория поиска
		for (var k in p) {
			if (ct[p[k]]) {
				ct = ct[p[k]]
			} else {
				ct[p[k]] = {};
				ct = ct[p[k]];
			}
		};
		ct[n] = {};
		return true;
	};

	_remove(name) {
		let p = name.split("/");
		let n = p.pop(); // Название искаемой команды
		let ct = this.#_commands; // Текущий директория поиска
		for (var k in p) {
			if (ct[p[k]]) {
				ct = ct[p[k]]
			} else {
				return false;
			}
		};

		if (ct[n]) { delete ct[n]; return true; }
		return false;
	};

	_is(name) {
		let p = name.split("/");
		let n = p.pop(); // Название искаемой команды
		let ct = this.#_commands; // Текущий директория поиска
		for (var k in p) {
			if (ct[p[k]]) {
				ct = ct[p[k]]
			} else {
				return false;
			}
		};

		if (ct[n]) { return ct[n]; }
		return false;
	};

	_get(name) {
		return this._is(name);
	};

	/*
		EVENTS
	*/
	_listenEvent(event,func = ()=>{},ctx=null) { // Прослушивать Event
		if (!this.#_events[event]) { // Если в массиве Event'ов такого ещё не прослушивалось
			this.#_events[event] = [];
		};
		this.#_events[event].push({
			fn: func,
			ctx:ctx
		});
		return event+"#"+(this.#_events[event].length-1);
	};
	_unlistenEvent(id) { // Перестать прослушивать Event
		let p = id.split("#");
		let event = p[0];
		id = p[1];
		if (typeof(this.#_events[event][id]) == "object") {// Если такой Event существует
			this.#_events[event][id] = null;
			return true;
		} else {
			return false;
		}
	};
	_doEvent(event,data=false) {
		if (typeof(this.#_events[event]) == "object") {
			for (var k in this.#_events[event]) {
				let ev = this.#_events[event][k];
				if (ev.fn) {
					try {
						ev.fn(data,ev.ctx);
					} catch (e) {
						this._sendError(e);
					}
				}
			}
		}
	};

	_onMessage(msg) { // Обработка входящих данных
		let cmd = this; if (cmd.__device) {cmd = cmd.__device._cmd;};
		if (cmd._main) {
			switch (msg.type) {
				case "command":
					try {
						cmd._onCommand(cmd,msg);
					} catch (e) {
						global.__csl.error(e,msg);
					}
				break;
				case "response":
					try {
						cmd._onResponse(cmd,msg);
					} catch (e) {
						global.__csl.error(e,msg);
					}
				break;
				case "log":
					global.__csl.log("Log from",this.__device._id,":\n",msg.data);
				break;
				case "error":
					global.__csl.error("Error from",this.__device._id,":\n",msg.data);
				break;
				case "event":
					try {
						cmd._onEvent(cmd,msg);
					} catch (e) {
						global.__csl.error(e,msg);
					}
				break;
			}
		} else {
			switch (msg.type) {
				case "command":
					cmd._onCommand(cmd,msg);
				break;
				case "response":
					cmd._onResponse(cmd,msg);
				break;
				case "event":
					cmd._onEvent(cmd,msg);
				break;
			}
		};
	};

	_onCommand(__device,msg) { // Функция обработки запроса команды
		let cmd = __device._get(msg.command);
		if (cmd) { // Если такая команда зарегистрирована
			if (!cmd.async) { // Если функция асинхронна
				let res = cmd.fn(msg.data);
				if (typeof(msg.bufferId) !== "undefined") { // Если запрашивается возврат
					__device._sendResponse(res,msg.bufferId);	
				};
			} else {

				if (typeof(msg.bufferId) !== "undefined") { // Если запрашивается возврат
					cmd.fn(msg.data,function(data){
						__device._sendResponse(data,msg.bufferId);
					});
				} else {
					cmd.fn(msg.data,function(){});
				};
			};
		} else {
			if (__device._main) {
				global.__csl.error("Undefined command: "+msg.command);
			} else {
				__device._sendError("Undefined command: "+msg.command);
			};
		}
	};

	_onEvent(__device,msg) { // Функция обработки приходящего Event'а
		__device._doEvent(msg.event,msg.data);
	};

	_onResponse(__device,msg) { // Функция обработки ответа
		if (__device._cmdBuffer[msg.bufferId]) {
		  	__device._cmdBuffer[msg.bufferId].fn(msg.data,__device._cmdBuffer[msg.bufferId].ctx);
		  	delete __device._cmdBuffer[msg.bufferId];
		};
	};

	_sendCommand(command,data=false,callback=false,ctx=null) { // Отправить комманду в proc
		let pay = {
            type:"command",
            command:command,
            data:data
        };
		if (command) { // Если пришла комманда
			if (callback) { // Если есть коллбек, и нужно слушать ответ
				this._cmdBuffer[this._cmdBuffNum] = {fn:callback,ctx:ctx}; // Записываем коллбек ожидания
				pay.bufferId = this._cmdBuffNum;
				this.#_proc.send(pay);
				this._cmdBuffNum++;
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

	_sendEvent(event,data=false) { // Отправить Event в proc
		let pay = {
            type:"event",
            event:event,
            data:data
        };
		this.#_proc.send(pay);
	};

	_sendLog(data=false) { // Отправить ответ в proc
		if (!this._main) {
			let pay = {
	            type:"log",
	            data:data
	        };
			this.#_proc.send(pay);
		};
	};

	_sendError(data=false) { // Отправить ответ в proc
		if (!this._main) {
			let pay = {
	            type:"error",
	            data:data
	        };
			this.#_proc.send(pay);
		};
	};
}
module.exports = new CMD;