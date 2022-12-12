import { GameObject } from "oge-ts";
import { sDecorChair, sDecorTable } from "../sprites";

export enum eDecorType {
    chair,
    table,
}

class Decor extends GameObject {
    constructor(type: eDecorType, x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        let sprite = null;
        switch (type) {
            case eDecorType.chair:
                sprite = sDecorChair;
                break;
            case eDecorType.table:
                sprite = sDecorTable;
                break;
        }
        this.sprite = sprite.createInstance();
    }
}

export default Decor;
