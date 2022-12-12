import {
    eDevice,
    eConnectableInterface,
    eProtableDevice,
    eInterface,
    ePortInterface,
} from "../enums";

import Interface, { iInterface, tInterfaceType } from "./interface";

import Display from "../interfaces/display";
import Ethernet from "../interfaces/ethernet";
import Input from "../interfaces/input";
import Storage from "../interfaces/storage";
import Usb from "../interfaces/usb";
import Socket, { iSocket } from "./socket";
import { VM } from "./vmRunner";
import { iInterfaceInfo } from "./virtualDevice";
import { iPosition } from "./interfaces";

export interface iDevice {
    id: string;
    type: eDevice | eProtableDevice;
    position?: iPosition;
    [key: string]: any;
}

export abstract class Device implements iDevice {
    readonly id;
    readonly type;
    readonly sockets: Socket[];
    public vm?: VM;
    public position?: iPosition;

    constructor(info: iDevice, intList: iInterface[], sockets: iSocket[] = []) {
        this.id = info.id;
        this.type = info.type;
        this.position = info?.position;

        this.sockets = sockets.map((s) => new Socket(s.id, s.type, this));
        this.sockets.forEach((s) =>
            s.set(this.createInterface(s.id, s, intList))
        );
    }

    private createInterface(
        id: string,
        socket: Socket,
        list: iInterface[]
    ): Interface | null {
        const i = list.find((i) => i?.socketId === id);
        if (i) {
            switch (i.type) {
                // Default
                case eInterface.display:
                    return new Display(i, socket);
                case eInterface.input:
                    return new Input(i, socket);
                case eInterface.storage:
                    return new Storage(i, socket);
                // Connectable
                case eConnectableInterface.ethernet:
                    return new Ethernet(i, socket);
                // Port
                case ePortInterface.usb:
                    return new Usb(i, socket);
            }
        }
        return null;
    }

    public getSocket(type: tInterfaceType): Interface | null {
        return this.sockets.find((s) => s.type === type)?.get() || null;
    }

    public socket(id: string): Socket {
        const result = this.sockets.find((s) => s.id === id);
        if (result) {
            return result;
        } else {
            throw new Error(`Undefined socket: ${id}`);
        }
    }

    public interfaceList(type?: string) {
        return this.sockets
            .filter((s) => s.get() && (type ? s.type === type : true))
            .map((s) => {
                const item: iInterfaceInfo = {
                    name: s.get()?.id || "",
                    type: s.type,
                };
                return item;
            });
    }

    public initInterfaces() {
        const promises = this.sockets
            .filter((s) => s.get())
            .map((s) => s.get()?._init(this));
        return Promise.all(promises);
    }

    public terminateInterfaces() {
        const promises = this.sockets
            .filter((s) => s.get())
            .map((s) => s.get()?._terminate(this));
        return Promise.all(promises);
    }
}

export default Device;
