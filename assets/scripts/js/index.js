const _vm = require("vm");
const _fs = require("fs");
const _util = require("util");
const _sBinds = Seemple.binders;



// Create Seemple objects
class _smpBIOS extends Seemple {
    constructor() {
        super();
        this.loadChars = ["-","\\","|","/"];
        this.loadId = 0;
        this.title = "Инициализация";
        setInterval(function(){
        	BIOS.title = "Загрузка системы "+BIOS.loadChars[BIOS.loadId];
        	BIOS.loadId++;
        	if (BIOS.loadId == BIOS.loadChars.length) {BIOS.loadId = 0;};
        },200);
        this.bindNode('title', 'tlt', _sBinds.html());
    }
}

const BIOS = new _smpBIOS();