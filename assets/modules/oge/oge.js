class OGEngine {
	constructor(doc) {
		this.buffer = {};
		this.project = {};
		this.FPSLimit = 0;
		this.frameStart = Date.now();
		this.doc = doc;
		this._fs = require("fs");
		this._path = require("path");
		this.path = "assets/modules/oge";
		this._em = new EventEmitter(this);
		this._rl = new ResourceLoader(this);
	}

	init(doc,win) {
		this.doc = doc;
		this.win = win;
		this._mdl = this.requireUncached("./modules.js");
		this._mdl.init(this);
		this._em.emit("after_init");
	}

	loadProject(path,callback) {
		if (path[path.length-1] !== "/") {path = path+"/";};
		this.project = this.loadObjectAsync(path+"project.js");
		this.project.path = path;

		this._rl.onReady(function(){this.onResourceLoaded(callback);});

		this._em.emit("before_load",this.project);
	}

	onResourceLoaded(callback) {
		global.console.log(this);
		this._em.emit("project_load",this.project);
		if (this.project.FPSLimit !== undefined) {this.FPSLimit = this.project.FPSLimit;};
		this._em.emit("load");
		this._em.emit("after_load");
		if (typeof callback == "function") {callback.apply(global);};
	}

	start() {
		this._em.emit("before_start");
		this._em.emit("start");
		this._em.emit("after_start");
		this.frameUpdate();
	}
	frameUpdate() {
		this._em.emit("before_update");
		this._em.emit("update");


		this._em.emit("after_update");
		this.realFPS = Math.round(1000/(Date.now()-this.frameStart))+1;
		global.deltaTime = (Date.now()-this.frameStart)/1000;
		this.frameStart = Date.now();
	}

	frameDraw() {
		this._em.emit("before_draw");
		this._em.emit("draw");
		this._em.emit("after_draw");
	}

	loadObjectAsync(path) {
		let data = this._fs.readFileSync(path,"utf-8");
		return eval("("+data+")");
	}

	requireUncached(module) {
		global.console.log(module);
	    delete require.cache[require.resolve(module)];
	    return require(module);
	}
}

class EventEmitter {
  constructor(bind) {
    this.events = {};
    this._bind = bind;
  }
  on(event, listener) {
      if (typeof this.events[event] !== 'object') {
          this.events[event] = [];
      }
      this.events[event].push(listener);
      return () => this.removeListener(event, listener);
  }
  removeListener(event, listener) {
    if (typeof this.events[event] === 'object') {
        const idx = this.events[event].indexOf(listener);
        if (idx > -1) {
          this.events[event].splice(idx, 1);
        }
    }
  }
  emit(event, ...args) {
  	//global.console.log(event);
    if (typeof this.events[event] === 'object') {
      this.events[event].forEach(listener => listener.apply(this._bind, args));
    }
  }
  once(event, listener) {
    const remove = this.on(event, (...args) => {
        remove();
        listener.apply(this._bind, args);
    });
  }
};

class ResourceLoader {
    constructor(oge) {
    	this.oge = oge;
    	global.resourceCache = {};
	    global.loading = [];
	    global.readyCallbacks = [];
    }

    // Load an image url or an array of image urls
    load(urlOrArr) {
        if(urlOrArr instanceof Array) {
        	for (var k in urlOrArr) {
        		this._load(urlOrArr[k]);
        	};
        }
        else {
            this._load(urlOrArr);
        }
    }

    _load(url) {
        if(global.resourceCache[url]) {
            return global.resourceCache[url];
        }
        else {
            var img = new Image();
            img._rl = this;
            img.onload = function() {
                global.resourceCache[url] = img;
                if(this._rl.isReady()) {
                	for (var k in global.readyCallbacks) {
                		global.readyCallbacks[k].apply(this._rl.oge);
                	};
                }
            };
            global.resourceCache[url] = false;
            img.src = url;
        }
    }

    get(url) {
        return global.resourceCache[url];
    }

    isReady() {
        var ready = true;
        for(var k in global.resourceCache) {
            if(global.resourceCache.hasOwnProperty(k) &&
               !global.resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    onReady(func) {
        global.readyCallbacks.push(func);
    }
};

module.exports = new OGEngine;