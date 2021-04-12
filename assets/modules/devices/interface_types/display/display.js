class display {
	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
	};

	__initCommands = function() {
		/* Запишем путь к командам и путь с конечным слешом */
		let cat = "interfaces/"+this.__type+"/"+this._id;
		let catf = cat+"/";
		let cmd = this.__device._cmd;
		cmd._regCat(cat); //Регаем каталог

		/* SEND */
		/*
		cmd._reg(catf+"send",function(d) {
			return this.__tx(d);
		},this,false);*/
	};
}

module.exports = display