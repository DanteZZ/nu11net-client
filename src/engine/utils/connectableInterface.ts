import { eConnectionType } from "../enums";
import Interface from "./interface";

export default abstract class ConnectableInterface extends Interface {
  abstract readonly connectionTypes: eConnectionType[];
  private connectedInterface: ConnectableInterface | null = null;

  public connectedTo() {
    return this.connectedInterface;
  }
  public isConnected(): Boolean {
    return !!this.connectedInterface;
  }

  public canConnect(a: eConnectionType[], b: eConnectionType[]): Boolean {
    return a.reduce((p, c) => p || b.includes(c), false);
  }

  public connect(cInt: ConnectableInterface): boolean {
    if (this.canConnect(cInt.connectionTypes, this.connectionTypes)) {
      this.connectedInterface = cInt;
      this.connectedInterface._connect(this);
      return true;
    }
    return false;
  }
  public disconnect(): void {
    if (this.connectedInterface) {
      this.connectedInterface._disconnect();
    }
  }

  public _connect(cInt: ConnectableInterface): void {
    this.connectedInterface = cInt;
  }
  public _disconnect(): void {
    this.connectedInterface = null;
  }
}
