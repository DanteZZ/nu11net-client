import { Canvas, GameObject } from "oge-ts";
import { eDevice, eProtableDevice } from "../../../engine/enums";
import Device from "../../../engine/utils/device";
import { sDeviceNetworkSocket, sDevicePc } from "../sprites";

class DeviceObject extends GameObject {
    device: Device;
    constructor(
        device: Device,
        type: eDevice | eProtableDevice,
        x: number,
        y: number
    ) {
        super();
        this.x = x;
        this.y = y;
        this.device = device;
        let sprite = null;
        let frame = 0;
        switch (type) {
            case eDevice.pc:
                sprite = sDevicePc;
                frame = 1;
                break;
            case eDevice.networkSocket:
                sprite = sDeviceNetworkSocket;
                break;
        }
        this.sprite = sprite?.createInstance() || null;
        this.sprite && (this.sprite.frame = frame);
    }
    // draw(canvas?: Canvas): void {
    //     canvas &&
    //         this.sprite?.draw(
    //             canvas,
    //             this.x,
    //             this.y,
    //             undefined,
    //             undefined,
    //             undefined,
    //             undefined,
    //             "drop-shadow(0px 0px 14px rgba(0,178,255,0.75))"
    //         );
    // }
}

export default DeviceObject;
