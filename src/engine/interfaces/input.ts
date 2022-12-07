import { VMSender } from "../../vm/vm";
import { VmInterface } from "../utils/interface";
import { iInterfaceInfo } from "../utils/virtualDevice";

export default class Input extends VmInterface {
    public static vmInit(vmSender: VMSender, info: iInterfaceInfo) {
        //Keyboard
        document.addEventListener("keydown", (h) =>
            vmSender.commandRunner.sendEvent(`${info.type}/keydown`, h.keyCode)
        );
        document.addEventListener("keypress", (h) =>
            vmSender.commandRunner.sendEvent(`${info.type}/keypress`, h.keyCode)
        );
        document.addEventListener("keyup", (h) =>
            vmSender.commandRunner.sendEvent(`${info.type}/keyup`, h.keyCode)
        );

        //Mouse
        document.onmousedown = (e) =>
            vmSender.commandRunner.sendEvent(
                `${info.type}/mousedown`,
                e.button
            );
        document.onmouseup = (e) =>
            vmSender.commandRunner.sendEvent(`${info.type}/mouseup`, e.button);
        document.onmousemove = (e) =>
            vmSender.commandRunner.sendEvent(`${info.type}/mousemove`, {
                x: e.clientX,
                y: e.clientY,
            });
    }
}
