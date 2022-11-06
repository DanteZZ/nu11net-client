import Device from "./device";
import Interface, { tInterfaceType } from "./interface";

export interface iSocket {
  id: string;
  type: tInterfaceType;
  [key: string]: any;
}

export default class Socket {
  protected interface: Interface | null = null;
  readonly device: Device;
  readonly type: tInterfaceType;
  readonly id: string;
  constructor(id: string, type: tInterfaceType, device: Device) {
    this.type = type;
    this.id = id;
    this.device = device;
  }

  public get(): Interface | null {
    return this.interface;
  }

  public set(interf: Interface | null = null): void {
    if (interf && interf.type == this.type) {
      this.interface = interf;
    }
  }
}
