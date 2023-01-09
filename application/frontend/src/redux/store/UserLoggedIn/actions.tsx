import {REMOVE_USER_LOGGED_IN, SET_USER_LOGGED_IN, UserLoggedInActionTypes} from "./actionTypes";
import {User} from "@unece/cotton-fetch";

export function setUserLoggedIn(user: User): UserLoggedInActionTypes {
    return {
        type: SET_USER_LOGGED_IN,
        payload: user
    }
}

export function removeUserLoggedIn(): UserLoggedInActionTypes {
    return {
        type: REMOVE_USER_LOGGED_IN
    }
}
