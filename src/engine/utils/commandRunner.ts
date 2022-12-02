import { EventEmitter } from "../../utils/eventEmitter";
import { VMSender } from "../../vm/vm";
import { iBufferItem, iCommandList } from "../interfaces/commandRunner";
import {
    tVmMessageCommand,
    tVmMessageEvent,
    tVmMessageResponse,
} from "../interfaces/vmRunner";
import { VM } from "./vmRunner";

export default class CommandRunner {
    private vm: VM | VMSender;
    private commandList: iCommandList = {};
    private commandBuffer: iBufferItem[] = [];
    private lastBufferId: number = 0;
    private eventEmitter: EventEmitter;
    constructor(vmr: VM | VMSender) {
        this.vm = vmr;
        this.eventEmitter = new EventEmitter();
    }

    public registerCommand(path: string, fn: Function, async: Boolean = false) {
        // Reg device command
        this.commandList[path] = { fn, async };
    }
    public removeCommand(path: string) {
        // Remove device command
        delete this.commandList?.[path];
    }
    public removeCommands() {
        // Remove all device commands
        this.commandList = {};
    }

    public listenEvent(event: string, listener: Function) {
        return this.eventEmitter.on(event, listener);
    }

    public unlistenEvent(event: string, listener: Function) {
        return this.eventEmitter.removeListener(event, listener);
    }

    public dispatchEvent(event: string, data: any) {
        this.vm.sendMessage({ event, data });
    }

    public async handleCommand(data: tVmMessageCommand) {
        // handle command from VM
        if (this.commandList[data.command]) {
            let result = undefined;
            if (this.commandList[data.command].async) {
                result = await this.commandList[data.command].fn(data.data);
            } else {
                result = this.commandList[data.command].fn(data.data);
            }
            if (data.bufferId) {
                this.sendResponse(data.bufferId, result);
            }
        }
    }

    public async handleEvent(data: tVmMessageEvent) {
        this.eventEmitter.emit(data.event, data.data);
    }

    public async handleResponse(data: tVmMessageResponse) {
        // handle response from VM
        const bufferIdx = this.commandBuffer.findIndex(
            (i) => i.bufferId === data.bufferId
        );
        if (bufferIdx > -1) {
            this.commandBuffer[bufferIdx].fn(data?.data);
            this.commandBuffer.splice(bufferIdx, 1);
        }
    }

    public sendCommand(command: string, data?: any) {
        this.vm.sendMessage({ command, data });
    }

    public sendResponsableCommand(
        command: string,
        callback: Function,
        data?: any
    ) {
        this.lastBufferId++;
        this.commandBuffer.push({
            bufferId: this.lastBufferId,
            fn: callback,
        });
        this.vm.sendMessage({ command, data, bufferId: this.lastBufferId });
    }

    public sendEvent(event: string, data?: any) {
        this.vm.sendMessage({ event, data });
    }

    public sendResponse(bufferId: number, data?: any) {
        this.vm.sendMessage({ response: true, bufferId, data });
    }
}
