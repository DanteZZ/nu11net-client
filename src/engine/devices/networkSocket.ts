import { eConnectableInterface } from "../enums";
import Ethernet from "../interfaces/ethernet";
import Device from "../utils/device";

export default class NetworkSocket extends Device {
  private getEthernet(): Ethernet {
    const [eth] = this.getInterfacesByType(eConnectableInterface.ethernet);
    if (eth instanceof Ethernet) {
      return eth;
    } else {
      throw Error("Ethernet port not exist");
    }
  }
}
