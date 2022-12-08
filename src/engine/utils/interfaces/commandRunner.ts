export interface iCommand {
    async: Boolean;
    fn: Function;
}

export interface iCommandList {
    [key: string]: iCommand;
}

export interface iBufferItem {
    bufferId: number;
    fn: Function;
}
