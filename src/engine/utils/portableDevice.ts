import Device from "./device";
import PortInterface from "./portInterface";

export default abstract class PortableDevice extends Device {
    public connectedPort: PortInterface | null = null;

    abstract onConnect(): void;
    abstract onDisconnect(): void;

    _onConnect(port: PortInterface) {
        this.connectedPort = port;
    }

    _onDisconnect() {
        this.connectedPort = null;
    }
}
