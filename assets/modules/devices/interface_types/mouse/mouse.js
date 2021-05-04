class mouse {
	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
		this._cat = "interfaces/"+this.__type+"/"+this._id;
		this._catf= this._cat+"/";
        this.cmdinit = false;
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
    };

    __isSee = function() {
        if (global.deviceDisplay.__device == this.__device) {return true;} else {return false;};
    };

    _onMouseDown(event) {
    	if (!this.__isSee()) {return false;}
    	this.__device._cmd._sendEvent(this._catf+"mbdown",this._fixWhich(event).which);
    }

    _onMouseUp(event) {
    	if (!this.__isSee()) {return false;}
    	this.__device._cmd._sendEvent(this._catf+"mbup",this._fixWhich(event).which);
    }

    _onScroll(event) {
        if (!this.__isSee()) {return false;}
        this.__device._cmd._sendEvent(this._catf+"scroll",event.deltaY);
    }

    _onMouseMove(event) {
        if (!this.__isSee()) {return false;}

        this._lastposx = this._posx;
        this._lastposy = this._posy;
        this._posx = event.clientX-global.deviceDisplay.__pos_x;
        this._posy = event.clientY-global.deviceDisplay.__pos_y;
        let move = true;
        if (this._posx > global.deviceDisplay.__width) {this._posx = global.deviceDisplay.__width; move = false;};
        if (this._posy > global.deviceDisplay.__height) {this._posy = global.deviceDisplay.__height; move = false;};

        if (this._posx < 0) {this._posx = 0; move = false;};
        if (this._posy < 0) {this._posy = 0; move = false;};

        if (((this._lastposx !== this._posx) || (this._lastposy !== this._posy)) && (move)) {
            this.__device._cmd._sendEvent(this._catf+"move",{x:this._posx,y:this._posy});
        };
    }

    _fixWhich(e) {
        if (!e.which && e.button) { // если which нет, но есть button... (IE8-)
            if (e.button & 1) e.which = 1; // левая кнопка
            else if (e.button & 4) e.which = 2; // средняя кнопка
            else if (e.button & 2) e.which = 3; // правая кнопка
        };
        return e;
    }

    __initCommands = function() {
        if (this.cmdinit) {
            global.__doc.removeEventListener("mousedown", this._onMouseDown);
            global.__doc.removeEventListener("mouseup", this._onMouseUp);
            global.__doc.removeEventListener("wheel", this._onScroll);
            global.__doc.removeEventListener("mousemove", this._onMouseMove);
        };
        this.__device._cmd._regCat(this._cat); //Регаем каталог
        this.__device._cmd._reg(this.catf+"getpos",function() {
            return {x:this._posx,y:this._posy};
        },this,false);
        global.__doc.addEventListener("mousedown", this._onMouseDown);
        global.__doc.addEventListener("mouseup", this._onMouseUp);
        global.__doc.addEventListener("wheel", this._onScroll);
        global.__doc.addEventListener("mousemove", this._onMouseMove);
        this.cmdinit = true;
    }
}

module.exports = mouse