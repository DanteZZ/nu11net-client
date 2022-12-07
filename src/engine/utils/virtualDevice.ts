import Device from "./device";
import vmRunner, { VM } from "./vmRunner";

export interface iInterfaceInfo {
    name: string;
    type: string;
}

export default abstract class VirtualDevice extends Device {
    protected power: Boolean = false;
    protected vm?: VM;

    public regCommands(): void {}
    private _regCommands() {
        if (this.vm) {
            this.regCommands();
            this.vm.commandRunner.registerCommand(
                "interfaces/list",
                (type?: string) =>
                    this.sockets
                        .filter(
                            (s) => s.get() && (type ? s.type === type : true)
                        )
                        .map((s) => {
                            const item: iInterfaceInfo = {
                                name: s.get()?.id || "",
                                type: s.type,
                            };
                            return item;
                        })
            );
            this.vm.commandRunner.registerCommand("sockets/list", () =>
                this.sockets.map((s) => ({ id: s.id, type: s.type }))
            );

            this.vm.commandRunner.registerCommand("power/off", this.powerOff);
            this.vm.commandRunner.registerCommand(
                "power/on",
                this.powerOn,
                true
            );
        }
    }

    private _regListeners() {
        this.vm?.commandRunner.listenEvent("vm/ready", () => this.onVmReady());
    }

    public isPower() {
        return this.power;
    }

    public powerOff() {
        this?.vm?.remove();
        this.vm = undefined;
        this.power = false;
        this.afterPowerOff();
    }

    public async powerOn() {
        if (!this.vm) {
            await this.initInterfaces();
            this.vm = vmRunner.create();
            this._regCommands();
            this._regListeners();
            await this.vm.init();
            this.power = true;
            this.afterPowerOn();
        }
    }

    public afterPowerOn(): void {}
    public afterPowerOff(): void {}
    public onVmReady(): void {}
}
