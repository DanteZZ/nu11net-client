import { GameObject, Input } from "oge-ts";

export default (distance: number, obj: GameObject) => {
    if (Input.onKeyHold(65)) {
        obj.x -= distance;
    }

    if (Input.onKeyHold(68)) {
        obj.x += distance;
    }
};
