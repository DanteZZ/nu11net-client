import { eConnectableInterface, eInterface, ePortInterface } from "../enums";
import Device from "./device";

export interface iInterface {
  id: string;
  type: eInterface | eConnectableInterface | ePortInterface;
  [key: string]: any;
}

export default abstract class Interface implements iInterface {
  protected controller: Device;
  readonly id;
  readonly type;
  constructor(info: iInterface, controller: Device) {
    this.controller = controller;
    this.id = info.id;
    this.type = info.type;
  }
}
