class CMD {
	#_commands = {};
	#_selfCommands = {};
	#_events = {};
	#_selfEvents = {};
	_cmdBuffer = {};
	_cmdBuffNum = 0;
	#_vm = false;
	#_poster = false;
	_main = false;
	_setVM(vm) {
		this.#_vm = vm;
	};

	_setPoster(poster) {
		this.#_poster = poster;
	};

	_clear() {
		this.#_commands = {};
		this.#_events = {};
		this._cmdBuffer = {};
		this._cmdBuffNum = 0;
	};

	_commands(self = false) {
		return self ? this.#_selfCommands : this.#_commands;
	}

	/*
		COMMANDS
	*/
	_reg(command, func, ctx = null, async = false, self = false) { // Зарегистрировать комманду
		let p = command.split("/");
		let n = p.pop(); // Название создаваемой команды
		let ct = self ? this.#_selfCommands : this.#_commands; // Текущий директория поиска
		for (var k in p) {
			if (ct[p[k]]) {
				ct = ct[p[k]]
			} else {
				return false;
			}
		};
		ct[n] = {
			async: async,
			fn: func,
			ctx: ctx
		};
		if (ctx == null) {
			ct[n].fn = ct[n].fn?.bind({});
		} else {
			ct[n].fn = ct[n].fn?.bind(ct[n].ctx);
		};
		return true;
	};

	_regCat(name, self = false) {
		let p = name.split("/");
		let n = p.pop(); // Название создаваемой категории
		let ct = self ? this.#_selfCommands : this.#_commands; // Текущий директория поиска
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

	_remove(name, self = false) {
		let p = name.split("/");
		let n = p.pop(); // Название искаемой команды
		let ct = self ? this.#_selfCommands : this.#_commands; // Текущий директория поиска
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

	_is(name, self = false) {
		let p = name.split("/");
		let n = p.pop(); // Название искаемой команды
		let ct = self ? this.#_selfCommands : this.#_commands; // Текущий директория поиска
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

	// SELF

	_regSelf(command, func, ctx = null, async = false) {
		return this._reg(command, func, ctx, async, true);
	}

	_regSelfCat(name) {
		return this._regCat(name, true);
	}

	_removeSelf(name) {
		return this._remove(name, true);
	}

	_isSelf(name) {
		return this._is(name, true);
	}

	_getSelf(name) {
		return this._isSelf(name);
	}

	/*
		EVENTS
	*/
	_listenEvent(event, func = () => { }, ctx = null) { // Прослушивать Event
		const evvs = this.#_events;
		if (!evvs[event]) { // Если в массиве Event'ов такого ещё не прослушивалось
			evvs[event] = [];
		};
		let p = {
			fn: func,
			ctx: ctx
		};
		if (ctx == null) {
			p.fn = p.fn.bind({});
		} else {
			p.fn = p.fn.bind(p.ctx);
		};
		evvs[event].push(p);
		return event + "#" + (evvs[event].length - 1);
	};
	_unlistenEvent(id) { // Перестать прослушивать Event
		const evvs = this.#_events;
		let p = id.split("#");
		let event = p[0];
		id = p[1];
		if (typeof (evvs[event][id]) == "object") {// Если такой Event существует
			evvs[event][id] = null;
			return true;
		} else {
			return false;
		}
	};
	_doEvent(event, data = false) {
		const evvs = this.#_events;
		console.log(event, evvs);
		if (typeof (evvs[event]) == "object") {

			for (var k in evvs[event]) {
				let ev = evvs[event][k];
				if (ev.fn) {
					try {
						ev.fn(data, ev.ctx);
					} catch (e) {
						this._sendError(e);
					}
				}
			}
		}
	};

	_onMessage(msg) { // Обработка входящих данных
		let cmd = this; if (cmd.__device) { cmd = cmd.__device._cmd; };
		if (cmd._main) {
			switch (msg.type) {
				case "command":
					try {
						cmd._onCommand(cmd, msg);
					} catch (e) {
						global.__csl.error(e, msg);
					}
					break;
				case "response":
					try {
						cmd._onResponse(cmd, msg);
					} catch (e) {
						global.__csl.error(e, msg);
					}
					break;
				case "log":
					global.__csl.log("Log from", this.__device._id, ":\n", msg.data);
					break;
				case "error":
					global.__csl.error("Error from", this.__device._id, ":\n", msg.data);
					break;
				case "event":
					try {
						cmd._onEvent(cmd, msg);
					} catch (e) {
						global.__csl.error(e, msg);
					}
					break;
			}
		} else {
			switch (msg.type) {
				case "command":
					cmd._onCommand(cmd, msg);
					break;
				case "response":
					cmd._onResponse(cmd, msg);
					break;
				case "event":
					cmd._onEvent(cmd, msg);
					break;
			}
		};
	};

	_onCommand(__device, msg) { // Функция обработки запроса команды
		let cmd = __device._get(msg.command);
		if (cmd) { // Если такая команда зарегистрирована
			if (!cmd.async) { // Если функция асинхронна
				let res = cmd.fn(msg.data);
				if (typeof (msg.bufferId) !== "undefined") { // Если запрашивается возврат
					__device._sendResponse(res, msg.bufferId);
				};
			} else {

				if (typeof (msg.bufferId) !== "undefined") { // Если запрашивается возврат
					cmd.fn(msg.data, function (data) {
						__device._sendResponse(data, msg.bufferId);
					});
				} else {
					cmd.fn(msg.data, function () { });
				};
			};
		} else {
			if (__device._main) {
				global.__csl.info("[MAIN] Undefined command: " + msg.command);
				if (msg.bufferId) {
					__device._sendResponse(null, msg.bufferId);
				};
			} else {
				__device._sendError("Undefined command: " + msg.command);
			};
		}
	};

	_onEvent(__device, msg) { // Функция обработки приходящего Event'а
		__device._doEvent(msg.event, msg.data);
	};

	_onResponse(__device, msg) { // Функция обработки ответа
		if (__device._cmdBuffer[msg.bufferId]) {
			__device._cmdBuffer[msg.bufferId].fn(msg.data, __device._cmdBuffer[msg.bufferId].ctx);
			delete __device._cmdBuffer[msg.bufferId];
		};
	};

	_sendCommand(command, data = false, callback = false, ctx = null) { // Отправить комманду в proc
		if (!this.#_vm) { return false; };
		const self = this._getSelf(command);

		if (self) {
			if (callback) {
				if (self.async) {
					self.fn(data, callback)
				} else {
					callback(self.fn(data))
				}
			} else {
				self.fn(data);
			}
			return true;
		}

		let pay = {
			type: "command",
			command: command,
			data: data
		};
		if (command) { // Если пришла комманда
			if (callback) { // Если есть коллбек, и нужно слушать ответ
				this._cmdBuffer[this._cmdBuffNum] = { fn: callback, ctx: ctx }; // Записываем коллбек ожидания
				pay.bufferId = this._cmdBuffNum;
				this.sendPost(pay);
				this._cmdBuffNum++;
			} else { // Если ответ не нужен
				this.sendPost(pay);
			};
			return true;
		} else {
			return false;
		}
	};

	_sendResponse(data = false, bufferId = false) { // Отправить ответ в proc
		if (!this.#_vm) { return false; };
		let pay = {
			type: "response",
			data: data,
			bufferId: bufferId
		};
		this.sendPost(pay);
	};

	_sendEvent(event, data = false) { // Отправить Event в proc
		if (!this.#_vm) { return false; };
		let pay = {
			type: "event",
			event: event,
			data: data
		};
		this.sendPost(pay);

	};

	_sendLog(data = false) { // Отправить ответ в proc
		if (!this.#_vm) { return false; };
		if (!this._main) {
			let pay = {
				type: "log",
				data: data
			};
			this.sendPost(pay);
		};
	};

	_sendError(data = false) { // Отправить ответ в proc
		if (!this.#_vm) { return false; };
		if (!this._main) {
			let pay = {
				type: "error",
				data: data
			};
			this.sendPost(pay);
		};
	};

	sendPost(pay) {

		if (this._main) {
			pay = {
				pid: this.#_vm.pid,
				data: pay
			};
		} else {
			pay = {
				pid: this.#_vm._pid,
				data: pay
			};
		}
		if (this.#_poster.postMessage !== undefined) {
			this.#_poster.postMessage(pay);
		};
	};
}
module.exports = new CMD;