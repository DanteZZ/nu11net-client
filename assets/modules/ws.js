const { copyFolderRecursiveSync } = require("./fsAdvance");

const path = require("path");
const fs = require("fs");
const fse = require('fs-extra');

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
        this.packageReceiver = () => {};
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

        if (msg.command == "send_package") {
            this.packageReceiver(msg.payload);
        };

    }

    setAuth(inf) {
        this.userInfo = inf;
        this.authenticated = true;
    }

    checkFiles() {
        if (this.authenticated && this.userInfo?.inf?.devices) {
            const pth = path.join(process.cwd(),global.__cfg.get().serversDir,this.srvInfo.hash);

            // Если нет папки сервера
            if (!fs.existsSync(pth)) { 
                fs.mkdirSync(pth);
            };

            // Если нет папки юзера
            if (!fs.existsSync(path.join(pth,String(this.userInfo.id)))) { 
                fs.mkdirSync(path.join(pth,String(this.userInfo.id)));
            };

            // Если нет папки интерфейса
            if (!fs.existsSync(path.join(pth,String(this.userInfo.id),"interfaces"))) { 
                fs.mkdirSync(path.join(pth,String(this.userInfo.id),"interfaces"));
            };

            // Проверка устройств
            for (var devn in this.userInfo.inf.devices) {
                const dev = this.userInfo.inf.devices[devn];
                for (var intn in dev.interfaces) {
                    const int = dev.interfaces[intn];
                    if (
                        !fs.existsSync(path.join(pth,String(this.userInfo.id),"interfaces",intn)) &&
                        fs.existsSync(path.join(process.cwd(),"initial",dev.type,int.type))
                    ) { 
                        fse.copySync(
                            path.join(process.cwd(),"initial",dev.type,int.type),
                            path.join(pth,String(this.userInfo.id),"interfaces",intn)
                        )
                    };
                }
            }
            return true;
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