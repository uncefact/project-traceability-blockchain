import {REMOVE_USER_LOGGED_IN, SET_USER_LOGGED_IN, UserLoggedInActionTypes} from "./actionTypes";
import {User} from "@unece/cotton-fetch";

const initialState: User | null = null;

export function userLoggedInReducer (
    state = initialState,
    action: UserLoggedInActionTypes
): User | null {
    switch(action.type) {
        case SET_USER_LOGGED_IN:
            return action.payload
        case REMOVE_USER_LOGGED_IN:
            return null
        default:
            return state
    }
}
