import { VMSender } from "./vm";

const initVm = async () => {
    const vmSender = new VMSender();
    await vmSender.init();
    console.log(vmSender.pid);

    vmSender.commandRunner.registerCommand(
        "/check/response",
        (data: string) => {
            return new Promise((res, rej) => {
                setTimeout(() => res(`JopaPopa ${data}`), 1000);
            });
        },
        true
    );

    vmSender.commandRunner.dispatchEvent("checkEvent", "Some data");
    vmSender.commandRunner.sendCommand("/aboba/check", "checkText");
    console.log(vmSender);
};

initVm();
