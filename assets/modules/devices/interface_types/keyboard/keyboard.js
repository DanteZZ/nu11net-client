class keyboard {
	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
		this._cat = "interfaces/"+this.__type+"/"+this._id;
		this._catf= this._cat+"/";
        this.cmdinit = false;
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
    };

    __isSee = function() {
        if (global.deviceDisplay.__device == this.__device) {return true;} else {return false;};
    };

    _onKeyDown(event) {
    	if (!this.__isSee()) {return false;}
    	this.__device._cmd._sendEvent(this._catf+"keydown",event.keyCode);
    }

    _onKeyUp(event) {
    	if (!this.__isSee()) {return false;}
    	this.__device._cmd._sendEvent(this._catf+"keyup",event.keyCode);
    }

    __initCommands = function() {
        if (this.cmdinit) {
            global.__doc.removeEventListener("keydown", this._onKeyDown);
            global.__doc.removeEventListener("keyup", this._onKeyUp);
        };
        this.__device._cmd._regCat(this._cat); //Регаем каталог
        global.__doc.addEventListener("keydown", this._onKeyDown);
        global.__doc.addEventListener("keyup", this._onKeyUp);
        this.cmdinit = true;
    }
}

module.exports = keyboard