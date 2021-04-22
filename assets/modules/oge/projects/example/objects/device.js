{
	sprite:"device_pc",
	status:-1,
	mousehover:false,
	clickable:true,
	title:"",
	_create:function() {
		this.setSpriteSpeed(0);
		if (this._oge.isSprite("device_"+this.dev.__type)) {
			this.setSprite("device_"+this.dev.__type);
		} else { // Здесь надо будет поставить общепринятый спрайт при не нахождении

		};
		this.title = this.dev.__name;
		let spr = this._oge.spriteInfo(this.sprite);
		this.createCollider({
			name:"collider",
			x:-spr.center_x,
			y:-spr.center_y,
			width:spr.width,
			height:spr.height
		});
	},
	_update:function() {
		if (this.status !== this.dev._status) {
			this.status = this.dev._status;
			this.setSpriteFrame(this.status);
			switch (this.dev._status) {
				case 0: this.title = this.dev.__name+" [Выкл.]"; break;
				case 1: this.title = this.dev.__name+" [Вкл.]"; break;
			};
		}
	},

	_click:function() {
		switch (this.dev._status) {
			case 0: this.dev.__powerON(); break;
			case 1: this.dev.__powerOFF(); break;
		};
	},

	_draw:function() {
		if (this.sprite) {
			if (this.mousehover) {
				this.drawSprite({
					sprite:this.sprite,
					x:this.x,
					y:this.y,
					opacity:0.5
				});
			} else {
				this.drawSprite({
					sprite:this.sprite,
					x:this.x,
					y:this.y,
					opacity:1
				});
			};
			
		};
		//this.drawColliders();
	}
}