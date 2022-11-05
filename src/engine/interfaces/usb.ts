import { eProtableDevice } from "../enums";
import PortInterface from "../utils/portInterface";

export default class Usb extends PortInterface {
  connectionTypes: eProtableDevice[] = [eProtableDevice.usbStorage];
}
