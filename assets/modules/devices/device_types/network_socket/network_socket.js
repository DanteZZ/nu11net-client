class network_socket {
	contextable = false;
	clickable = false;
	statable = false;
	constructor(a,b,c,d) {
		this._init(a,b,c,d);
		this.eth = this.interfaces[Object.keys(this.interfaces)[0]];
		this.eth.on("rx",this.onRx.bind(this));
		this.ws = global._ws;
		this.ws.packageReceiver = this.onReceive.bind(this);
	};

	async onRx(data) {
		if (data.protocol == "TCP") {
			const res = await this.ws.sendResponsableCommand("send_package",data);
			this.eth.__tx(res);
		} else {
			this.ws.sendCommand("send_package",data);
		};
	}

	onReceive(data) {
		this.eth.__tx(data);
	}
}
module.exports = network_socket