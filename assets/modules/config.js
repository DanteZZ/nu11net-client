module.exports = {
	cfg:{},
	load:function(){
		this._fs = require("fs");
		let data = this._fs.readFileSync("config","utf-8");
		return this.parseJSON(data);
	},
	save:function(){
		return this._fs.writeFileSync("config",JSON.stringify(this.cfg),"utf-8");
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