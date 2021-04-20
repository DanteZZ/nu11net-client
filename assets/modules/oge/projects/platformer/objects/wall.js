{
	sprite:"wall",
	_create:function(){
		this.p2Body = new p2.Body({
		    mass: 0,
		    fixedRotation:true,
		    position: [this.x, this.y]
		});
		this.p2Shape = new p2.Box({
			width:96,
			height:96
		});

		this.p2Body.offset = [0,0];

		this.p2Shape.material = groundMat;

		this.p2Body.addShape(this.p2Shape);
		oge.buffer._p2World.addBody(this.p2Body);
	}
}