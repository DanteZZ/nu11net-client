module.exports = {
	_list:{},
	init:function(){
		return this._list;
	}
}


class _type {
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