import { randomHash } from "../../utils/hash";
import {
    tVmMessageCommand,
    tVmMessageEvent,
    tVmMessageResponse,
} from "./interfaces/vmRunner";
import CommandRunner from "./commandRunner";

export class VMRunner {
    private vmList: VM[] = [];
    constructor() {
        window.addEventListener(
            "message",
            (event: MessageEvent) => this.onMessage(event),
            false
        );
    }
    public create(): VM {
        const vm = new VM(this);
        this.vmList.push(vm);
        return vm;
    }
    public remove(vm: VM) {
        vm.removeWebView();
        this.vmList = this.vmList.filter((i) => i !== vm);
    }
    public unavailableHash(hash: string): Boolean {
        return !!this.vmList.find((i) => i.hash === hash);
    }
    public getVm(pid: string) {
        return this.vmList.find((i) => i.pid === pid);
    }
    private onMessage(event: MessageEvent) {
        const { pid, payload } = event.data;
        const vm = this.getVm(pid);
        if (vm) {
            vm.proccessMessage(payload);
        }
    }
}

export class VM {
    private webView: HTMLIFrameElement;
    private vmRunner: VMRunner;
    public hash: string;
    public pid: string;
    public commandRunner: CommandRunner;

    constructor(vmRunner: VMRunner) {
        this.vmRunner = vmRunner;
        this.commandRunner = new CommandRunner(this);
        const wv = createWebviewElement();
        wv.style.display = "none";
        wv.src = "dist/vm/index.html";
        wv.setAttribute("partition", "trusted");
        wv.setAttribute("allownw", "allownw");

        let hash = "";
        do {
            // Генерим незанятый хеш
            hash = randomHash();
        } while (vmRunner.unavailableHash(hash));

        this.hash = hash;
        this.pid = hash;
        this.webView = document.body.appendChild(wv);
    }

    public async init() {
        return new Promise((res, rej) => {
            this.webView.addEventListener("contentload", () => {
                this?.webView?.contentWindow?.postMessage({
                    setPid: true,
                    pid: this.pid,
                });
                res(true);
            });
        });
    }

    public sendMessage(
        payload: tVmMessageCommand | tVmMessageEvent | tVmMessageResponse
    ) {
        this?.webView?.contentWindow?.postMessage({
            pid: this.pid,
            payload,
        });
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

    public remove() {
        this.vmRunner.remove(this);
    }

    public removeWebView() {
        this.webView.remove();
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

const vmRunner = new VMRunner();
export default vmRunner;
