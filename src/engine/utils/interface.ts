import { eConnectableInterface, eInterface, ePortInterface } from "../enums";
import Socket from "./socket";

export type tInterfaceType =
  | eInterface
  | eConnectableInterface
  | ePortInterface;

export interface iInterface {
  id: string;
  type: tInterfaceType;
  socketId?: string;
  [key: string]: any;
}

export default abstract class Interface implements iInterface {
  protected controller: Socket;
  readonly id;
  readonly type;
  constructor(info: iInterface, controller: Socket) {
    this.controller = controller;
    this.id = info.id;
    this.type = info.type;
  }
}
