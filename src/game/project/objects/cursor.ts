import { Canvas, eColliderType, GameObject, Input } from "oge-ts";

class Cursor extends GameObject {
  name = "cursor";
  create(): void {
    this.createCollider({
      type: eColliderType.circle,
      radius: 2,
      offsetX: -1,
      offsetY: -1,
    });
  }
  update() {
    const canvas = this.getBuffer().app?.sceneBuffer.getCanvas();
    if (canvas) {
      this.x = Math.ceil(
        Input.inputBuffer.mouseX / canvas.scale + canvas?.offsetX
      );
      this.y = Math.ceil(
        Input.inputBuffer.mouseY / canvas.scale + canvas?.offsetY
      );
    }
  }
}

export default Cursor;
