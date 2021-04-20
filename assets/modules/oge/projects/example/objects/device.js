{
	sprite:"old_pc",
	_create:function() {
		//this.setSpriteSpeed(0);
	},

	setDevice:function(device) {
		this.device = device;
	},

	_update:function() {
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