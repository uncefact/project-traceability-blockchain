import {ADD_MESSAGE, MessagesActionTypes, REMOVE_MESSAGE, SET_MESSAGES} from "./actionTypes";
import {MsgType} from "../types/MessageType";

const initialState: MsgType[] | null = null;

export function messagesReducer(
    state = initialState,
    action: MessagesActionTypes
): MsgType[] | null {
    switch (action.type) {
        case SET_MESSAGES:
            return action.payload;
        case ADD_MESSAGE:
            if (state)
                return [...state, action.payload];
            else
                return [action.payload];
        case REMOVE_MESSAGE:
            let newState;
            if (state) {
                newState = [...state];
                newState.shift();
                return newState;
            }
            else {
                return state;
            }
        default:
            return state;
    }
}
