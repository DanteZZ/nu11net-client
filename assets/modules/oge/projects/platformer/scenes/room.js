{
	load:function() {
		setInterval(function(){$("#fps").text(oge.realFPS);},500);
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
			y:-300
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

		oge.buffer._p2World = new p2.World({
			gravity:[0, 400]
		});

		window.heroMat = new p2.Material();
		window.groundMat = new p2.Material();

		oge.buffer._p2World.addContactMaterial(new p2.ContactMaterial(
			groundMat,
			heroMat,
			{friction:0.0}
		));

		let map = [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

		for (var x in map) {
			if (map[x]) {
				createInstance({
					name:"wall",
					x:x*96,
					y:400
				});
			}
		}

	},

	_draw:function() {
		let ctx = oge._graph.getCanvas(oge.buffer.defaultLayer);

		ctx.fillStyle = "#3B474F";
		ctx.fillRect(0,0, 5000, 5000);

		ctx.beginPath();
		ctx.fillStyle = "rgba(255,255,255,0.11)";
		ctx.strokeStyle = "rgba(255,255,255,0.41)";
		let tilesize=128;
		ctx.fillRect(0-ctx.offset_x, 0-ctx.offset_y, oge.buffer.scene.layers.game.width, oge.buffer.scene.layers.game.height);
		for (var y=0;y<oge.buffer.scene.layers.game.height/tilesize;y++) {
			for (var x=0;x<oge.buffer.scene.layers.game.height/tilesize;x++) {
				ctx.rect(0-ctx.offset_x+x*tilesize, 0-ctx.offset_y+y*tilesize, tilesize, tilesize);
			};
		};

		ctx.stroke();	

	},

	_update:function() {
		//if (onKeyPress(49)) {setCamera("default");} 
		//if (onKeyPress(50)) {setCamera("chelick");} 
	}
	
}