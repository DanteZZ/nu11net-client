import { eConnectableInterface, eInterface, ePortInterface } from "../enums";
import Storage from "../interfaces/storage";
import { iDevice } from "../utils/device";
import { iInterface } from "../utils/interface";
import VirtualDevice from "../utils/virtualDevice";

export default class PC extends VirtualDevice {
    constructor(info: iDevice, intList: iInterface[]) {
        super(info, intList, [
            { id: "eth:1", type: eConnectableInterface.ethernet },
            { id: "input:1", type: eInterface.input },
            { id: "display:1", type: eInterface.display },
            { id: "storage:1", type: eInterface.storage },
            { id: "usb:1", type: ePortInterface.usb },
        ]);
    }

    public async onVmReady() {
        console.log("Vm is ready!");
        const storage = this.socket("storage:1").get();
        await this.vm?.sendCommand(
            "vm/makemainthread",
            {
                __boot: {
                    storage: "_iStorage",
                },
            },
            true
        );
        if (storage && storage instanceof Storage) {
            const initScript = await storage.readData("kernel/init");
            if (initScript) {
                this.vm?.sendCommand("vm/runinmainthread", initScript);
            }
        }
    }
}
