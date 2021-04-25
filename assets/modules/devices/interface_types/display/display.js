class display {
	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
		this._image = new Image();
		this._image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAAAklEQVR4AewaftIAAABlSURBVO3BAQ2AQADEsDHl7xwEIIAjWXtxuPnC4SIvkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSJEmSJEmSJEmSJEnyAw9z4QI8J3KrTwAAAABJRU5ErkJggg=="
    };

	__getImage = function() {
		return this._image;
	};

    __isSee = function() {
        if (global.deviceDisplay == this) {return true;} else {return false;};
    };

	__initCommands = function() {
		/* Запишем путь к командам и путь с конечным слешом */
		let cat = "interfaces/"+this.__type+"/"+this._id;
		let catf = cat+"/";
		let cmd = this.__device._cmd;
		cmd._regCat(cat); //Регаем каталог

		/* SEND */
		
		cmd._reg(catf+"setFrame",function(d) {
            //if (!this.__isSee()) {return false;}
			this._image.src = d;
		},this,false);
	};
}

module.exports = display