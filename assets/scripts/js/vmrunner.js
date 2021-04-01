const vm = require("vm");
var ctx = {};
const cmdBuffer = {};
var cmdBuffNum = 0;

_commands = {
	"setCTX":{
		async:false,
		fn:function(d) {
			ctx = d.context;
			ctx.process = procFuncs;
			ctx = vm.createContext(ctx);
			return true;
		}
	},
	"runScript":{
		async:false,
		fn:function(d) {
			if ((ctx) && (d.script)) { // Если контекст не пустой
				try {
					vm.runInContext(d.script,ctx);
				} catch (e) {
					return false;
				};
				return true;
			} else {
				return false;
				process.send({
					type:"log",
					data:"Empty context"
				})

			};
		}
	}
};

const procFuncs = {
	send: function(data) { process.send(data); },
	exit: function() { process.exit(); },
	sendCommand: function(command,data,callback=false) {return _sendCommand(command,data,callback);}
};

function _sendCommand(command,data=false,callback=false) { // Отправить комманду в proc
	let pay = {
        type:"command",
        command:command,
        data:data
    };
	if (command) { // Если пришла комманда
		if (typeof(callback) == "function") { // Если есть коллбек, и нужно слушать ответ
			cmdBuffer[cmdBuffNum] = callback; // Записываем коллбек ожидания
			pay.bufferId = cmdBuffNum;
			process.send(pay);
			cmdBuffNum++;
		} else { // Если ответ не нужен
			process.send(pay);
		};
		return true;
	} else {
		return false;
	}	

};

function _sendResponse(data=false,bufferId=false) { // Отправить ответ в proc
	
	let pay = {
        type:"response",
        data:data,
        bufferId:bufferId
    };
	process.send(pay);
};

function _onMessage(msg) { // Обработка входящих данных
	switch (msg.type) {
		case "command":
			_onCommand(msg);
		break;
		case "response":
			_onResponse(msg);
		break;
	}
};

function _onCommand(msg) { // Функция обработки запроса команды
		if (_commands[msg.command]) { // Если такая команда зарегистрирована
			let cmd = _commands[msg.command];
			if (!cmd.async) { // Если функция асинхронна
				let res = _commands[msg.command].fn(msg.data);
				if (typeof(msg.bufferId) !== "undefined") { // Если запрашивается возврат
					_sendResponse(res,msg.bufferId);
				};
			} else {
				
				if (typeof(msg.bufferId) !== "undefined") { // Если запрашивается возврат
					
					_commands[msg.command].fn(msg.data,function(data){
						
						_sendResponse(data,msg.bufferId);
					});
				} else {
					_commands[msg.command].fn(msg.data);
				};
			};
		}
	};

function _onResponse(msg) { // Функция обработки ответа
	if (cmdBuffer[msg.bufferId]) {
	  	cmdBuffer[msg.bufferId](msg.data);
	  	delete cmdBuffer[msg.bufferId];
	};
};

process.on('message', _onMessage);