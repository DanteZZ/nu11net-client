let fns = {
	regBackground:function(info) {
		if (!info) {return false;};
		if (!info.name) {return false;};
		if (!info.src) {return false;};
		this._backgrounds[info.name] = new this.Background(info);
		this._backgrounds[info.name]._oge = this;
		return this._backgrounds[info.name];
	},
	isBackground:function(name) {
		if (this._backgrounds[name]) {return true};
		return false;
	},
	drawBackground: function(info) {
		inf = {
			name:false,
			layer:this.buffer.defaultLayer,
			x:0,
			y:0,
			offset_x:0,
			offset_y:0
		};

		info = Object.assign(inf,info);
		if (!this._backgrounds[info.name]) { return false; };

		let bck = this._backgrounds[info.name];

		info.image = bck.image;
		
		info.swidth = bck.original_width;
		info.sheight = bck.original_height;

		info.dwidth = bck.width;
		info.dheight = bck.height;

		info.canvas = info.layer;

		delete info.layer;
		return this._graph.drawImage(info);
	}
}



class Background {
	constructor(info) {
		let inf = {
			name:"background",
			width:0,
			height:0,
			original_width:0,
			original_height:0,
		}
		info = Object.assign(inf,info);
		for (var k in info) {
			this[k] = info[k];
		};
		this.image = info.src;
		

		return this;
	};
}


module.exports = {
	_init:function(oge) {
		this.oge = oge;
		this.oge._backgrounds = {};
		for (var n in fns) {
			this.oge[n] = fns[n];
		};
		this.oge.Background = Background;
		Object.assign(this.oge.Background.prototype, {_oge:this.oge});

		this.oge._em.on("before_load",function(proj){
			this._backgrounds = {};
			let bkglist = [];
			if (proj.backgrounds) {
				let list = proj.backgrounds;
				for (var name in list) {
					let background = list[name];
					background.name = name;
					if (background.src[0] == "/") {background.src = background.src.substr(1);};
					background.src = proj.path+background.src;
					bkglist.push(background.src);
					this.regBackground(background);
				};
				this._rl.addToLoad(bkglist); // Resource Loading
			};
		});

		this.oge._em.on("project_load",function(proj){
			for (var k in this._backgrounds) {
				let bkg = this._backgrounds[k];
				bkg.image = this._rl.get(bkg.image); // Set images
				bkg.original_width = bkg.image.width;
				bkg.original_height = bkg.image.height;

				if (!bkg.width) {
					bkg.width = bkg.original_width;
				};
				if (!bkg.height) {
					bkg.height = bkg.original_height;
				};
			};
		});
	}
}