class ethernet {
	up = true;
	mac = "A1:B2:C3:D4:E5:F6";
	ip = {
		address:""
	};
	connection = false;
	events = {
		tx: {},
		rx: {}
	};
	eventId = {};
	constructor(a,b) {
		this._init(a,b) // Инициализация интерфейса
	};

	_recieve(data) {
		if (!this.up) {return false;}
		for (var k in this.events.rx) {
			let f = this.events.rx[k];
			if (typeof(f) == "function") {
				f(data);
			};
		};
	};

	_send(data) {
		if (!this.up) {return false;}
		if (this.connection !== false) {
			if (typeof(this.connection._recieve) == "function") {
				data._inf = {
					mac: this.mac,
					ip: this.ip
				};
				this.connection._recieve(data);
				return true;
			} else {
				return false;
			}
		}
	};

	on(type,callback) {
		if (this.events[type]) {
			let id = 0;
			do  { id = this.genRandId(); } while (this.events[type][id]);
			this.events[type][id] = callback;
			this.eventId[id] = type;
			return id;
		} else {
			return false;
		}
	};
	do(event,data) {
		if (this.events[event]) {
			for (var k in this.events[event]) {
				if (typeof(this.events[event][k]) == "function") {
					this.events[event][k](data);
				}
			}
		};
	};
	rme(id) {
		let type = this.eventId[id]
		if (type) {
			delete(this.events[type][id]);
		};
	};
	genRandId() {
		return Math.random().toString(36).slice(-8);
	};
}

module.exports = ethernet