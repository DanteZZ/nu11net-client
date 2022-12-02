type tEventList = {
    [key: string]: Function[];
};

export class EventEmitter {
    private events: tEventList = {};

    constructor() {
        this.events = {};
    }
    on(event: string, listener: Function): Function {
        if (typeof this.events[event] !== "object") {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return () => this.removeListener(event, listener);
    }
    removeListener(event: string, listener: Function): void {
        if (typeof this.events[event] === "object") {
            const idx = this.events[event].indexOf(listener);
            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }
    emit(event: string, data: any | null): void {
        if (typeof this.events[event] === "object") {
            this.events[event].forEach((listener: Function) => {
                listener(data);
            });
        }
    }
    once(event: string, listener: Function): void {
        const remove = this.on(event, (...args: any) => {
            remove();
            listener.call(args);
        });
    }
}

const eventEmitter = new EventEmitter();
export default eventEmitter;
