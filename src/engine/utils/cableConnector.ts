import { iUserCableConnection } from "../../utils/userInfo";
import { eConnectionType } from "../enums";
import ConnectableInterface from "./connectableInterface";
import Device from "./device";

export interface iCable {
    id: string;
    type: eConnectionType;
    [key: string]: any;
}

export interface iCableConnection {
    info: iUserCableConnection;
    cable: Cable;
    connection: [ConnectableInterface, ConnectableInterface];
}

export class CableConnector {
    public connections: iCableConnection[] = [];
    public cables: Cable[] = [];
    public devices: Device[] = [];

    public setDeviceList(devices: Device[]) {
        this.devices = devices;
    }

    public setConnections(connections: iUserCableConnection[]) {
        connections.forEach((con) => {
            const cable = this.cables.find((c) => c.id === con.cable);
            if (cable) {
                const [[d1, s1], [d2, s2]] = con.connection;
                try {
                    const int1 = this.devices
                        .find((d) => d.id === d1)
                        ?.socket(s1)
                        ?.get();
                    const int2 = this.devices
                        .find((d) => d.id === d2)
                        ?.socket(s2)
                        ?.get();
                    if (
                        int1 instanceof ConnectableInterface &&
                        int2 instanceof ConnectableInterface
                    ) {
                        this.connections.push({
                            info: con,
                            cable,
                            connection: [int1, int2],
                        });
                    }
                } catch (e) {
                    console.error(e);
                    return;
                }
            }
        });
    }

    public updateConnections() {
        this.connections.forEach((c) => {
            const [i1, i2] = c.connection;
            if (
                i1.canConnect([c.cable.type]) &&
                i2.canConnect([c.cable.type])
            ) {
                i1.connect(i2);
            }
        });
    }

    public addCable(info: iCable): Cable {
        const cable = new Cable(info);
        this.cables.push(cable);
        return cable;
    }
}

export class Cable {
    readonly type: eConnectionType;
    readonly id: string;
    constructor(info: iCable) {
        this.type = info.type;
        this.id = info.id;
    }
}

const cableConnector = new CableConnector();
export default cableConnector;
