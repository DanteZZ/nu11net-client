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
      this.x = Input.inputBuffer.mouseX + canvas?.offsetX;
      this.y = Input.inputBuffer.mouseY + canvas?.offsetY;
    }
  }
}

export default Cursor;
