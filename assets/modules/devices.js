module.exports = {
	_list:{},
	_types: false,
	init:function(list){

		this._types = requireUncached("device_types.js").init();
		for (var id in list) {
			this._list[id] = new _device(list[id]);
		};
		return this;
	},
	requireUncached(module): function {
	    delete require.cache[require.resolve(module)];
	    return require(module);
	}
}


class _device {
	constructor(inf) {
		this.cards = [];
		for (var k in inf) {
			switch (k) {
				case "cards":
					for (var id in inf.cards) {
						this.cards[id] = new _card(inf.cards[id]);
					};
				break;
				default: this[k] = inf[k]; break;
			}
		}
	}
}

class _card {
	constructor(inf) {
		for (var k in inf) {
			switch (k) {
				default: this[k] = inf[k]; break;
			}
		}
	}
}