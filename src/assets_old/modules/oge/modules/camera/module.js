let fns = {
	regCam: function(info) {
		if (!info) {return false;};
		if (!info.name) {return false;};
		this._cameras[info.name] = new this.Cam(info);
		return this._cameras[info.name];
	},

	getCamera: function(name) {
		if (this.buffer.cameras[name]) {
			return this.buffer.cameras[name];
		};
		return false;
	},

	setCamera: function(name) {
		if (this.buffer.cameras[name]) {
			this.buffer.camera = this.buffer.cameras[name];
		};
	},

	updateView: function() {
		if (!this.buffer.camera) {return false;};
		let cam = this.buffer.camera;
		let w = 0;
		let h = 0;
		if (cam.width) {w = cam.width} else {w = this.win.innerWidth;};
		if (cam.height) {h = cam.height} else {h = this.win.innerHeight;};
		this._graph.setSize(this.buffer.defaultLayer,w,h);

		if (cam.point) {
			let point = null;
			if (cam.point.constructor !== this.Instance) {
				find = findInstances(cam.point);
				if (find[0]) {
					point = find[0];
				};
			} else {
				point = cam.point;
			};

			if (point) {
				cam.x = (point.x-parseInt(w/2));
				cam.y = (point.y-parseInt(h/2));
			};
		}


		let deflay = this.buffer.scene.layers[this.buffer.defaultLayer];
		if (cam.x < 0) {cam.x = 0;};
		if (cam.y < 0) {cam.y = 0;};
		if ((cam.x+w) > deflay.width) {cam.x = deflay.width-w;};
		if ((cam.y+h) > deflay.height) {cam.y = deflay.height-h;};

		if (w > deflay.width) { cam.x = -(w-deflay.width)/2; };
		if (h > deflay.height) { cam.y = -(h-deflay.height)/2; };

		this._graph.setOffset(this.buffer.defaultLayer,cam.x,cam.y);
	},

	createCamera:function(name,info) {
		if ((this._cameras[name]) && (this.buffer.cameras[name] == undefined)) {
			let c = this._cameras[name];
			let cam = {};

			for (var par in c) {
				if (typeof(c[par]) == "object") {
					if (par == "_oge") {continue;};
					cam[par] = JSON.parse(JSON.stringify(c[par]));
				} else {
					cam[par] = c[par];
				};
			};

			for (var par in info) {
				cam[par] = info[par];
			};

			this.buffer.cameras[name] = cam;
		};

	}
};

class Cam {
	constructor(info) {
		let inf = {
			name:"cam",
			width:0,
			height:0,
			x:0,
			y:0,
			point:null
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
		this.oge._cameras = {};
		this.oge.buffer.cameras = {};
		for (var n in fns) {
			this.oge[n] = fns[n];
		};
		this.oge.Cam = Cam;
		Object.assign(this.oge.Cam.prototype, {_oge:this.oge});

		this.oge._em.on("project_load",function(proj){
			this._cameras = {};
			if (proj.cameras) {
				let list = proj.cameras;
				for (var name in list) {
					let cam = list[name];
					cam.name = name;
					this.regCam(cam);
				};
			};
		});
		this.oge._em.on("before_draw",this.oge.updateView)
	}
}