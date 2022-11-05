import { eDevice, eProtableDevice } from "../enums";
import Device from "./device";
import Interface from "./interface";
import PortableDevice from "./portableDevice";

export default abstract class PortInterface extends Interface {
  abstract readonly connectionTypes: eProtableDevice[];
  private connectedPortableDevice: PortableDevice | null = null;

  public getDevice(): Device {
    return this.controller;
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
      return true;
    }
    return false;
  }
  public disconnect(): void {
    if (this.connectedPortableDevice) {
      this.connectedPortableDevice._onDisconnect();
      this.connectedPortableDevice.onDisconnect();
    }
  }
}
