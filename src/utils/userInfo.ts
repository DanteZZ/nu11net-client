import { eDevice, eProtableDevice } from "../engine/enums";
import { tInterfaceType } from "../engine/utils/interface";

export interface iUserInfo {
    devices: iUserDevice[];
    portableDevices: iUserPortableDevice[];
    [key: string]: any;
}

export interface iUserDevice {
    id: string;
    type: eDevice;
    interfaces: iUserDeviceInterface[];
    [key: string]: any;
}

export interface iUserPortableDevice {
    id: string;
    type: eProtableDevice;
    connectedTo: null | string;
    [key: string]: any;
}

export interface iUserDeviceInterface {
    id: string;
    type: tInterfaceType;
    socketId: string;
    [key: string]: any;
}
