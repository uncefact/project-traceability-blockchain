import {REMOVE_USER_LOGGED_IN, SET_USER_LOGGED_IN, UserLoggedInActionTypes} from "./actionTypes";
import {userLoggedInReducer} from "./reducers";

describe('Reducers tests', () => {
    it('Set logged in user test', () => {
        const action: UserLoggedInActionTypes = {
            type: SET_USER_LOGGED_IN,
            payload: {
                firstname: 'firstnameTest',
            }
        }
        expect(userLoggedInReducer(null, action)).toEqual(action.payload);
    });
    it('Remove logged in user test', () => {
        const action: UserLoggedInActionTypes = {
            type: REMOVE_USER_LOGGED_IN
        }
        expect(userLoggedInReducer(null, action)).toEqual(null);
    });
});
