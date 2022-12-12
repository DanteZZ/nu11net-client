import { eConnectionType, eDevice, eProtableDevice } from "../engine/enums";
import { tInterfaceType } from "../engine/utils/interface";
import { iPosition } from "../engine/utils/interfaces";

export interface iUserInfo {
    devices: iUserDevice[];
    portableDevices: iUserPortableDevice[];
    cables: iUserCable[];
    cableConnections: iUserCableConnection[];
    [key: string]: any;
}

export interface iUserDevice {
    id: string;
    type: eDevice;
    interfaces: iUserDeviceInterface[];
    position: iPosition;
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

export interface iUserCable {
    id: string;
    type: eConnectionType;
    [key: string]: any;
}

export type tUserConnection = [[string, string], [string, string]];

export interface iUserCableConnection {
    cable: string;
    connection: tUserConnection;
    [key: string]: any;
}
