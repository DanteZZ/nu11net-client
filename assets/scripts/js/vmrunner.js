const vm = require("vm");
var ctx = {};
const cmdBuffer = {};
var cmdBuffNum = 0;

const procFuncs = {
	send: function(data) { process.send(data); },
	exit: function() { process.exit(); },
	sendCommand: function(command,data,callback=false) {return _sendCommand(command,data,callback);}
};

const commands = {
	setCTX:function(msg) {
		let d = msg.data;
		ctx = d.context;
		ctx.process = procFuncs;

		ctx = vm.createContext(ctx);

		process.send({
			type:"log",
			data:"Context created",
			ctx:ctx
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

function _sendCommand(command,data=false,callback=false) { // Отправить комманду в proc
	let pay = {
        type:"command",
        command:command,
        data:data
    };
	if (command) { // Если пришла комманда
		if (callback) { // Если есть коллбек, и нужно слушать ответ
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
			_onReponse(msg);
		break;
	}
};

function _onCommand(msg) { // Функция обработки запроса команды
	if (msg.command) {
		if (!msg.bufferId) { // Если команда не должна ничего возвращать
			if (commands[msg.command]) { 
				commands[msg.command](msg);
			};
		} else {
			// Если должна вернуть
		}
	}
};

function _onResponse(msg) { // Функция обработки ответа
	if (cmdBuffer[msg.bufferId]) {
	  	cmdBuffer[msg.bufferId](msg.data);
	  	delete cmdBuffer[msg.bufferId];
	};
};

process.on('message', _onMessage);