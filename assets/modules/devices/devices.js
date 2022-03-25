module.exports = {
	_device_list:{},
	_cable_list:{},
	_connection_list:{},
	_old_connection_list:{},
	init:function(inf){ 

		this._device_list = {};
		this._cable_list = {};
		this._connection_list = {};
		this._old_connection_list = {};

		this._device_types = this.requireUncached("./device_types.js").init();
		this._interface_types = this.requireUncached("./interface_types.js").init();
		this._cable_types = this.requireUncached("./cable_types.js");

		for (var dn in this._device_types) {
			Object.assign(this._device_types[dn].prototype, this._device);
		};

		for (var inn in this._interface_types) {
			Object.assign(this._interface_types[inn].prototype, this._interface);
		};

		for (var cn in this._cable_types) {
			Object.assign(this._interface_types[cn].prototype, this._interface);
		};

		this._loadDevices(inf.devices);
		this._loadCables(inf.cables);
		this._reloadConnections(inf.connections);
		return this;
	},

	_loadDevices: function(list) {
		for (var id in list) {
			if (this._device_types[list[id].type]) {
				let dev = list[id];
				this._device_list[id] = new this._device_types[list[id].type](id,list[id],list[id].type,this._interface_types);
				if (dev.power) {
					this._device_list[id].__powerON();
				};
			};
		};
	},
	_loadCables: function(list) {
		for (var id in list) {
			if (this._cable_types.is([list[id].type])) { 
				this._cable_list[id] = new this._cable(id,list[id].type);
			};
		};
	},
	_reloadConnections: function(inf=false){
		if (inf) {
			this._removeConnections();
			this._connection_list = inf
		};
		for (var id in this._cable_list) {
			if (this._connection_list[id]) {
				let clist = this._connection_list[id];
				let cons = [];
				for (var i = 0; i<2;i++) { // Перебираем массив с подключениями
					con = clist[i].split("#");
					let dv = con[0];
					let inn = con[1];
					cons[i] = this._device_list[dv].interfaces[inn];
				};
				if (cons[0].__canConnect(this._cable_list[id]._type) && cons[1].__canConnect(this._cable_list[id]._type)){
					cons[0].__connect(cons[1]);
					cons[1].__connect(cons[0]);
					this._cable_list[id].in_use = true;
				} else {
					this._cable_list[id].in_use = false;
				};
				
			} else {
				this._cable_list[id].in_use = false;
			};
		};
	},
	_removeConnections:function() {
		if (!Object.keys(this._connection_list).length) {return false};
		for (var id in this._cable_list) {
			if (this._connection_list[id]) {
				this._cable_list[id].in_use = false;
				let clist = this._connection_list[id];
				let cons = [];
				for (var i = 0; i<2;i++) { // Перебираем массив с подключениями
					con = clist[i].split("#");
					let dv = con[0];
					let inn = con[1];
					cons[i] = this._device_list[dv].interfaces[inn];
				};
				cons[0].__unconnect();
				cons[1].__unconnect();
			} else {
				this._cable_list[id].in_use = false;
			};
		};
	},
	_device: {
		_init(id,inf,type,ctypes) {
			this.interfaces = [];
			this._id = id;
			delete require.cache[require.resolve("assets/modules/commands.js")];
		    this._cmd = require("assets/modules/commands.js");
		    this._cmd._main = true;
		    this._status = 0; // Статус устройства
			for (var k in inf) {
				switch (k) {
					case "interfaces":
						for (var id in inf.interfaces) {
							if (ctypes[inf.interfaces[id].type]) {
								this.interfaces[id] = new ctypes[inf.interfaces[id].type](id,this,inf.interfaces[id],inf.interfaces[id].type);
								if (this.interfaces[id].connectify) { // Если интерфейс использует систему кабелей
									this.interfaces[id].__canConnect = function(type){return this.connectify.indexOf(type)>-1 ? true : false};
									this.interfaces[id].__connect = function(to) {this.connection = to;};
									this.interfaces[id].__unconnect = function() {this.connection = null;};
								}
							};
						};
					break;
					default: this["__"+k] = inf[k]; break;
				}
			};
		},
		_isInterface(id) {
			if (this.interfaces[id]) {return true;} else {return false;}; 
		},
		_getInterfacesByType(type) {
			let res = {};
			for (var id in this.interfaces) {
				let intr = this.interfaces[id];
				if (intr.__type == type) {res[id] = intr;};
			};
			return res;
		},
		_reloadInterfaceCommands() {
			for (var id in this.interfaces) {
				let intr = this.interfaces[id];
				if (typeof intr.__initCommands == "function") {intr.__initCommands();};
			};
		}
	},
	_interface: {
		_init(id,device,inf,type) {
			this.__device = device;
			this._id = id;
			for (var k in inf) {
				switch (k) {
					default: this["__"+k] = inf[k]; break;
				}
			}
		}
	},
	_cable: class {
		constructor(id,type) {
			this._type = type;
			this._id = id;
		}
	},
	requireUncached: function(module) {
	    delete require.cache[require.resolve(module)];
	    return require(module);
	}
}