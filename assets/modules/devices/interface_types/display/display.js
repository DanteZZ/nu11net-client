class display {
	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
		this._image = new Image();
		this._image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAAAklEQVR4AewaftIAAABlSURBVO3BAQ2AQADEsDHl7xwEIIAjWXtxuPnC4SIvkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSKZIpkimSJEmSJEmSJEmSJEnyAw9z4QI8J3KrTwAAAABJRU5ErkJggg=="
	};

	__getImage = function() {
		return this._image;
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
/*

pi2b64 = function(bitmap,callback){
    var png = new PNG({
        width:bitmap.width,
        height:bitmap.height
    });

    for(var i=0; i<bitmap.width; i++) {
        for(var j=0; j<bitmap.height; j++) {
            var rgba = bitmap.getPixelRGBA(i,j);
            var n = (j*bitmap.width+i)*4;
            var bytes = uint32.getBytesBigEndian(rgba);
            for(var k=0; k<4; k++) {
                png.data[n+k] = bytes[k];
            }
        }
    };

    png.pack();
    let chunks = [];
    png.on('data', function(chunk) {
        chunks.push(chunk);
    });
    png.on('end', function() {
       var result = Buffer.concat(chunks);
       callback(result.toString("base64"))
    });
};

*/