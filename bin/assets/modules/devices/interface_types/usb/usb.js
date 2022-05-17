class usb {
	port_connectify = ["usb_storage"]; // Устанавливаем возможность подключения портативных устройств
	port_connection = null;

	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
	};

	__onConnect = function() {
		this.port_connection?._onConnected(this);
	};

	__onUnconnect = function() {
		this.port_connection?._onDisconnected(this);
	};

	__initCommands = function() {
		/* Запишем путь к командам и путь с конечным слешом */
		let cat = "interfaces/"+this.__type+"/"+this._id;
		let catf = cat+"/";
		let cmd = this.__device._cmd;
		cmd._regCat(cat); //Регаем каталог

		/* SEND */
		cmd._reg(catf+"interfaceList",function(d) {
			return this.port_connection?._interfaceList ? this.port_connection?._interfaceList() : [];
		},this,false);

		if (this.port_connection) {
			this.port_connection?._onConnected(this);
		}
	};
}

module.exports = usb