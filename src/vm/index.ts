import Display from "../engine/interfaces/display";
import Input from "../engine/interfaces/input";
import { VmInterface } from "../engine/utils/interface";
import { iInterfaceInfo } from "../engine/utils/virtualDevice";
import { regVmCommands, VMSender } from "./vm";

interface iVmInterfaceTypes {
    [key: string]: VmInterface;
}

const vmInterfaceTypes: iVmInterfaceTypes = {
    /* @ts-ignore: Unreachable code error */
    display: Display,
    /* @ts-ignore: Unreachable code error */
    input: Input,
};

const initVm = async () => {
    try {
        const mainContext = {};
        const vmSender = new VMSender();
        await vmSender.init();
        const interfaces = await vmSender.sendCommand(
            "interfaces/list",
            false,
            true
        );
        // @ts-ignore: Unreachable code error
        interfaces
            .filter((i: iInterfaceInfo) => vmInterfaceTypes[i.type])
            .map((i: iInterfaceInfo) => {
                // @ts-ignore: Unreachable code error
                vmInterfaceTypes[i.type].vmInit(vmSender, i);
            });
        regVmCommands(mainContext, vmSender);

        vmSender.commandRunner.sendEvent("vm/ready", true);

        console.warn(`VmSender PID: ${vmSender.pid}`, vmSender);
    } catch (e) {
        console.error(e);
    }
};

initVm();
