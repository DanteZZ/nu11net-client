import { Camera, Scene, Canvas } from "oge-ts";
import { Devices } from "../../../utils/common";
import { aBgRoom } from "../assets";
import Decor, { eDecorType } from "../objects/decor";
import DeviceObject from "../objects/device";
import Player from "../objects/player";

class _DefaultScene extends Scene {
    private mainCamera?: Camera;

    public width: number = 2881;
    public height: number = 1620;
    public deviceObjects: DeviceObject[] = [];

    public init(): void {
        this.instances.addInstances([
            Player,
            new Decor(eDecorType.table, 555, 1058),
            new Decor(eDecorType.chair, 840, 1020),
        ]);

        this.mainCamera = new Camera(this);
        this.mainCamera.setTrackInstance(Player);

        this.setCamera(this.mainCamera);
        this.spawnDevices();
    }

    public spawnDevices() {
        this.deviceObjects = Devices.map(
            (d) =>
                new DeviceObject(
                    d,
                    d.type,
                    d?.position?.x || 0,
                    d?.position?.y || 0
                )
        );
        this.instances.addInstances(this.deviceObjects);
    }

    public draw(canvas: Canvas): void {
        // canvas.drawRect(600, 0, 600, 600, {
        //     fillStyle: this.background,
        //     stroked: true,
        // });
        // canvas.drawText("Hello World", 100, 100, {
        //     font: "24px serif",
        //     strokeStyle: this.background,
        //     fixed: true,
        //     strokeOnly: true,
        // });
        canvas.drawAsset({
            asset: aBgRoom,
            x: 0,
            y: 0,
        });
    }
}

const DefaultScene = new _DefaultScene();
export default DefaultScene;
