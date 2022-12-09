import Device from "../engine/utils/device";
import NetworkSocket from "../engine/devices/networkSocket";
import PC from "../engine/devices/pc";
import { eDevice, eProtableDevice } from "../engine/enums";
import { iUserInfo } from "./userInfo";
import { readFileSync } from "fs";
import { basedir } from "./consts";
import PortableDevice from "../engine/utils/portableDevice";
import UsbStorage from "../engine/portableDevices/usbStorage";

const config: iUserInfo = JSON.parse(
    readFileSync(basedir + "/test.json", "utf-8")
);
declare global {
    interface Window {
        _devs: any;
        _pdevs: any;
    }
}

const devices: Device[] = [];
const portableDevices: PortableDevice[] = [];

config.devices.forEach((d) => {
    if (d.type === eDevice.pc) {
        devices.push(new PC(d, d.interfaces));
    }
    if (d.type === eDevice.networkSocket) {
        devices.push(new NetworkSocket(d, d.interfaces));
    }
});

config.portableDevices.forEach((d) => {
    if (d.type === eProtableDevice.usbStorage) {
        portableDevices.push(new UsbStorage(d));
    }
});

window._devs = devices;
window._pdevs = portableDevices;

window._devs[1].powerOn();
window._devs[1].socket("usb:1").get().connect(window._pdevs[0]);
// window._devs[1].socket("usb:1").get().disconnect();
console.log(window._devs[1].vm.commandRunner.commandList);
