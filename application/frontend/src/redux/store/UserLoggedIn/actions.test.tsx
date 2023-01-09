import {removeUserLoggedIn, setUserLoggedIn} from "./actions";
import {REMOVE_USER_LOGGED_IN, SET_USER_LOGGED_IN} from "./actionTypes";
import {User} from "@unece/cotton-fetch";

describe('Actions tests', () => {
    it('setUserLoggedIn test', () => {
        const user: User = {
            firstname: 'firstNameTest'
        }
        expect(setUserLoggedIn(user)).toEqual({
            type: SET_USER_LOGGED_IN,
            payload: user
        });
    });
    it('removeUserLoggedIn test', () => {
        expect(removeUserLoggedIn()).toEqual({
            type: REMOVE_USER_LOGGED_IN,
        });
    });
});
