import {User} from "@unece/cotton-fetch";

export const SET_USER_LOGGED_IN = 'SET_USER_LOGGED_IN';
export const REMOVE_USER_LOGGED_IN = 'REMOVE_USER_LOGGED_IN';

interface SetUserLoggedInAction {
    type: typeof SET_USER_LOGGED_IN,
    payload: User
}

interface RemoveUserLoggedInAction {
    type: typeof REMOVE_USER_LOGGED_IN
}

export type UserLoggedInActionTypes = SetUserLoggedInAction | RemoveUserLoggedInAction;
