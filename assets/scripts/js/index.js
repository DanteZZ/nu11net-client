function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

const _vm = require("vm"); // Работа с контекстами
const _fs = require("fs"); // Работа с файловой системой
const _cfg = requireUncached("assets/modules/config.js"); // Работа с конфигурационным файлом
const _dv = requireUncached("assets/modules/devices/devices.js"); // Работа с девайсами

_cfg.load();


let dv = _dv.init(JSON.parse(_fs.readFileSync("servers/localhost/devices.json","utf-8")));
console.log(dv);

/*
Vue.component('hios', httpVueLoader('assets/vue-modules/hios.vue'));
var app = new Vue({
  	el: '#app',
});
*/