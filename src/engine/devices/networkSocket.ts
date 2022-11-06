import { eConnectableInterface } from "../enums";
import Ethernet from "../interfaces/ethernet";
import Device, { iDevice } from "../utils/device";
import { iInterface } from "../utils/interface";

export default class NetworkSocket extends Device {
  constructor(info: iDevice, intList: iInterface[]) {
    super(info, intList, [
      { id: "eth1", type: eConnectableInterface.ethernet },
    ]);
  }

  private getEthernet(): Ethernet {
    const eth = this.getSocket(eConnectableInterface.ethernet);
    if (eth instanceof Ethernet) {
      return eth;
    } else {
      throw Error("Ethernet port is not exist.");
    }
  }
}
