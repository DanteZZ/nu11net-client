class usb_storage {
	constructor(a,b,c,d,itypes) {
		this._init(a,b,c,d,itypes) // Инициализация интерфейса
		this._cmd = null;
		this._connected = null;
		this._storage = new itypes['storage'](a,this,{...b,type:"storage"},"storage");
	};

	_interfaceList() {
		return [{name:this._id,type:"storage"}];
	}

	_onConnected(i) {
		this._connected = i;
		this._cmd = i.__device._cmd;
		this._storage.__initCommands();
	};

	_reloadCommands() {
		this._storage.__clearCommands();
		this._storage.__initCommands();
	};

	_onDisconnected() {
		this._storage.__clearCommands();
		this._connected = null;
		this._cmd = null
	}
}

module.exports = usb_storage