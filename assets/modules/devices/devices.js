module.exports = {
	_list:{},
	init:function(list){
		this._device_types = this.requireUncached("./device_types.js").init();
		this._interface_types = this.requireUncached("./interface_types.js").init();

		for (var dn in this._device_types) {
			Object.assign(this._device_types[dn].prototype, this._device);
		};

		for (var cn in this._interface_types) {
			Object.assign(this._interface_types[cn].prototype, this._interface);
		};

		for (var id in list) {
			if (this._device_types[list[id].type]) {
				this._list[id] = new this._device_types[list[id].type](id,list[id],list[id].type,this._interface_types);
			};
		};
		return this;
	},
	_device: {
		_init(id,inf,type,ctypes) {
			this.interfaces = [];
			this._id = id;
			delete require.cache[require.resolve("assets/modules/commands.js")];
		    this._cmd = require("assets/modules/commands.js");
			for (var k in inf) {
				switch (k) {
					case "interfaces":
						for (var id in inf.interfaces) {
							if (ctypes[inf.interfaces[id].type]) {
								this.interfaces[id] = new ctypes[inf.interfaces[id].type](id,this,inf.interfaces[id],inf.interfaces[id].type);
							};
						};
					break;
					default: this["__"+k] = inf[k]; break;
				}
			}
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
		_regCommand(command,func,async = false) { // Зарегистрировать комманду
			this._commands[command] = {
				async:async,
				fn:func
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
	requireUncached: function(module) {
	    delete require.cache[require.resolve(module)];
	    return require(module);
	}
}