module.exports = {
	cfg:{
		"serverList": {},
		"login": "",
		"password": "",
		"selectedServer": "",
		"serversDir": "servers"
	},
	load:function(){
		this._fs = require("fs");
		this._path = require("path");
		if (!this._fs.existsSync(this._path.join(global._basedir,"config"))) {
			this.save();
		}
		let data = this._fs.readFileSync(this._path.join(global._basedir,"config"),"utf-8");
		return this.parseJSON(data);
	},

	save:function(){
		return this._fs.writeFileSync(this._path.join(global._basedir,"config"),JSON.stringify(this.cfg,null, "\t"),"utf-8");
	},


	parseJSON: function(data) {
		if (this.isJSON(data)) {
			this.cfg = JSON.parse(data);
		} else {
			return false;
		}
	},
	isJSON: function(str) {
	    try {
	        JSON.parse(str);
	    } catch (e) {
	        return false;
	    }
	    return true;
	},
	get: function() {
		return this.cfg;
	},
	set: function(data) {
		if (data) {
			for (var k in data) {
				this.cfg[k] = data[k];
			};
		};
	}
}