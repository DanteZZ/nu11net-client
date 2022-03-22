{
	load:function() {
		
	},

	layers: {
		game:{
			type:"2d",
			width:1134,
			height:950
		},
		display:{
			type:"2d"
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

	displayVW: null,

	defaultLayer:"game",
	defaultCam:"default",

	_create:function() {

		global.hovertext = "";
		global.deviceDisplay = null;
		global.lockgame = false;
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

	_drawDisplay:function() {
		const _vw = global?.deviceDisplay?.__getScreen() || null;

		if (_vw !== this.displayVW) {this.displayVW = _vw;}

		let ctx = this._oge._graph.getCanvas("display");
		ctx.fillStyle = "rgba(0,0,0,0.8)";
		ctx.fillRect(0,0, 5000, 5000);
		let cw = ctx.canvas.width;
		let ch = ctx.canvas.height;
		let dw = global.deviceDisplay.__width;
		let dh = global.deviceDisplay.__height;
		let dx = (cw-dw)/2;
		let dy = (ch-dh)/2;

		if (_vw) {
			_vw.style.display = "block";
			_vw.style.zIndex = 999;
			_vw.style.width = dw+"px";
			_vw.style.height = dh+"px";
			_vw.style.left = dx+"px"
			_vw.style.top = dy+"px";
		};

		ctx.fillStyle = "black";
		ctx.fillRect(dx, dy, dw, dh);
		global.deviceDisplay.__pos_x = dx;
		global.deviceDisplay.__pos_y = dy;
		let img = global.deviceDisplay.__getImage();
		if (img) {
			ctx.drawImage(
				img,

				0,
				0,
				img.width,
				img.height,

				dx,
				dy,
				dw,
				dh
			);
		};

		let exitmsg = "ЛКМ или CTRL+ALT+HOME для выхода"

		ctx.fillStyle = "#FFFFFF";
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 4;
		ctx.font = "16px VGA";
  		
  		ctx.strokeText(exitmsg, 16, ch-16);
  		ctx.fillText(exitmsg, 16, ch-16);
	},

	_draw:function() {

		let ctx = this._oge._graph.getCanvas(this._oge.buffer.defaultLayer);
		let gui = this._oge._graph.getCanvas("gui");
	
		if (global.deviceDisplay) {
			this._drawDisplay();
		};

		if (!global.deviceDisplay) {
			if (this.displayVW) {this.displayVW.style.display="none"; this.displayVW = null;}
			if (global.hovertext) {
				gui.fillStyle = "#FFFFFF";
				gui.strokeStyle = 'black';
				gui.lineWidth = 4;
				gui.font = "24px VGA";
		  		
		  		gui.strokeText(global.hovertext, 16, 32);
		  		gui.fillText(global.hovertext, 16, 32);
			}
		};


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
		let ctx = this._oge._graph.getCanvas(this._oge.buffer.defaultLayer);
		if ((this._oge.onKeyPress(17) || this._oge.onKeyHold(17)) &&(this._oge.onKeyPress(18) || this._oge.onKeyHold(18)) && (this._oge.onKeyPress(36) || this._oge.onKeyHold(36))) {
			global.deviceDisplay = null;
			global.lockgame = false;
		};
		if (this._oge.onMousePress(1)) {
			if (this._oge._onBoxMeeting({
				x:global.mouse_x,
				y:global.mouse_y,
				width:1,
				height:1
			},
			{
				x:0,
				y:ctx.canvas.height-32,
				width:ctx.canvas.width,
				height:32
			})) {
				global.deviceDisplay = null;
				global.lockgame = false;
			}
		}
	}
	
}