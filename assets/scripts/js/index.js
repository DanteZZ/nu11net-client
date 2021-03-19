function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}


const _vm = require("vm"); // Работа с контекстами
const _fs = require("fs"); // Работа с файловой системой
const _cfg = requireUncached("assets/modules/config.js"); // Работа с конфигурационным файлом




_cfg.load();

Vue.component('bios', httpVueLoader('assets/vue-modules/bios.vue'));

// Create Seemple objects
var app = new Vue({
  	el: '#app',
});