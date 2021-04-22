{
	load:function() {
		//setInterval(function(){$("#fps").text(oge.realFPS);},500);
	},

	layers: {
		game:{
			type:"2d",
			width:1134,
			height:950
		},
		gui:{
			type:"2d"
		}
	},

	instances: [
		{
			name:"cursor",
			x:0,
			y:0,
			depth:99999
		},
		{
			name:"hero",
			x:920,
			y:815
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

		global.hovertext = "";

		//80x815 0x324

		//Create Devices
		this.devices = {};
		for (var k in global._dv._device_list) {
			let dev = global._dv._device_list[k];
			this.devices[dev._id] = this._oge.createInstance({
				name:"device",
				x:dev.__position.x,
				y:dev.__position.y,
				dev:dev
			});
			dev.__instance = this.devices[dev._id];
		};
	},

	_draw:function() {

		let ctx = this._oge._graph.getCanvas(this._oge.buffer.defaultLayer);
		let gui = this._oge._graph.getCanvas("gui");


		if (global.hovertext) {
			gui.fillStyle = "#FFFFFF";
			gui.strokeStyle = 'black';
			gui.lineWidth = 4;
			gui.font = "24px VGA";
	  		
	  		gui.strokeText(global.hovertext, 16, 32);
	  		gui.fillText(global.hovertext, 16, 32);
		}
		


		ctx.fillStyle = "black";
		ctx.fillRect(0,0, 5000, 5000);

		this._oge.drawBackground({
			name:"room_0",
			x:0,
			y:0,
		});

		
		for (var k in global._dv._connection_list) {
			let cable = global._dv._connection_list[k];
			let d0 = this.devices[cable[0].split("#")[0]];
			let d1 = this.devices[cable[1].split("#")[0]];

			ctx.beginPath();
			ctx.moveTo(d0.x-ctx.offset_x,d0.y-ctx.offset_y-4);
			ctx.lineWidth = 2;
			ctx.strokeStyle = "grey";
			ctx.lineTo(d1.x-ctx.offset_x,d1.y-ctx.offset_y-4); 
			ctx.stroke();
		};
		
	},

	_update:function() {
		//if (onKeyPress(49)) {setCamera("default");} 
		//if (onKeyPress(50)) {setCamera("chelick");} 
	}
	
}