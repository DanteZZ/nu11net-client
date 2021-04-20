{
	sprite:"device_pc",
	status:-1,
	_create:function() {
		this.setSpriteSpeed(0);
		if (this._oge.isSprite("device_"+this.dev.__type)) {
			this.setSprite("device_"+this.dev.__type);
		} else { // Здесь надо будет поставить общепринятый спрайт при не нахождении

		}
	},
	_update:function() {
		if (this.status !== this.dev._status) {
			this.status = this.dev._status;
			this.setSpriteFrame(this.status);
		}
	},

	_draw:function() {
		if (this.sprite) {
			this.drawSprite({
				sprite:this.sprite,
				x:this.x,
				y:this.y
			});
		};
	}
}