{
	sprite:"hero_down",
	speed:400,

	load:function() {
		setInterval(function(){$("#fps").text(oge.realFPS);},500);
	},

	_create:function() {

		this.p2Body = new p2.Body({
		    mass: 80,
		    fixedRotation:true,
		    position: [this.x, this.y]
		});

		this.p2Body.offset = [32,0];

		this.p2Shape = new p2.Box({
			width:64,
			height:32
		});

		this.p2Shape.material = heroMat;

		this.p2Body.addShape(this.p2Shape);
		oge.buffer._p2World.addBody(this.p2Body);

		this.setSpriteSpeed(0);

		window.hero = this;
		oge.buffer.camera.point = this;
	},

	_update:function() {
		this.depth = this.y;

		if (onKeyHold(68)) {
			this.p2Body.velocity[0] = this.speed;
		}

		if (onKeyHold(65)) {
			this.p2Body.velocity[0] = -this.speed;
		}

		if (onKeyPress(68)) {
			this.setSprite("hero_right");
			this.setSpriteSpeed(1);
		}
		if (onKeyPress(65)) {
			this.setSprite("hero_left");
			this.setSpriteSpeed(1);
		}

		if (onKeyRelease(68)) {
			this.setSprite("hero_right");
			this.setSpriteSpeed(0);
			this.p2Body.velocity[0] = 0;
		}
		if (onKeyRelease(65)) {
			this.setSprite("hero_left");
			this.setSpriteSpeed(0);
			this.p2Body.velocity[0] = 0;
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
		
		let ctx = oge._graph.getCanvas(oge.buffer.defaultLayer);

		ctx.beginPath();
	    var x = this.p2Body.position[0]+this.p2Body.offset[0],
	        y = this.p2Body.position[1]-this.p2Body.offset[1],
	        s = this.p2Body.shapes[0];
	    ctx.save();
	    ctx.translate(x-ctx.offset_x, y-ctx.offset_y);     // Translate to the center of the box
	    ctx.rotate(this.p2Body.angle);  // Rotate to the box body frame
	    ctx.fillRect(-s.width/2, -s.height/2, s.width, s.height);
	    ctx.restore();

	}
}