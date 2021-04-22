{
	sprite:"cursor",
	hoverobj:null,
	_create:function() {
		global.cursor = this;
		this.createCollider({
			name:"collider",
			x:0,
			y:0,
			width:2,
			height:2
		});
		this.ctx = this._oge._graph.getCanvas(this._oge.buffer.defaultLayer);
	},
	_update:function() {
		this.x = global.mouse_x+this.ctx.offset_x;
		this.y = global.mouse_y+this.ctx.offset_y;
		this.checkHover();

		if (this._oge.onMousePress(1)) {
			
			if (this.hoverobj && this.hoverobj.clickable) {
				this.hoverobj._click();
			}
		}
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


	},
	_draw:function(){
		if (this.sprite) {
			this.drawSprite({
				sprite:this.sprite,
				x:this.x,
				y:this.y
			});
		};
	}
}