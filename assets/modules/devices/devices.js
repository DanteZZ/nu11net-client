module.exports = {
	_list:{},
	init:function(list){
		this._device_types = this.requireUncached("./device_types.js").init();
		this._card_types = this.requireUncached("./card_types.js").init();
		for (var id in list) {
			if (this._device_types[list[id].type]) {
				this._list[id] = new _device(list[id],this._device_types[list[id].type],this._card_types);
			};
		};
		return this;
	},
	requireUncached: function(module) {
	    delete require.cache[require.resolve(module)];
	    return require(module);
	}
}


class _device {
	constructor(inf,type,ctypes) {
		this.cards = [];
		for (var k in inf) {
			switch (k) {
				case "cards":
					for (var id in inf.cards) {
						if (ctypes[inf.cards[id].type]) {
							this.cards[id] = new _card(inf.cards[id],ctypes[inf.cards[id].type]);
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
}

class _card {
	constructor(inf,type) {
		for (var k in inf) {
			switch (k) {
				case "type":
					this.type = type;
				break;
				default: this[k] = inf[k]; break;
			}
		}
	}
}