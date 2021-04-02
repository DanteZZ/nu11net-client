const vm = require("vm");

delete require.cache[require.resolve("./commands.js")];
const cmd = require("./commands.js");
var ctx = {};

cmd._setProc(process);
process.on('message', function(msg){cmd._onMessageSub(msg)});


function _regDefaultCommands() { // Регистрация команд устройства
	cmd._reg("setCTX",function(d) {
		ctx = d.context;
		ctx.process = procFuncs;
		ctx = vm.createContext(ctx);
		return true;
	});
	cmd._reg("runScript",function(d) {
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

const procFuncs = {
	send: function(data) { process.send(data); },
	exit: function() { process.exit(); },
	sendCommand: function(command,data,callback=false) {return cmd._sendCommand(command,data,callback);}
};
//process.on('message', function(msg){cmd._onMessage(cmd,msg)});
