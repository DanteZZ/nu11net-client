class _vmrun {
  constructor() {
    global.vms = {};
    window.addEventListener("message", this.onMessage, false);
  }
  createVM(callback, ctx = false) {
    if (!ctx) {
      ctx = global;
    }
    let wv = document.createElement("webview");
    wv.style.display = "none";
    wv.src = "assets/modules/vm.html";
    wv.setAttribute("partition", "trusted");
    wv.setAttribute("allownw", "allownw");
    let hash = 0;
    do {
      // Генерим незанятый хеш
      hash = this.randomHash();
    } while (global.vms[hash]);

    global.vms[hash] = document.body.appendChild(wv);
    global.vms[hash].pid = hash;
    global.vms[hash].onmsg = function () {};
    global.vms[hash].addEventListener("contentload", function () {
      global.vms[hash].contentWindow.postMessage({ setpid: true, pid: hash });
      callback.apply(ctx, [global.vms[hash]]);
    });
  }
  clearAll() {
    const list = document.getElementsByTagName("webview");
    for (var k in list) {
      list[k]?.remove();
    }
  }
  onMessage(event) {
    let data = event.data;
    global.vms[data.pid].onmsg(data.data);
  }
  randomHash = function (len) {
    len = len || 8;
    let charSet = "abcdefghijklmnopqrstuvwxyz0123456789";
    var randomString = "";
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
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
const _path = require("path");
const _cfg = requireUncached("assets/modules/config.js"); // Работа с конфигурационным файлом

const WS = requireUncached("assets/modules/ws.js"); // Работа с веб-сокетом

global._dv = requireUncached("assets/modules/devices/devices.js"); // Работа с девайсами
global.__csl = console;
global.__doc = document;
global.vmrun = new _vmrun();
global.__cfg = _cfg;

try {
  if (process.env?.NODE_ENV?.indexOf("dev") >= 0) {
    global._basedir = process?.env?.PWD || process.cwd();
  } else {
    global._basedir = _path.dirname(process.execPath);
  }
} catch (e) {
  alert(e.toString());
}

global.__connectedServer = {
  address: "localhost",
};
_cfg.load();

const _oge = requireUncached("assets/modules/oge/oge.js");
const _graph = new _GR();
_graph.init(_oge);

global._oge = _oge;

_oge.init(document, window);
_oge.loadProject("assets/modules/oge/projects/game", () => {
  _oge.start();
  _oge.pause();
  _raf();
});

Vue.component("nios", httpVueLoader("assets/vue-modules/nios.vue"));
var app = new Vue({
  el: "#app",
});

//Toggle Fullscreen--Borderless Window-Mode
nw.App.registerGlobalHotKey(
  new nw.Shortcut({
    key: "F10",
    active: () => {
      if (!global?.deviceDisplay) {
        const nww = nw.Window.get();
        nww.toggleFullscreen();
        setTimeout(() => {
          _cfg.set({ fullscreen: nww.isFullscreen });
          _cfg.save();
        }, 200);
      }
    },
  })
);

if (_cfg.get().fullscreen) {
  nw.Window.get().enterFullscreen();
}
//END

window._ws = new WS();
global._ws = _ws;
