//Mouse
let fns = {
	fixWhich:function(e) {
		if (!e.which && e.button) { // если which нет, но есть button... (IE8-)
		    if (e.button & 1) e.which = 1; // левая кнопка
		    else if (e.button & 4) e.which = 2; // средняя кнопка
		    else if (e.button & 2) e.which = 3; // правая кнопка
		};
		return e.which;
	},

	// KEY FUNCTIONS
	onKeyPress:function(key) {
		if (this.buffer.keys[key] !== undefined) {
			if (this.buffer.keys[key] == "pressed") { return true; }
		};
		return false;
	},

	onKeyHold:function(key) {
		if (this.buffer.keys[key] !== undefined) {
			if (this.buffer.keys[key] !== "released") { return true; }
		};
		return false;
	},

	onKeyRelease:function(key) {
		if (this.buffer.keys[key] !== undefined) {
			if (this.buffer.keys[key] == "released") { return true; }
		};
		return false;
	},

	// MOUSE FUNCTIONS
	onMousePress:function(key) {
		if (this.buffer.mouse_keys[key] !== undefined) {
			if (this.buffer.mouse_keys[key] == "pressed") { return true; }
		};
		return false;
	},

	onMouseHold:function(key) {
		if (this.buffer.mouse_keys[key] !== undefined) {
			if (this.buffer.mouse_keys[key] !== "released") { return true; }
		};
		return false;
	},

	onMouseRelease:function(key) {
		if (this.buffer.mouse_keys[key] !== undefined) {
			if (this.buffer.mouse_keys[key] == "released") { return true; }
		};
		return false;
	}
}



module.exports = {
	_init:function(oge) {
		this.oge = oge;
		this.oge.buffer.mouse_keys = [];
		this.oge.buffer.keys = [];
		for (var n in fns) {
			this.oge[n] = fns[n];
		};

		this.oge._em.on("after_update",function(){
			var res = [];
			for (var k in this.buffer.keys) {
				if (this.buffer.keys[k] !== "released") {
					res[k] = this.buffer.keys[k];
				};
				if (this.buffer.keys[k] == "pressed") {
					res[k] = "hold";
				};
			};
			this.buffer.keys = res;

			// MOUSE KEYS
			var res = [];
			for (var k in this.buffer.mouse_keys) {
				if (this.buffer.mouse_keys[k] !== "released") {
					res[k] = this.buffer.mouse_keys[k];
				};
				if (this.buffer.mouse_keys[k] == "pressed") {
					res[k] = "hold";
				};
			};
			this.buffer.mouse_keys = res;
		});

		this.oge.doc.addEventListener("keydown",this.oge._docOnKeydown);

			
			this.oge.doc.addEventListener("keydown", handler => {
				key = handler.keyCode;
				if (global._oge.buffer.keys[key] == undefined) {
					global._oge.buffer.keys[key] = "pressed";
				} else {
					global._oge.buffer.keys[key] = "hold";
				}
			});
			
			this.oge.doc.addEventListener("keyup", handler => {
				key = handler.keyCode;
				global._oge.buffer.keys[key] = "released";
			});

			//Mouse
			this.oge.doc.onmousedown = function(e) {
				e.which = global._oge.fixWhich(e);
				key = e.which;
				global._oge.buffer.mouse_keys[key] = "pressed";
			};

			this.oge.doc.onmouseup = function(e) {
				e.which = global._oge.fixWhich(e);
				key = e.which;
				global._oge.buffer.mouse_keys[key] = "released";
			};

			this.oge.doc.onmousemove = function(e) {
				global.mouse_x = e.clientX;
				global.mouse_y = e.clientY;
			};

	}
}


/* +++++++++++



//Keyboard
document.addEventListener("keydown", handler => {
	key = handler.keyCode;
	if (oge.buffer.keys[key] == undefined) {
		oge.buffer.keys[key] = "pressed";
	} else {
		oge.buffer.keys[key] = "hold";
	}
});

document.addEventListener("keyup", handler => {
	key = handler.keyCode;
	oge.buffer.keys[key] = "released";
});

//Mouse
document.onmousedown = function(e) {
	e.which = fixWhich(e);
	key = e.which;
	oge.buffer.mouse_keys[key] = "pressed";
};

document.onmouseup = function(e) {
	e.which = fixWhich(e);
	key = e.which;
	oge.buffer.mouse_keys[key] = "released";
};

document.onmousemove = function(e) {
	window.mouse_x = e.clientX;
	window.mouse_y = e.clientY;
};
*/