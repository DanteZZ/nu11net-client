import { eConnectionType } from "../enums";
import ConnectableInterface from "../utils/connectableInterface";

export default class Ethernet extends ConnectableInterface {
  connectionTypes: eConnectionType[] = [eConnectionType.twistedPair];
}
