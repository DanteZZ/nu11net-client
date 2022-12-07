import { EventEmitter } from "../../utils/eventEmitter";
import { VMSender } from "../../vm/vm";
import { VmInterface } from "../utils/interface";
import { iInterfaceInfo } from "../utils/virtualDevice";

class DisplayElement {
    private src: HTMLElement;
    private eventEmmiter = new EventEmitter();
    private listenersMap = new Map();

    constructor(tag: any) {
        this.src = typeof tag == "object" ? tag : document.createElement(tag);
    }

    #_getNode() {
        return this.src;
    }

    listEvent(event: string, listener: Function) {
        this.listenersMap.set(listener, (e: any) =>
            this.eventEmmiter.emit(event, e)
        );
        this.eventEmmiter.on(event, listener);
        this.#_getNode().addEventListener(
            event,
            this.listenersMap.get(listener)
        );
    }

    unlistEvent(event: string, listener: Function) {
        this.eventEmmiter.removeListener(event, listener);
        this.#_getNode().removeEventListener(
            event,
            this.listenersMap.get(listener)
        );
    }

    setStyles(style: CSSStyleDeclaration) {
        for (const property in style)
            this.#_getNode().style[property] = style[property];
    }

    putElement(el: DisplayElement) {
        this.#_getNode().appendChild(el.#_getNode());
    }

    clear() {
        this.#_getNode().innerHTML = "";
    }

    putHtml(data: string) {
        this.#_getNode().innerHTML = data;
    }

    putText(data: string) {
        this.#_getNode().innerText = data;
    }

    getChildrens() {
        return (
            Object.values(this.#_getNode()?.children)?.map(
                (e) => new DisplayElement(e)
            ) || []
        );
    }

    getChildNodes() {
        return (
            Object.values(this.#_getNode()?.childNodes)?.map(
                (e) => new DisplayElement(e)
            ) || []
        );
    }

    getParam(param: string) {
        // @ts-ignore: Unreachable code error
        return this.#_getNode()[param];
    }
    setParam(param: string, val: any) {
        // @ts-ignore: Unreachable code error
        this.#_getNode()[param] = val;
    }

    focus() {
        this.#_getNode().focus();
    }

    blur() {
        this.#_getNode().blur();
    }

    setAttribute(a: string, b: string) {
        return this.#_getNode().setAttribute(a, b);
    }
}

export default class Display extends VmInterface {
    public static vmInit(vmSender: VMSender, info: iInterfaceInfo) {
        const screen = new DisplayElement(document.getElementById("screen"));

        vmSender.commandRunner.registerLocalCommand(
            `${info.type}/getscreen`,
            () => screen
        );
        vmSender.commandRunner.registerLocalCommand(
            `${info.type}/createelement`,
            (tag: string) => new DisplayElement(tag)
        );
    }
}
