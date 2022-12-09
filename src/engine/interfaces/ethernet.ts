import { EventEmitter } from "../../utils/eventEmitter";
import { eConnectionType } from "../enums";
import ConnectableInterface from "../utils/connectableInterface";

export default class Ethernet extends ConnectableInterface {
    connectionTypes: eConnectionType[] = [eConnectionType.twistedPair];
    ee = new EventEmitter();
    public _tx(payload: any) {
        const receiver = this.connectedTo();
        if (receiver && receiver instanceof Ethernet) {
            receiver._rx(payload);
            this.ee.emit("tx", payload);
            this.getCmd()?.sendEvent(
                `interfaces/${this.type}/${this.id}/tx`,
                payload
            );
            return true;
        }
        return false;
    }

    public _rx(payload: any) {
        this.ee.emit("rx", payload);
        this.getCmd()?.sendEvent(
            `interfaces/${this.type}/${this.id}/rx`,
            payload
        );
    }

    protected getCmd() {
        const device = this.controller.device;
        if (device && device.vm) {
            return device.vm.commandRunner;
        } else {
            return null;
        }
    }

    public async _init() {
        const cat = `interfaces/${this.type}/${this.id}`;
        const cmd = this.getCmd();
        if (cmd) {
            cmd.registerCommand(cat + "send", (payload: any) =>
                this._tx(payload)
            );
        }
        return true;
    }
}
