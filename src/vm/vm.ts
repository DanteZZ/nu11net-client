import {
    tVmMessageCommand,
    tVmMessageEvent,
    tVmMessageResponse,
} from "../engine/interfaces/vmRunner";
import CommandRunner from "../engine/utils/commandRunner";

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
        this.source?.postMessage({ payload, pid: this.pid });
    }
    messageHandler(event: MessageEvent) {
        if (event.data?.setPid) {
            this.proccessInitMessage(event);
        } else {
            this.proccessMessage(event.data.payload);
        }
    }
    proccessMessage(
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
    proccessInitMessage(event: MessageEvent) {
        this.pid = event.data.pid;
        this.source = event.source;
        this.initHandler();
    }
}
