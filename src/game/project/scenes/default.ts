import { Camera, Scene, Canvas, Input } from "oge-ts";
import { Devices } from "../../../utils/common";
import { aBgRoom } from "../assets";
import Cursor from "../objects/cursor";
import Decor, { eDecorType } from "../objects/decor";
import DeviceObject from "../objects/device";
import Player from "../objects/player";

class _DefaultScene extends Scene {
  private mainCamera?: Camera;

  public width: number = 2881;
  public height: number = 1620;
  public deviceObjects: DeviceObject[] = [];

  public init(): void {
    const cursor = new Cursor();
    this.instances.addInstances([
      cursor,
      Player,
      new Decor(eDecorType.table, 555, 1058),
      new Decor(eDecorType.chair, 840, 1020),
    ]);

    this.mainCamera = new Camera(this);
    this.mainCamera.offset = 20;

    this.mainCamera.setTrackInstance(cursor);

    this.setCamera(this.mainCamera);
    this.spawnDevices();
    this.getCanvas().scale = 1.5;

    this.initZoom();
  }

  initZoom() {
    document.addEventListener("mousewheel", (event) => {
      const delta = (<WheelEvent>event).deltaY;
      const canvas = this.getCanvas();
      if (canvas) {
        const prevScale = canvas.scale;
        canvas.scale += delta > 0 ? -0.2 : 0.2;
        if (canvas.scale > 2.5) {
          canvas.scale = 2.5;
        }
        if (canvas.scale < 0.5) {
          canvas.scale = 0.75;
        }
        // if (prevScale !== canvas.scale && this.mainCamera) {
        //   this.mainCamera.offset = undefined;
        //   setTimeout(() => {
        //     if (this.mainCamera) {
        //       this.mainCamera.offset = 20;
        //     }
        //   }, 10);
        // }
      }
    });
  }

  public spawnDevices() {
    this.deviceObjects = Devices.map(
      (d) =>
        new DeviceObject(d, d.type, d?.position?.x || 0, d?.position?.y || 0)
    );
    this.instances.addInstances(this.deviceObjects);
  }

  public update(): void {}

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
