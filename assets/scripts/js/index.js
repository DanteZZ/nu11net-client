const _vm = require("vm");
const _fs = require("fs");
const _util = require("util");

Vue.component('bios', httpVueLoader('assets/vue-modules/bios.vue'));

// Create Seemple objects
var app = new Vue({
  	el: '#app',
});