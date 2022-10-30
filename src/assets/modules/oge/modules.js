module.exports = {
	init:function(oge) {
		this.oge = oge;
		this.modules_list = this.oge._fs.readdirSync(this.oge._path.join(this.oge.path,"/modules"));
		global.console.log("Loading modules:")
		for (var k in this.modules_list) {
			this.loadModule(this.oge._path.join(this.oge.path,"modules/"+this.modules_list[k]+"/module.js"));
		};
	},

	loadModule:function(path) {
		this.oge.requireUncached(path)._init(this.oge);
	}
}
