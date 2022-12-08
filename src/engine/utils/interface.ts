import { VMSender } from "../../vm/vm";
import { eConnectableInterface, eInterface, ePortInterface } from "../enums";
import Socket from "./socket";
import { iInterfaceInfo } from "./virtualDevice";

export type tInterfaceType =
    | eInterface
    | eConnectableInterface
    | ePortInterface;

export interface iInterface {
    id: string;
    type: tInterfaceType;
    socketId?: string;
    [key: string]: any;
}

export default abstract class Interface implements iInterface {
    protected controller: Socket;
    readonly id;
    readonly type;
    constructor(info: iInterface, controller: Socket) {
        this.controller = controller;
        this.id = info.id;
        this.type = info.type;
    }
    public async _init(data?: any): Promise<boolean> {
        return await new Promise((res) => res(true));
    }
}

export abstract class VmInterface extends Interface {
    public static vmInit(vmSender: VMSender, info: iInterfaceInfo): void {
        throw new Error("not implemented!");
    }
}
