import Device from "./device";
import vmRunner, { VM } from "./vmRunner";

export interface iInterfaceInfo {
    name: string;
    type: string;
}

export default abstract class VirtualDevice extends Device {
    protected power: Boolean = false;

    public regCommands(): void {}
    private _regCommands() {
        if (this.vm) {
            this.regCommands();
            this.vm.commandRunner.registerCommand(
                "board/interfaces/list",
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
            this.vm.commandRunner.registerCommand("vm/sockets/list", () =>
                this.sockets.map((s) => ({ id: s.id, type: s.type }))
            );

            this.vm.commandRunner.registerCommand(
                "board/power/off",
                this.powerOff,
                true
            );
            this.vm.commandRunner.registerCommand(
                "board/power/on",
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

    public async powerOff() {
        await this.initInterfaces();
        this?.vm?.remove();
        this.vm = undefined;
        this.power = false;
        this.afterPowerOff();
    }

    public async powerOn() {
        if (!this.vm) {
            this.vm = vmRunner.create();
            await this.initInterfaces();
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
