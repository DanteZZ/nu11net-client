import { GameObject } from "oge-ts";
import app from "../../app";
import movement from "../scripts/movement";

class PlayerObject extends GameObject {
    speed: number = 200;
    x = 1000;
    y = 982;
    constructor() {
        super();
    }
    update() {
        movement(Math.ceil(this.speed * app.deltaTime * 10), this);
    }
}

const Player = new PlayerObject();
export default Player;
