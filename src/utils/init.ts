import NetworkSocket from "../engine/devices/networkSocket";
import PC from "../engine/devices/pc";
import { eDevice, eProtableDevice } from "../engine/enums";
import { iUserInfo } from "./userInfo";
import { readFileSync } from "fs";
import { basedir } from "./consts";
import UsbStorage from "../engine/portableDevices/usbStorage";
import cableConnector from "../engine/utils/cableConnector";

import Game from "../game";
import { Devices, PortableDevices } from "./common";

const config: iUserInfo = JSON.parse(
    readFileSync(basedir + "/test.json", "utf-8")
);

console.log(config);
declare global {
    interface Window {
        _devs: any;
        _pdevs: any;
        _cc: any;
        _oge: any;
    }
}

/* SPAWN DEVICES */

config.devices.forEach((d) => {
    if (d.type === eDevice.pc) {
        Devices.push(new PC(d, d.interfaces));
    }
    if (d.type === eDevice.networkSocket) {
        Devices.push(new NetworkSocket(d, d.interfaces));
    }
});

/* SPAWN PORTABLE DEVICES */

config.portableDevices.forEach((d) => {
    if (d.type === eProtableDevice.usbStorage) {
        PortableDevices.push(new UsbStorage(d));
    }
});

/* SPAWN CABLES */

config.cables.forEach((c) => {
    cableConnector.addCable(c);
});

/* CREATE CABLE CONNECTIONS */

cableConnector.setDeviceList(Devices);
cableConnector.setConnections(config.cableConnections);
cableConnector.updateConnections();

/* START OGE */

Game().then((e) => (window._oge = e));

window._devs = Devices;
window._pdevs = PortableDevices;
window._cc = cableConnector;

// window._devs[1].powerOn();
// window._devs[1].socket("usb:1").get().connect(window._pdevs[0]);
// window._devs[1].socket("usb:1").get().disconnect();
