import { GameObject } from "oge-ts";

enum dirs {
    RIGHT,
    LEFT,
    TOP,
    DOWN,
}

export default class DVDMovement {
    directionH: dirs = dirs.RIGHT;
    directionV: dirs = dirs.DOWN;
    speed: number;
    obj: GameObject;

    constructor(obj: GameObject, speed: number = 5) {
        this.speed = speed;
        this.obj = obj;
    }

    public updateMovement() {
        if (this.obj.x <= 0) {
            this.directionH = dirs.RIGHT;
        }
        if (this.obj.x >= 800 - 128) {
            this.directionH = dirs.LEFT;
        }
        if (this.obj.y <= 0) {
            this.directionV = dirs.DOWN;
        }
        if (this.obj.y >= 600 - 128) {
            this.directionV = dirs.TOP;
        }
        this.obj.x += this.directionH === dirs.RIGHT ? this.speed : -this.speed;
        this.obj.y += this.directionV === dirs.DOWN ? this.speed : -this.speed;
    }
}
