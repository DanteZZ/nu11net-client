import {
  eDevice,
  eConnectableInterface,
  eProtableDevice,
  eInterface,
  ePortInterface,
} from "../enums";

import Interface, { iInterface } from "./interface";

import Display from "../interfaces/display";
import Ethernet from "../interfaces/ethernet";
import Input from "../interfaces/input";
import Storage from "../interfaces/storage";
import Usb from "../interfaces/usb";

export interface iDevice {
  id: string;
  type: eDevice | eProtableDevice;
  [key: string]: any;
}

export default abstract class Device implements iDevice {
  readonly id;
  readonly type;
  readonly interfaces: Interface[] = [];
  constructor(info: iDevice, intList: iInterface[]) {
    this.id = info.id;
    this.type = info.type;

    intList.forEach((i) => {
      switch (i.type) {
        // Default
        case eInterface.display:
          this.addInterface(new Display(i, this));
          break;
        case eInterface.input:
          this.addInterface(new Input(i, this));
          break;
        case eInterface.storage:
          this.addInterface(new Storage(i, this));
          break;
        // Connectable
        case eConnectableInterface.ethernet:
          this.addInterface(new Ethernet(i, this));
          break;
        // Port
        case ePortInterface.usb:
          this.addInterface(new Usb(i, this));
          break;
      }
    });
  }

  private addInterface(i: Interface) {
    this.interfaces.push(i);
  }

  public getInterfacesByType(
    type: eInterface | eConnectableInterface | ePortInterface
  ): Interface[] {
    return this.interfaces.filter((i) => i.type === type);
  }
}
