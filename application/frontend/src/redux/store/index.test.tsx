import {createStore} from "redux";
import {rootReducer} from "./index";

describe('Root Reducer test', () => {
    it('Create store without crashing', () => {
        createStore(rootReducer);
    });
});
