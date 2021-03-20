module.exports = {
	_list:{},
	init:function(list){
		this._device_types = this.requireUncached("./device_types.js").init();
		this._card_types = this.requireUncached("./card_types.js").init();

		for (var dn in this._device_types) {
			Object.assign(this._device_types[dn].prototype, this._device);
		};

		for (var cn in this._card_types) {
			Object.assign(this._card_types[cn].prototype, this._card);
		};

		for (var id in list) {
			if (this._device_types[list[id].type]) {
				this._list[id] = new this._device_types[list[id].type](list[id],list[id].type,this._card_types);
			};
		};
		return this;
	},
	_device: {
		_init(inf,type,ctypes) {
			this.cards = [];
			for (var k in inf) {
				
				switch (k) {
					case "cards":
						for (var id in inf.cards) {
							if (ctypes[inf.cards[id].type]) {
								this.cards[id] = new ctypes[inf.cards[id].type](inf.cards[id],inf.cards[id].type);
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
	_card: {
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