import { EventEmitter } from "../../utils/eventEmitter";
import { VMSender } from "../../vm/vm";
import { VmInterface } from "../utils/interface";
import { iInterfaceInfo } from "../utils/virtualDevice";

export default class Input extends VmInterface {
    public static vmInit(vmSender: VMSender, info: iInterfaceInfo) {
        const EE = new EventEmitter();
        //Keyboard
        document.addEventListener("keydown", (h) => {
            vmSender.commandRunner.sendEvent(`${info.type}/keydown`, h.keyCode);
            EE.emit("keydown", h);
        });
        document.addEventListener("keypress", (h) => {
            vmSender.commandRunner.sendEvent(
                `${info.type}/keypress`,
                h.keyCode
            );
            EE.emit("keypress", h);
        });
        document.addEventListener("keyup", (h) => {
            vmSender.commandRunner.sendEvent(`${info.type}/keyup`, h.keyCode);
            EE.emit("keyup", h);
        });

        //Mouse
        document.onmousedown = (e) => {
            vmSender.commandRunner.sendEvent(
                `${info.type}/mousedown`,
                e.button
            );
            EE.emit("mousedown", e);
        };
        document.onmouseup = (e) => {
            vmSender.commandRunner.sendEvent(`${info.type}/mouseup`, e.button);
            EE.emit("mouseup", e);
        };
        document.onmousemove = (e) => {
            vmSender.commandRunner.sendEvent(`${info.type}/mousemove`, {
                x: e.clientX,
                y: e.clientY,
            });
            EE.emit("mousemove", e);
        };

        vmSender.commandRunner.registerLocalCommand("input/get", () => EE);
    }
}
