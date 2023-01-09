import {ADD_MESSAGE, REMOVE_MESSAGE, SET_MESSAGES} from "./actionTypes";
import {MESSAGE_TYPE_ERROR, MESSAGE_TYPE_SUCCESS, MsgType} from "../types/MessageType";

export function setMessages(messages: MsgType[]) {
    return {
        type: SET_MESSAGES,
        payload: messages
    }
}

export function addSuccessMessage(message: string) {
    // @ts-ignore
    return dispatch => {
        dispatch({
            type: ADD_MESSAGE,
            payload: {
                text: message,
                type: MESSAGE_TYPE_SUCCESS
            }
        });
        setTimeout(() => dispatch(removeMessage()), 5000);
    }
}

export function addErrorMessage(message: string) {
    // @ts-ignore
    return dispatch => {
        dispatch({
            type: ADD_MESSAGE,
            payload: {
                text: message,
                type: MESSAGE_TYPE_ERROR
            }
        });
        setTimeout(() => dispatch(removeMessage()), 5000);
    }
}

export function removeMessage() {
    return {
        type: REMOVE_MESSAGE
    }
}