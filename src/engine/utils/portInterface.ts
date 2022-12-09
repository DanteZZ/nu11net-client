import { eDevice, eProtableDevice } from "../enums";
import Device from "./device";
import Interface from "./interface";
import PortableDevice from "./portableDevice";
import { iInterfaceInfo } from "./virtualDevice";

export default abstract class PortInterface extends Interface {
    abstract readonly connectionTypes: eProtableDevice[];
    private connectedPortableDevice: PortableDevice | null = null;

    public getDevice(): Device {
        return this.controller?.device;
    }

    public connectedTo() {
        return this.connectedPortableDevice;
    }
    public isConnected(): Boolean {
        return !!this.connectedPortableDevice;
    }

    public canConnect(type: eProtableDevice | eDevice): Boolean {
        return Object.values(this.connectionTypes)
            .map((e) => e.toString())
            .includes(type);
    }

    public connect(cDev: PortableDevice): boolean {
        if (this.canConnect(cDev.type)) {
            this.connectedPortableDevice = cDev;
            this.connectedPortableDevice._onConnect(this);
            this.connectedPortableDevice.onConnect();
            this.sendEvent("onconnect");
            return true;
        }
        return false;
    }
    public disconnect(): boolean {
        if (this.connectedPortableDevice) {
            this.connectedPortableDevice.onDisconnect();
            this.connectedPortableDevice._onDisconnect();
            this.connectedPortableDevice = null;
            this.sendEvent("ondisconnect");
            return true;
        }
        return false;
    }

    protected sendEvent(event: string) {
        this.getDevice()?.vm?.commandRunner.sendEvent(
            `interfaces/${this.type}/${this.id}/${event}`,
            this.connectedPortableDevice?.interfaceList()
        );
    }

    public async _init(device: Device, data?: any): Promise<boolean> {
        const catf = "interfaces/" + this.type + "/" + this.id + "/";
        const cmd = device.vm?.commandRunner;

        if (cmd) {
            cmd.registerCommand(catf + "interfaces/list", (type?: string) =>
                this.connectedPortableDevice
                    ? this.connectedPortableDevice.sockets
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
                    : []
            );
            return true;
        }
        return false;
    }
}
