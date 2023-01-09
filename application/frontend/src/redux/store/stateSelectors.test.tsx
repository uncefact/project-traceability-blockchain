import {RootState} from "./index";
import {selectUserLoggedIn} from "./stateSelectors";

describe('State Selectors tests', () => {
    it('selectUserLoggedIn test', () => {
        // @ts-ignore
        const state: RootState = {
            userLoggedIn: {
                firstname: 'firstnameTest',
            }
        }
        expect(selectUserLoggedIn(state)).toEqual(state.userLoggedIn);
    });
});
