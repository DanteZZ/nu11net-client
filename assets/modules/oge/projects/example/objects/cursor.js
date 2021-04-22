{
	sprite:"cursor",
	hoverobj:null,
	menu:{
		opened:false,
		obj:null,
		hover:null,

		lheight:28,
		fsize:24
	},
	_create:function() {
		global.cursor = this;
		this.createCollider({
			name:"collider",
			x:0,
			y:0,
			width:2,
			height:2
		});
		this._ctx = this._oge._graph.getCanvas(this._oge.buffer.defaultLayer);
		this._gui = this._oge._graph.getCanvas("gui");
	},
	_update:function() {
		this.x = global.mouse_x+this._ctx.offset_x;
		this.y = global.mouse_y+this._ctx.offset_y;
		this.checkHover();

		if (this._oge.onMousePress(1)) {
			if (this.hoverobj && this.hoverobj.clickable) {
				this.hoverobj._click();
			}
		}

		if (this._oge.onMousePress(3)) {
			if (this.hoverobj && this.hoverobj.contextable) {
				this.openContextMenu(this.hoverobj);
			}
		}
	},
	openContextMenu(obj) {
		this.menu.opened = true;
		this.menu.obj = obj;
		this.menu.ox = this.menu.obj.x-this._ctx.offset_x;
		this.menu.oy = this.menu.obj.y-this._ctx.offset_y;
	},
	checkHover:function() {
		let cols = this.collideWith();

		if (this.hoverobj) {
			this.hoverobj.mousehover = false;
			this.hoverobj = null;
			global.hovertext = "";
		};

		if (cols) {
			cols[0].mousehover = true;
			this.hoverobj = cols[0];
			if (this.hoverobj.title) {
				global.hovertext = this.hoverobj.title;
			}
		}

		if (this.menu.opened) {
			let i = 0; //Номер строки
			let k = "poweron";
			let item = {label:"Включить"}
			if (this._oge._onBoxMeeting(
				{
					x:this.x-this._ctx.offset_x,
					y:this.y-this._ctx.offset_y,
					width:1,
					height:1
				},
				{
					x:this.menu.ox,
					y:this.menu.oy+(i*this.menu.lheight),
					width:this._gui.measureText(item.label).width,
					height:this.menu.lheight
				}
			)) {
				global.console.log("Yebanutsa");
				/*

					ДОПИЛИТЬ!!!

				*/
			}
		};


	},
	_draw:function(){

		if (this.menu.opened) {
			let i = 0;
			

			this._gui.fillStyle="rgba(0,0,0,0.8)";
			this._gui.fillRect(
				this.menu.obj.x-this._ctx.offset_x,
				this.menu.obj.y-this._ctx.offset_y,
				100,
				100
			);

			this._gui.strokeStyle = 'black';
			this._gui.lineWidth = 4;
			this._gui.font = "24px VGA";

			for (var k in this.menu.obj.contextmenu) {
				this._gui.fillStyle = "#FFFFFF";
				let item = this.menu.obj.contextmenu[k];

				if (item.disabled) {this._gui.fillStyle = "#909090";}
		  		this._gui.strokeText(item.label, this.menu.ox, this.menu.oy+(this.menu.lheight*i));
		  		this._gui.fillText(item.label, this.menu.ox, this.menu.oy+(this.menu.lheight*i));
		  		i++;
			}
		};

		if (this.sprite) {
			this.drawSprite({
				sprite:this.sprite,
				x:this.x-this._ctx.offset_x,
				y:this.y-this._ctx.offset_y,
				layer:"gui"
			});
		};
	}
}