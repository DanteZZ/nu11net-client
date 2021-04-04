class ethernet {
	#up = true;
	#connection = false;
	#events = {
		tx: {},
		rx: {}
	};
	#eventId = {};
	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
	};

	_recieve(data) {
		if (!this.#up) {return false;}
		return this.do("rx",data);
	};

	_send(data) {
		if (!this.#up) {return false;}
		if (this.#connection !== false) {
			if (typeof(this.#connection._recieve) == "function") {
				data.__inf = {
					mac: this.__mac
				};
				this.#connection._recieve(data);
				this.do("tx",data);
				return true;
			} else {
				return false;
			}
		}
	};

	on(type,callback) {
		if (this.#events[type]) {
			let id = 0;
			do  { id = this.genRandId(); } while (this.#events[type][id]);
			this.#events[type][id] = callback;
			this.#eventId[id] = type;
			return id;
		} else {
			return false;
		}
	};
	do(event,data) {
		let _cat = "interfaces/"+this.__type+"/"+this._id+"/";
		
		if (this.#events[event]) {
			for (var k in this.#events[event]) {
				if (typeof(this.#events[event][k]) == "function") {
					this.#events[event][k](data);
					return true;
				}
			}
		};

		if (this.__device._cmd) { // Если устройства использует систему команд
			this.__device._cmd._sendEvent(_cat+event,data);
			return true;
		};
		
		return false;
	};
	rme(id) {
		let type = this.#eventId[id]
		if (type) {
			delete(this.#events[type][id]);
		};
	};
	genRandId() {
		return Math.random().toString(36).slice(-8);
	};

	__initCommands = function() {
		/* Запишем путь к командам и путь с конечным слешом */
		let cat = "interfaces/"+this.__type+"/"+this._id;
		let catf = cat+"/";
		let cmd = this.__device._cmd;
		cmd._regCat(cat); //Регаем каталог

		/* SEND */
		cmd._reg(catf+"send",function(d) {
			return this.ctx._scanDir(d.data);
		},this,false);
	};
}

module.exports = ethernet