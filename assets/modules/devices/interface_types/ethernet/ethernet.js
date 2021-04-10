class ethernet {
	#up = true;
	#events = {
		tx: {},
		rx: {}
	};

	#eventId = {};
	#connectify = ["twistedpair"]; // Устанавливаем возможность подключения кабельной продукции
	#connection = false;

	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
	};

	_canConnect(type){
		if (this.#connectify.indexOf(type)>-1) {
			return true;
		};
		return false;
	};

	_connect(to) {
		this.#connection = to;
	};

	_unconnect() {
		this.#connection = null;
	};

	_rx(data) {
		if (!this.#up) {return false;}
		return this.do("rx",data);
	};

	_tx(data) {
		let ok = false;
		if (!this.#up) {return false;}
		if (this.#connection !== false) {
			if (typeof(this.#connection._rx) == "function") {
				/*data.__inf = {
					mac: this.__mac
				};*/
				this.#connection._rx(data);
				this.do("tx",data);
				ok = true;
			};
			return ok;
		} else {
			return false;
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
		let ok = false;
		if (this.#events[event]) {
			for (var k in this.#events[event]) {
				if (typeof(this.#events[event][k]) == "function") {
					this.#events[event][k](data);
					ok = true;
				}
			}
		};

		if (this.__device._cmd) { // Если устройства использует систему команд
			this.__device._cmd._sendEvent(_cat+event,data);
			ok = true;
		};

		return ok;
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
			return this.ctx._tx(d);
		},this,false);
	};
}

module.exports = ethernet