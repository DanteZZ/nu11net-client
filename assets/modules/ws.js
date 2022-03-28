const { copyFolderRecursiveSync, fs } = require("./fsAdvance");

const CMD_GETSRVINFO = "get_server_info";

const TYPE_SIMPLE = "simple";
const TYPE_RESPONSABLE = "responsable";
const TYPE_RESPONSE = "response";

class WS {
    constructor(onMessage,onClose) {
        this.onMessage = onMessage;
        this.onClose = onClose;
        this.connected = false;
        this.pool = {};
        this.pool_last = 1;
        this.srvInfo = {};
        this.userInfo = {};
        this.authenticated = false;
    }

    _onReceive({data}) {
        const msg = JSON.parse(data);
        switch (msg?.type) {
            case TYPE_RESPONSE: // Проверка ответов
                if (this.pool?.[msg.response_id]) {
                    this.pool?.[msg.response_id](msg.payload,msg.command);
                    delete this.pool?.[msg.response_id];
                }
            break;
            case TYPE_RESPONSABLE: // Проверка ответов
                this._onCommand(msg.payload,msg.command,(payload,command=null)=>{this.sendResponse(command,payload,msg.response_id)})
            break;
        }
    }

    setAuth(inf) {
        this.userInfo = inf;
        this.authenticated = true;
    }

    checkAuthIntegrity() {
        if (this.authenticated && this.userInfo?.inf?.devices) {
            // Перекинуть файлы


        }
        return false;
    }
    
    _onClose() {
        this.connected = false;
        console.log("DISCONNECT");
    }

    _onCommand(command,payload,response=()=>{}) {

    }

    close() {
        this.socket.close();
    }

    tryConnect(server) {
        return new Promise((res,rej)=>{
            try {
                if (this.connected) {this.socket.close();};
                this.socket = new WebSocket(`ws://${server}`);
                this.socket.onopen = ()=>{
                    this.connected = true;
                    this.socket.onmessage = this._onReceive.bind(this);
                    this.socket.onclose = this._onClose.bind(this);
                    res();
                };
                this.socket.onclose = ()=>{this.connected = false; rej();};
            } catch (e) {
                rej(e);
            }
        })
    }

    async loadServerInfo() {
        try {
            this.srvInfo = await this.sendResponsableCommand(CMD_GETSRVINFO);
            return this.srvInfo;
        } catch (e) {
            this.socket.close();
            this.connected = false;
        }
        
    }

    sendResponsableCommand(command,payload,timeout=10) {
        return new Promise((res,rej)=>{
            if (this.connected) {
                this.pool_last++;
                const response_id = this.pool_last;
                this.pool[response_id] = res;
                try {
                    this.socket.send(JSON.stringify({
                        command,
                        payload,
                        type:"responsable",
                        response_id
                    }))
                } catch (e) {
                    rej("Disconnected");
                    return;
                }

                setTimeout(()=>{this.pool[response_id] && rej({
                    command,
                    error:"timeout"
                })},timeout*1000);
            } else {
                rej("Disconnected");
            }
        })
    }

    sendCommand(command,payload) {
        if (this.connected) {
            this.socket.send(JSON.stringify({command,payload,type:TYPE_SIMPLE}))
        } else {
            throw "Disconnected";
        }
    }

    sendResponse(command,payload) {
        this.socket.send(JSON.stringify({command,payload,response_id,type:TYPE_RESPONSE}))
    }
}

module.exports = WS;