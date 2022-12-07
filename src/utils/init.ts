import NetworkSocket from "../engine/devices/networkSocket";
import PC from "../engine/devices/pc";
import { eDevice } from "../engine/enums";
import Device from "../engine/utils/device";
import { iUserInfo } from "./userInfo";

const config: iUserInfo = JSON.parse(`{
  "devices": [
    {
      "type": "networkSocket",
      "id": "_ns1",
      "interfaces": [
        {
            "id": "_iEthernet1",
            "type": "ethernet",
            "socketId": "eth:1"
        }
      ]
    },
    {
      "type": "pc",
      "id": "_pc1",
      "interfaces": [
        {
            "id": "_iEthernet1",
            "type": "ethernet",
            "socketId": "eth:1"
        },
        {
            "id": "_iInput",
            "type": "input",
            "socketId": "input:1"
        },
        {
            "id": "_iDisplay",
            "type": "display",
            "socketId": "display:1"
        }
      ]
    }
  ]
}`);

declare global {
    interface Window {
        _devs: any;
    }
}

const devices: Device[] = [];

config.devices.forEach((d) => {
    if (d.type === eDevice.networkSocket) {
        devices.push(new NetworkSocket(d, d.interfaces));
    }

    if (d.type === eDevice.pc) {
        devices.push(new PC(d, d.interfaces));
    }
});

window._devs = devices;
