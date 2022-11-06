import NetworkSocket from "../engine/devices/networkSocket";
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
            "socketId": "eth1"
        }
      ]
    }
  ]
}`);

const devices: Device[] = [];

config.devices.forEach((d) => {
  if (d.type === eDevice.networkSocket) {
    devices.push(new NetworkSocket(d, d.interfaces));
  }
});

console.log(devices);
