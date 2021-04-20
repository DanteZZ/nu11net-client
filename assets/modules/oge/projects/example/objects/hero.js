{
	sprite:"hero_down",
	speed:40,

	load:function() {
		//setInterval(function(){$("#fps").text(oge.realFPS);},500);
	},

	_create:function() {
		this.createCollider({
			name:"collider",
			width:64,
			height:32,
			x:-32,
			y:32
		});
		this.setSpriteSpeed(0);

		window.hero = this;
		this._oge.buffer.camera.point = this;
	},

	_update:function() {
		this.depth = this.y;
		if (this._oge.onKeyHold(68)) {
			this.x+= parseInt(this.speed*deltaTime*10);
		}
		if (this._oge.onKeyHold(65)) {
			this.x-= parseInt(this.speed*deltaTime*10);
		}
		if (this._oge.onKeyHold(87)) {
			this.y-= parseInt(this.speed*deltaTime*10);
		}
		if (this._oge.onKeyHold(83)) {
			this.y+= parseInt(this.speed*deltaTime*10);
		}

		if (this._oge.onKeyPress(68)) {
			this.setSprite("hero_right");
			this.setSpriteSpeed(1);
		}
		if (this._oge.onKeyPress(65)) {
			this.setSprite("hero_left");
			this.setSpriteSpeed(1);
		}
		if (this._oge.onKeyPress(87)) {
			this.setSprite("hero_up");
			this.setSpriteSpeed(1);
		}
		if (this._oge.onKeyPress(83)) {
			this.setSprite("hero_down");
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
		if (this._oge.onKeyRelease(87)) {
			this.setSprite("hero_up");
			this.setSpriteSpeed(0);
		}
		if (this._oge.onKeyRelease(83)) {
			this.setSprite("hero_down");
			this.setSpriteSpeed(0);
		};

		if (this.onCollide("wall")) {
			this.x = this.prevent_x;
			this.y = this.prevent_y;
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
		this.drawColliders();
	}
}