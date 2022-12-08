export interface iVmEvMessage {
    data: iVmMessage;
}

export interface iVmMessage {
    pid: string;
    payload: tVmMessageCommand | tVmMessageEvent | tVmMessageResponse;
}

export type tVmMessageCommand = {
    command: string;
    data?: any;
    bufferId?: number;
};

export type tVmMessageEvent = {
    event: string;
    data?: any;
    bufferId?: number;
};

export type tVmMessageResponse = {
    response: Boolean;
    data?: any;
    bufferId: number;
};
