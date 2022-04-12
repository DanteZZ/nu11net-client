let fns = {
	_onBoxMeeting: function(one,two) {
		return one.x < two.x + two.width && one.x + one.width > two.x && one.y < two.y + two.height && one.y + one.height > two.y;
	}
};

class Collider {
	constructor(info) {
		let inf = {
			name:"collider",
			width:0,
			height:0,
			x:0,
			y:0,
			solid:true
		}
		info = Object.assign(inf,info);
		for (var k in info) {
			this[k] = info[k];
		};
		return this;
	}

}

module.exports = {
	_init:function(oge) {
		this.oge = oge;
		for (var n in fns) {
			this.oge[n] = fns[n];
		};
		this.oge.Collider = Collider;
		Object.assign(this.oge.Collider.prototype, {_oge:this.oge});

		this.oge._em.on("after_init",function(){
			this.Instance.prototype.createCollider = function(info) {
				this.check__colliders();
				if (!info) {return false;};
				if (!info.name) {return false;};

				if (!this.__colliders[info.name]) {
					this.__colliders[info.name] = new Collider(info);
					return this.__colliders[info.name];
				};
				return false;
			}

			this.Instance.prototype.drawColliders = function() {
				if (this.__colliders) {
					let ctx = this._oge._graph.getCanvas(oge.buffer.defaultLayer);
					ctx.beginPath();
					ctx.fillStyle = "rgba(58,111,155,0.3)";
					ctx.strokeStyle = "rgba(255,255,255,0.4)";
					for (var k in this.__colliders) {
						let col = this.__colliders[k];
						ctx.fillRect(this.x+col.x-ctx.offset_x, this.y+col.y-ctx.offset_y, col.width, col.height);
						ctx.rect(this.x+col.x-ctx.offset_x+1, this.y+col.y-ctx.offset_y+1, col.width-2, col.height-2);
					};
					ctx.stroke();
				};
			}

			this.Instance.prototype.collideWith = function(a,b) {
				return this.onCollide(this._oge.buffer.instances);
			}

			this.Instance.prototype.onCollide = function(a,b) {
				if (!a) {return false;}

				if (Array.isArray(a)) {
					if (a[0].constructor !== this._oge.Instance) {
						return false;
					}
				} else {
					if (a.constructor == this._oge.Instance) {
						a = Array(a);
					} else if (this._oge.findInstances(a).length) {
						a = this._oge.findInstances(a);
					} else {
						return false;
					}
				}

				if (b) {
					if (b.constructor == this._oge.Instance) {
						b = Array(b);
					} else if (this._oge.findInstances(b).length) {
						b = this._oge.findInstances(b);
					} else {
						b = Array(this);
					}
				} else {
					b = Array(this);
				};
				let colls = [];
				if (a.length && b.length) {
					for (var ak in a) {
						let ainst = a[ak];
						for (var bk in b) {
							let binst = b[bk];
							
							if (ainst?.__colliders && binst?.__colliders) {
								if ((ainst == this) && (binst == this)) {continue;};
								for (var ca in ainst.__colliders) {
									for (var cb in binst.__colliders) {
										let acol = ainst.__colliders[ca];
										let bcol = binst.__colliders[cb];

										if (this._oge._onBoxMeeting({
											x:acol.x+ainst.x,
											y:acol.y+ainst.y,
											width:acol.width,
											height:acol.height
										},{
											x:bcol.x+binst.x,
											y:bcol.y+binst.y,
											width:bcol.width,
											height:bcol.height
										})) {colls.push(ainst)};
									}
								};

							}
						}
					};
				};
				if (colls.length) { return colls; }; 
				return false;
			}

			this.Instance.prototype.onFree = function(x,y) {

				for (var k in this._oge.buffer.instances) {
					let inst = this._oge.buffer.instances[k];
					if (inst == this) { continue; }
					for (var ck in inst.__colliders) {
						col = inst.__colliders[ck];
						if (col.solid) {
							if (this._oge._onBoxMeeting({
								x:x,
								y:y,
								width:1,
								height:1
							},{
								x:inst.x+col.x,
								y:inst.y+col.y,
								width:col.width,
								height:col.height
							})) {return false;};
						};
					}
				};
				return true;
			}

			this.Instance.prototype.freeDistance = function(x,y) {

				let size = this._oge.buffer.scene.layers[this._oge.buffer.defaultLayer].height;

				for (var k in this._oge.buffer.instances) {
					let inst = this._oge.buffer.instances[k];
					if (inst == this) { continue; }
					for (var ck in inst.__colliders) {
						col = inst.__colliders[ck];
						if (col.solid) {
							for (var dist = 0; dist<size;dist++) {
								if (this._oge._onBoxMeeting({
									x:this.x+x*dist,
									y:this.y+y*dist,
									width:1,
									height:1
								},{
									x:inst.x+col.x,
									y:inst.y+col.y,
									width:col.width,
									height:col.height
								})) {return false;};
							}
							
						};
					}
				};

				return true;
			}

			this.Instance.prototype.freeDistanceCol = function(direction,collider) {

				let dirs = ["left","right","top","bottom"];

				if (dirs.indexOf(direction) > -1) {return false;};

				if (this.__colliders) {
					if (collider) {
						if (this.__colliders[collider]) {
							collider = this.__colliders[collider];
						} else {
							return false;
						};
					} else {
						for (var k in this.__colliders) {
							collider = this.__colliders[k];
							break;
						};
					}
				} else {
					return false;
				}
				
				
				//let x = Math.cos(direction/ 180 * Math.PI);
				//let y = Math.sin(direction/ 180 * Math.PI);
				

				let distantion = true;
				let size = this._oge.buffer.scene.layers[this._oge.buffer.defaultLayer].height;

				for (var k in this._oge.buffer.instances) {
					let inst = this._oge.buffer.instances[k];
					if (inst == this) { continue; }
					for (var ck in inst.__colliders) {
						col = inst.__colliders[ck];
						if (col.solid) {
							for (var dist = 0; dist<size;dist++) {
								let sx = 0;
								let sy = 0;

								switch (direction) {
									case "left":
										sx = this.x+x*dist+collider.x;
										sy = this.y+y*dist+collider.y;
										collider.width = 1;
									break;
									case "right":
										sx = this.x+x*dist+collider.x;
										sy = this.y+y*dist+collider.y;
										collider.width = 1;
									break;
									case "bottom":
										sx = this.x+x*dist+collider.x;
										sy = this.y+y*dist+collider.y;
										collider.width = 1;
									break;
									case "top":
										sx = this.x+x*dist+collider.x;
										sy = this.y+y*dist+collider.y;
										collider.width = 1;
									break;
								};

								if (_onBoxMeeting({
									x:sx,
									y:sy,
									width:collider.width,
									height:collider.height
								},{
									x:inst.x+col.x,
									y:inst.y+col.y,
									width:col.width,
									height:col.height
								})) {if ((distantion > dist) || (distantion === true)) {distantion = dist;}};
							}
							
						};
					}
				};
				return distantion;
			}

			this.Instance.prototype.check__colliders = function() {
				if (!this.__colliders) {this.__colliders = {};};
			}
		})

	}
}