import {MsgType} from "../types/MessageType";

export const SET_MESSAGES = "SET_MESSAGES";
export const REMOVE_MESSAGE = "REMOVE_MESSAGE";
export const ADD_MESSAGE = "ADD_MESSAGE";

interface SetMessagesAction {
    type: typeof SET_MESSAGES,
    payload: MsgType[]
}

interface AddMessageAction {
    type: typeof ADD_MESSAGE,
    payload: MsgType
}

interface RemoveMessageAction {
    type: typeof REMOVE_MESSAGE
}

export type MessagesActionTypes = SetMessagesAction | AddMessageAction | RemoveMessageAction;