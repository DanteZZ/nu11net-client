const vm = require("vm");
var ctx = {};

const cmdBuffer = {};
var cmdBuffNum = 0;

function sendCommand(inf) {
	/* inf[command,data,callback] */
	if (inf.command) { // Если пришла комманда
		if (inf.callback) { // Если есть коллбек, и нужно слушать ответ
			cmdBuffer[cmdBuffNum] = inf.callback; // Записываем коллбек ожидания
			process.send({
				type: "command",
				command: inf.command,
				bufferId: cmdBuffNum,
				data: inf.data
			});
			cmdBuffNum++;
		} else { // Если ответ не нужен
			process.send({
				type: "command",
				command: inf.command,
				data: inf.data
			})
		};
		return true;
	} else {
		return false;
	}	
}

const procFuncs = {
	send: function(data) { process.send(data); },
	exit: function() { process.exit(); },
	sendCommand: function(inf) {return sendCommand(inf);}
};

const commands = {
	setCTX:function(msg) {
		let d = msg.data;
		ctx = d.context;
		ctx.process = procFuncs;

		ctx = vm.createContext(ctx);

		process.send({
			type:"msg",
			data:"Context created"
		})
	},
	runScript:function(msg) {
		let d = msg.data;
		if ((ctx) && (d.script)) { // Если контекст не пустой
			try {vm.runInContext(d.script,ctx);} catch (e) {
				process.send({
					type:"error",
					error:e
				});
			};
		} else {
			process.send({
				type:"error",
				error:"Empty context"
			})
		}
	}
};

process.on('message', (msg) => {
  if ((msg.type == "command") && msg.command) {
  	if (typeof(commands[msg.command]) == "function") {
  		commands[msg.command](msg);
  	};
  };
  if ((msg.type == "get") && msg.get) {
  	process.send(ctx[msg.get]);
  };
  if ((msg.type == "response") && (cmdBuffer[msg.bufferId])) {
  	cmdBuffer[msg.bufferId](msg.data);
  	delete cmdBuffer[msg.bufferId];
  };
});