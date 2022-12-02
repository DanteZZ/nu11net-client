import NetworkSocket from "../engine/devices/networkSocket";
import { eDevice } from "../engine/enums";
import Device from "../engine/utils/device";
import vmRunner from "../engine/utils/vmRunner";
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

const initVm = async () => {
    const vm = vmRunner.create();
    await vm.init();
    vm.commandRunner.listenEvent("checkEvent", (data: any) => {
        console.log("It was checkEvent", data);
    });
    vm.commandRunner.registerCommand("/aboba/check", (data: any) => {
        console.log("It's ABOBA!", data);
    });
    vm.commandRunner.sendResponsableCommand(
        "/check/response",
        (answer: any) => {
            console.log(answer);
        },
        123
    );
    setTimeout(() => vmRunner.remove(vm), 5000);
};

initVm();
