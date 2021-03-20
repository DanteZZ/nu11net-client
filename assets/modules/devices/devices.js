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
				this._list[id] = new this._device_types[list[id].type](list[id],list[id].type,this._interface_types);
			};
		};
		return this;
	},
	_device: {
		_init(inf,type,ctypes) {
			this.interfaces = [];
			for (var k in inf) {
				
				switch (k) {
					case "interfaces":
						for (var id in inf.interfaces) {
							if (ctypes[inf.interfaces[id].type]) {
								this.interfaces[id] = new ctypes[inf.interfaces[id].type](inf.interfaces[id],inf.interfaces[id].type);
							};
						};
					break;
					case "type":
						this.type = type;
					break;
					default: this[k] = inf[k]; break;
				}
				
			}
		}
	},
	_interface: {
		_init(inf,type) {
			for (var k in inf) {
				switch (k) {
					case "type":
						this.type = type;
					break;
					default: this[k] = inf[k]; break;
				}
			}
		}
	},
	requireUncached: function(module) {
	    delete require.cache[require.resolve(module)];
	    return require(module);
	}
}