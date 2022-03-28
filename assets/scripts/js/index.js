class _vmrun {
	constructor() {
		global.vms = {};
		window.addEventListener("message", this.onMessage, false);
	}
	createVM(callback,ctx=false) {
		if (!ctx) {ctx = global;};
		let wv = document.createElement("webview")
		wv.style.display = "none";
		wv.src="assets/modules/vm.html"
		wv.setAttribute("partition","trusted");
		wv.setAttribute("allownw","allownw");
		let hash = 0;
		do { // Генерим незанятый хеш
			hash = this.randomHash();
		} while (global.vms[hash]);

		global.vms[hash] = document.body.appendChild(wv);
		global.vms[hash].pid = hash;
		global.vms[hash].onmsg = function(){};
		global.vms[hash].addEventListener("contentload",function(){
			global.vms[hash].contentWindow.postMessage({setpid:true,pid:hash});
			callback.apply(ctx,[global.vms[hash]])
		});
	}
	onMessage(event){
		let data = event.data;
		global.vms[data.pid].onmsg(data.data);
	}
	randomHash = function(len) {
		len = len || 8;
	    let charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
	    var randomString = '';
	    for (var i = 0; i < len; i++) {
	        var randomPoz = Math.floor(Math.random() * charSet.length);
	        randomString += charSet.substring(randomPoz,randomPoz+1);
	    }
	    return randomString;
	};
}



function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

const _vm = require("vm"); // Работа с контекстами
const _fs = require("fs"); // Работа с файловой системой
const _cfg = requireUncached("assets/modules/config.js"); // Работа с конфигурационным файлом

const WS = requireUncached("assets/modules/ws.js"); // Работа с веб-сокетом

global._dv = requireUncached("assets/modules/devices/devices.js"); // Работа с девайсами
global.__csl = console;
global.__doc = document;
global.vmrun = new _vmrun();
global.__cfg = _cfg
global.__connectedServer = {
	address: "localhost"
}
_cfg.load();

const _oge = requireUncached("assets/modules/oge/oge.js");
const _graph = new _GR();
_graph.init(_oge)

global._oge = _oge;

_oge.init(document,window);
_oge.loadProject("assets/modules/oge/projects/game",()=> {
	_oge.start();
	_oge.pause();
	_raf();
});



Vue.component('hios', httpVueLoader('assets/vue-modules/hios.vue'));
var app = new Vue({
  	el: '#app',
});

window._ws = new WS();
global._ws = _ws;
const check = async () => {
	await _ws.tryConnect("localhost:1337");
	console.log(await _ws.loadServerInfo());
}