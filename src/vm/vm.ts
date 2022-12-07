import {
    tVmMessageCommand,
    tVmMessageEvent,
    tVmMessageResponse,
} from "../engine/interfaces/vmRunner";
import CommandRunner from "../engine/utils/commandRunner";
import VM from "vm";

export class VMSender {
    public pid: string = "";
    public source: MessageEventSource | null = null;
    public commandRunner: CommandRunner;
    private initHandler: Function = () => {};
    constructor() {
        this.commandRunner = new CommandRunner(this);
        window.addEventListener(
            "message",
            (event: MessageEvent) => this.messageHandler(event),
            false
        );
    }
    public init() {
        return new Promise((res, rej) => {
            this.initHandler = res;
        });
    }
    public sendMessage(
        payload: tVmMessageCommand | tVmMessageEvent | tVmMessageResponse
    ) {
        this.source?.postMessage(
            JSON.parse(JSON.stringify({ payload, pid: this.pid }))
        );
    }
    public messageHandler(event: MessageEvent) {
        if (event.data?.setPid) {
            this.proccessInitMessage(event);
        } else {
            this.proccessMessage(event.data.payload);
        }
    }
    public proccessMessage(
        data: tVmMessageCommand | tVmMessageEvent | tVmMessageResponse
    ) {
        if ("command" in data) {
            this.commandRunner.handleCommand(data);
        }
        if ("event" in data) {
            this.commandRunner.handleEvent(data);
        }
        if ("response" in data) {
            this.commandRunner.handleResponse(data);
        }
    }
    public proccessInitMessage(event: MessageEvent) {
        this.pid = event.data.pid;
        this.source = event.source;
        this.initHandler();
    }

    public sendCommand(name: string, data?: any, responsable?: Boolean) {
        return new Promise((res) => {
            if (responsable) {
                this.commandRunner.sendResponsableCommand(name, res, data);
            } else {
                res(this.commandRunner.sendCommand(name, data));
            }
        });
    }
}

export const vmFunctions = (vmSender: VMSender) => ({
    sendCommand: (command: string, data?: any, callback?: Function) =>
        callback
            ? vmSender.commandRunner.sendResponsableCommand(
                  command,
                  callback,
                  data
              )
            : vmSender.commandRunner.sendCommand(command, data),
    sendEvent: (event: string, data?: any) =>
        vmSender.commandRunner.sendEvent(event, data),

    listenEvent: (event: string, listener: Function) =>
        vmSender.commandRunner.listenEvent(event, listener),
    unlistenEvent: (event: string, listener: Function) =>
        vmSender.commandRunner.unlistenEvent(event, listener),
});

export const threadFunctions = {
    mk: function (ctx: any) {
        return VM.createContext(ctx);
    },
    runScript: function (ctx: any, script: string) {
        try {
            VM.runInContext(script, ctx);
            return true;
        } catch (e) {
            throw e;
        }
    },
};

interface iRegCommandParams {
    path: string;
    handler: Function;
}

interface iDoEventParams {
    event: string;
    data?: any;
}

export const regVmCommands = (mainContext: Object, vmSender: VMSender) => {
    // Common commands
    vmSender.commandRunner.registerCommand(
        "vm/makemainthread",
        (context: any = {}) => {
            let ctx = {
                ...context,
                console,
                Math,
                setInterval,
                setTimeout,
                __vm: vmFunctions(vmSender),
                __thread: threadFunctions,
            };
            mainContext = VM.createContext(ctx);
            return true;
        }
    );

    vmSender.commandRunner.registerCommand(
        "vm/runinmainthread",
        (script?: string) => {
            if (mainContext && script) {
                try {
                    VM.runInContext(script, mainContext);
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
                return true;
            } else {
                return false;
            }
        }
    );

    // Local Commands
    vmSender.commandRunner.registerLocalCommand(
        "vm/commands/reg",
        ({ path, handler }: iRegCommandParams) => {
            vmSender.commandRunner.registerLocalCommand(path, handler);
        }
    );
    vmSender.commandRunner.registerLocalCommand(
        "vm/doEvent",
        (e: iDoEventParams) => {
            vmSender.commandRunner.sendEvent(e.event, e.data);
        }
    );
};
