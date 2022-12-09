import { eInterface } from "../enums";
import { iDevice } from "../utils/device";
import PortableDevice from "../utils/portableDevice";

export default class UsbStorage extends PortableDevice {
    constructor(info: iDevice) {
        super(
            info,
            [
                {
                    id: info.id,
                    type: eInterface.storage,
                    socketId: "storage:0",
                },
            ],
            [
                {
                    id: "storage:0",
                    type: eInterface.storage,
                },
            ]
        );
    }
    onConnect(): void {
        const storage = this.socket("storage:0").get();
        const device = this.connectedPort?.getDevice();
        if (storage && device) {
            storage._init(device);
        }
    }
    onDisconnect(): void {
        const storage = this.socket("storage:0").get();
        const device = this.connectedPort?.getDevice();
        console.log(device, storage);
        if (storage && device) {
            storage._terminate(device);
        }
    }
}
