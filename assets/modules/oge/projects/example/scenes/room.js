{
	load:function() {
		//setInterval(function(){$("#fps").text(oge.realFPS);},500);
	},

	layers: {
		game:{
			type:"2d"
		},
		gui:{
			type:"2d"
		}
	},

	instances: [
		{
			name:"hero",
			x:156,
			y:320
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

		// Create Map
		let map = [
			[1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,1],
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

		//Create Devices
		/*
		for (var k in _dv._device_list) {
			let dev = _dv._device_list[k];
			this._oge.createInstance({
				name:"device",
				x:dev.__position.x,
				y:dev.__position.y,
				type:dev.__type
			});
		};*/

	},

	_draw:function() {
		let ctx = this._oge._graph.getCanvas(this._oge.buffer.defaultLayer);
		let gui = this._oge._graph.getCanvas("gui");

		gui.fillStyle = "#FFFFFF";
		gui.font = "48px VGA";
  		gui.fillText("Hello world", 10, 50);


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