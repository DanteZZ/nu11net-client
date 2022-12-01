import { randomHash } from "../../utils/hash";

export class VMRunner {
    private vmList: VM[] = [];
    public create(callback: Function): VM {
        const vm = new VM(callback, this);
        this.vmList.push(vm);
        return vm;
    }
    public remove(vm: VM) {
        vm.removeWebView();
        this.vmList = this.vmList.filter((i) => i !== vm);
    }
    public unavailableHash(hash: string): Boolean {
        return !!this.vmList.find((i) => i.hash === hash);
    }
}

export class VM {
    private webView: HTMLIFrameElement;
    private vmRunner: VMRunner;
    public hash: string;
    public pid: string;

    constructor(callback: Function, vmRunner: VMRunner) {
        this.vmRunner = vmRunner;
        const wv = createWebviewElement();
        wv.style.display = "none";
        wv.src = "dist/vm/index.html";
        wv.setAttribute("partition", "trusted");
        wv.setAttribute("allownw", "allownw");

        let hash = "";
        do {
            // Генерим незанятый хеш
            hash = randomHash();
        } while (vmRunner.unavailableHash(hash));

        this.hash = hash;
        this.pid = hash;

        this.webView = document.body.appendChild(wv);
        this.webView.addEventListener("contentload", () => {
            this?.webView?.contentWindow?.postMessage({
                setpid: true,
                pid: hash,
            });
            callback(this);
        });
    }

    public remove() {
        this.vmRunner.remove(this);
    }

    public removeWebView() {
        this.webView.remove();
    }
}

const vmRunner = new VMRunner();
export default vmRunner;
