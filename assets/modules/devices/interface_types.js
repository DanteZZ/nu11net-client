module.exports = {
	_list:{},
	init:function(){
		this._fs = require("fs");
		this._pt = require("path");
		let pt_types = this._pt.join(__dirname,"/interface_types");
		this._fs.readdirSync(pt_types).forEach(file => {
			let pt_type = this._pt.join(pt_types,"/"+file);
			if (this._fs.statSync(pt_type).isDirectory()) {
				let pt_ftype = this._pt.join(pt_type,"/"+file+".js");
				if (this._fs.statSync(pt_ftype).isFile()) {
					this._list[file] = this.requireUncached(pt_ftype);
					this._list[file]._typename = file;
				};
			}
		})

		return this._list;
	},
	requireUncached: function(module) {
	    delete require.cache[require.resolve(module)];
	    return require(module);
	}
}