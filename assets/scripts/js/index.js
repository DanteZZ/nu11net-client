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



let dv = _dv.init(JSON.parse(_fs.readFileSync("servers/localhost/devices.json","utf-8")));

const _rt = dv._list.a1b2c3d4e5.interfaces.storage_a1b2c3d4e5;
//console.log(dv);

/*
Vue.component('hios', httpVueLoader('assets/vue-modules/hios.vue'));
var app = new Vue({
  	el: '#app',
});
*/


const { fork } = require('child_process');
let proc = fork('assets/scripts/js/vm-runner.js');

proc.on('message', (msg) => {
  if (msg.type == "command") {
        proc.send({
            type:"response",
            bufferId:msg.bufferId,
            data:{command:msg.command,result:"Oh, Hello from Kernel"}
        });
  };
  console.log("GET:",msg);
});

proc.send({ type:"command", command:"setCTX", data:{context:{a:10}}});
proc.send({
    type:"command",
    command:"runScript",
    data:{script:"process.sendCommand({command:'checkCommand',callback:function(data){process.send('Thanks, i resolve'); process.send(data)}})"}
})