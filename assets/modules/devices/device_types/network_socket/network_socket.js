class network_socket {
	contextable = false;
	clickable = false;
	statable = false;
	constructor(a,b,c,d) {
		this._init(a,b,c,d);
		console.log(this);
	};
}
module.exports = network_socket