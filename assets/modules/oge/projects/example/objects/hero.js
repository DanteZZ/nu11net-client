{
	sprite:"hero_right",
	speed:40,
	collide_with:null,
	_create:function() {
		this.createCollider({
			name:"collider",
			width:128,
			height:280,
			x:-64,
			y:-260,

		});
		this.setSpriteSpeed(0);

		window.hero = this;
		this._oge.buffer.camera.point = this;
	},

	_update:function() {
		this.depth = this.y;

		this.checkDeviceCollide();

		if (this._oge.onKeyHold(68)) {
			this.x+= parseInt(this.speed*deltaTime*10);
		}
		if (this._oge.onKeyHold(65)) {
			this.x-= parseInt(this.speed*deltaTime*10);
		}

		if (this._oge.onKeyPress(68)) {
			this.setSprite("hero_right");
			this.setSpriteSpeed(1);
		}
		if (this._oge.onKeyPress(65)) {
			this.setSprite("hero_left");
			this.setSpriteSpeed(1);
		}

		if (this._oge.onKeyRelease(68)) {
			this.setSprite("hero_right");
			this.setSpriteSpeed(0);
		}
		if (this._oge.onKeyRelease(65)) {
			this.setSprite("hero_left");
			this.setSpriteSpeed(0);
		}

		if (this.onCollide("wall")) {
			this.x = this.prevent_x;
			this.y = this.prevent_y;
		}
	},

	checkDeviceCollide:function() {
		let dev = this.onCollide("device")

		if (this.collide_with) {
			this.collide_with.collided = false;
			this.collide_with = null;
		}

		if (dev) {
			dev[0].collided = true;
			this.collide_with = dev[0];
		};

		if (this.collide_with && this._oge.onKeyPress(69)) {
			dev = this.collide_with.dev;
			if (dev._status == 0) {
				dev.__powerON();
			} else {
				dev.__powerOFF();
			};
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
		//this.drawColliders();
	}
}