class cables {
	#types = {
		twistedpair:{
			image:null
		},
		serial:{
			image:null
		},
		display:{
			image:null
		}
	};
	list() {
		return this.#types;
	};
	is(name) {
		if (this.#types[name]) {return true} else {return false;};
	};
	get(name) {
		if (this.#types[name]) {this.#types[name]} else {return false;};
	}
};
module.exports = new cables();