class display {
	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
		this._image = new Image();
		this._clearimage = new Image();
		this._image.src = "";
		this._clearimage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2BgYAAAAAQAAVzN/2kAAAAASUVORK5CYII=";
    };

	__getImage = function() {
		if (this.__device._status == 0) {
			return this._clearimage;
		} else {
			return this._image;
		}
	};

	__getScreen = function() {
		return this.__device._getWV();
	}

    __isSee = function() {
        if (global.deviceDisplay == this) {return true;} else {return false;};
    };

	__clearCommands = function() {
		let cat = "interfaces/"+this.__type+"/"+this._id;
		let cmd = this.__device._cmd;
		cmd._remove(cat); //Регаем каталог
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