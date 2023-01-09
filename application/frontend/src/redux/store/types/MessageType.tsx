export const MESSAGE_TYPE_SUCCESS = "MESSAGE_TYPE_SUCCESS";
export const MESSAGE_TYPE_ERROR = "MESSAGE_TYPE_ERROR";

interface MT {
    text: string,
    type: typeof MESSAGE_TYPE_ERROR | typeof MESSAGE_TYPE_SUCCESS
}

export type MsgType = MT;

