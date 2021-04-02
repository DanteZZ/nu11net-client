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

	_reg(command,func,async = false) { // Зарегистрировать комманду
		this.#_commands[command] = {
			async:async,
			fn:func
		};
	};

	_remove(name) {
		if (this._is(name)) {
			delete this.#_commands[name];
		}
	};

	_is(name) {
		if (this.#_commands[name]) { return true; }
		return false;
	};

	_get(name) {
		if (this._is(name)) {
			return this.#_commands[name]
		} else {
			return false;
		};
	};

	_onMessageSub(msg) {
		let cmd = this; if (cmd.__device) {cmd = cmd.__device._cmd;};

		switch (msg.type) {
			case "command":
				cmd._onCommand(cmd,msg);

			break;
			case "response":
				cmd._onResponse(cmd,msg);
			break;
		}
	}

	_onMessage(msg) { // Обработка входящих данных
		let cmd = this; if (cmd.__device) {cmd = cmd.__device._cmd;};
		switch (msg.type) {
			case "command":
				try {
					cmd._onCommand(cmd,msg);
				} catch (e) {
					if (cmd._main) {
						global.__csl.log("error",e,msg);
					}
				}
			break;
			case "response":
				try {
					cmd._onResponse(cmd,msg);
				} catch (e) {
					if (cmd._main) {
						global.__csl.log("error",e,msg);
					}
				}

			break;
			case "log":
				if (cmd._main) {
					global.__csl.log(msg);
				}
			break;
		}
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
}
module.exports = new CMD;