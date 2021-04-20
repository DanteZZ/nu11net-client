function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

const _vm = require("vm"); // Работа с контекстами
const _fs = require("fs"); // Работа с файловой системой
const _cfg = requireUncached("assets/modules/config.js"); // Работа с конфигурационным файлом
const _dv = requireUncached("assets/modules/devices/devices.js"); // Работа с девайсами
global.__csl = console;

global.__cfg = _cfg
global.__connectedServer = {
	address: "localhost"
}
_cfg.load();

let dv = _dv.init(JSON.parse(_fs.readFileSync("servers/localhost/_inf.json","utf-8")));



const _oge = requireUncached("assets/modules/oge/oge.js");
const _graph = new _GR();
_graph.init(_oge)

global._oge = _oge;

_oge.init(document,window);
_oge.loadProject("assets/modules/oge/projects/example");
_oge.start();
_raf();

Vue.component('hios', httpVueLoader('assets/vue-modules/hios.vue'));
var app = new Vue({
  	el: '#app',
});