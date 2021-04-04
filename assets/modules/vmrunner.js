const vm = require("vm");

delete require.cache[require.resolve("./commands.js")];
const cmd = require("./commands.js");
var ctx = {};

cmd._setProc(process);
process.on('message', function(msg){cmd._onMessage(msg)});

const hwFuncs = { // Функции общения с железом
	sendCommand: function(command,data,callback=false) {return cmd._sendCommand(command,data,callback);},
	sendLog: function(data) {return cmd._sendLog(data);},
	sendError: function(data) {return cmd._sendError(data);},
	sendEvent: function(event,data) {return cmd._sendEvent(event,data);},
	
	regCommand: function(command,func,ctx=false,async=false){return cmd._reg(command,func,ctx,async)},
	regCat: function(name){return cmd._regCat(command,func,ctx,async)},

	listenEvent:function(event,func = ()=>{},ctx=null){return cmd._listenEvent(event,func,ctx)},
	unlistenEvent:function(id){return cmd._unlistenEvent(id)},
	doEvent:function(event,data=false){return cmd._doEvent(event,data)}
};

function _regDefaultCommands() { // Регистрация команд устройства
	cmd._regCat("vm");
	cmd._reg("vm/setCTX",function(d) {
		ctx = d.context;
		ctx.__hw = hwFuncs;
		ctx = vm.createContext(ctx);
		return true;
	});
	cmd._reg("vm/runScript",function(d) {
		if ((ctx) && (d.script)) { // Если контекст не пустой
			try {
				vm.runInContext(d.script,ctx);
			} catch (e) {
				return e;
			};
			return true;
		} else {
			return false;
			process.send({
				type:"log",
				data:"Empty context"
			})

		};
	});
};
_regDefaultCommands();