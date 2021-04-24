class display {
	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
		//this._image = new Image();
		//this._image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAAAklEQVR4AewaftIAAABlSURBVO3BAQ2AQADEsDHl7xwEIIAjWXtxuPnC4SIvkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSJEmSJEmSJEmSJEnyAw9z4QI8J3KrTwAAAABJRU5ErkJggg=="
	    this.canvas = document.createElement('canvas');
        this.canvas.width = this.__width;
        this.canvas.height = this.__height;
        this.ctx = this.canvas.getContext('2d');
    };

	__getImage = function() {
		return this.canvas;
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
		
		cmd._reg(catf+"drawRect",function(d) {
            if (!this.__isSee()) {return false;}
			let opts = Object.assign({
                x:0,
                y:0,
                w:0,
                h:0,
                c:"black"
            },d);
            this.ctx.fillStyle = opts.c;
            this.ctx.fillRect(opts.x,opts.y,opts.w,opts.h);
		},this,false);

        cmd._reg(catf+"drawText",function(d) {
            if (!this.__isSee()) {return false;}
            let opts = Object.assign({
                x:0,
                y:0,
                s:16,
                l:4,
                f:"VGA",
                c:"black"
            },d);
            this.ctx.fillStyle = opts.f;
            this.ctx.fillRect(opts.x,opts.y,opts.w,opts.h);
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.font = "16px VGA";
            
            ctx.strokeText(exitmsg, 16, ch-16);
            ctx.fillText(exitmsg, 16, ch-16);
        },this,false);
	};
}

module.exports = display