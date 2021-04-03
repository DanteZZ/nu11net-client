class CMD {
	#_commands = {};
	_cmdBuffer = {};
	_cmdBuffNum = 0;
	#_proc = false;
	_main = false;
	_setProc(proc) {
		this.#_proc = proc;
	};

	_clear() {
		this.#_commands = {};
		this._cmdBuffer = {};
		this._cmdBuffNum = 0;
	};

	_commands() {
		return this.#_commands;
	}

	_reg(command,func,ctx=false,async = false) { // Зарегистрировать комманду
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
			}
		} else {
			switch (msg.type) {
				case "command":
					cmd._onCommand(cmd,msg);
				break;
				case "response":
					cmd._onResponse(cmd,msg);
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

				if (msg.bufferId !== false) { // Если запрашивается возврат
					cmd.fn(msg.data,function(data){
						__device._sendResponse(data,msg.bufferId);
					});
				} else {
					cmd.fn(msg.data,function(){});
				};
			};
			
		}
	};

	_onResponse(__device,msg) { // Функция обработки ответа
		if (__device._cmdBuffer[msg.bufferId]) {
		  	__device._cmdBuffer[msg.bufferId](msg.data);
		  	delete __device._cmdBuffer[msg.bufferId];
		};
	};

	_sendCommand(command,data=false,callback=false) { // Отправить комманду в proc
		
		let pay = {
            type:"command",
            command:command,
            data:data
        };
		if (command) { // Если пришла комманда
			if (callback) { // Если есть коллбек, и нужно слушать ответ
				this._cmdBuffer[this._cmdBuffNum] = callback; // Записываем коллбек ожидания
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