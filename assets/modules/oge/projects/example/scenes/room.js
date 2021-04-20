{
	load:function() {
		//setInterval(function(){$("#fps").text(oge.realFPS);},500);
	},

	layers: {
		game:{
			type:"2d",
			width:1280,
			height:1280
		}
	},

	instances: [
		{
			name:"hero",
			x:156,
			y:156
		}
	],

	cameras: {
		default: {
			width:0,
			height:0
		}
	},

	defaultLayer:"game",
	defaultCam:"default",

	_create:function() {

		
		let map = [
			[1,1,1,1,1,1,1,1,1,1],
			[1,0,0,1,0,0,0,0,0,1],
			[1,0,0,1,0,0,0,0,0,1],
			[1,0,0,1,0,0,1,0,0,1],
			[1,0,0,1,0,0,1,0,0,1],
			[1,0,0,1,0,0,1,0,0,1],
			[1,0,0,0,0,0,1,0,0,0],
			[1,0,0,0,0,0,1,0,0,0],
			[1,1,1,1,1,1,1,1,1,1]
		];
		for (var y in map) {
			for (var x in map[y]) {
				if (map[y][x]) {
					this._oge.createInstance({
						name:"wall",
						x:x*96,
						y:y*96
					});
				}
			}
		}

	},

	_draw:function() {
		let ctx = this._oge._graph.getCanvas(this._oge.buffer.defaultLayer);

		ctx.fillStyle = "#3B474F";
		ctx.fillRect(0,0, 5000, 5000);

		ctx.beginPath();
		ctx.fillStyle = "rgba(255,255,255,0.11)";
		ctx.strokeStyle = "rgba(255,255,255,0.41)";
		let tilesize=128;
		ctx.fillRect(0-ctx.offset_x, 0-ctx.offset_y, this._oge.buffer.scene.layers.game.width, this._oge.buffer.scene.layers.game.height);
		for (var y=0;y<this._oge.buffer.scene.layers.game.height/tilesize;y++) {
			for (var x=0;x<this._oge.buffer.scene.layers.game.height/tilesize;x++) {
				ctx.rect(0-ctx.offset_x+x*tilesize, 0-ctx.offset_y+y*tilesize, tilesize, tilesize);
			};
		}
		ctx.stroke();
	},

	_update:function() {
		//if (onKeyPress(49)) {setCamera("default");} 
		//if (onKeyPress(50)) {setCamera("chelick");} 
	}
	
}