import {LoadingActionTypes, START_LOADING, STOP_LOADING} from "./actionTypes";
import {loadingReducer} from "./reducers";

describe("Loading reducers test", () => {
    it("Start Loading test", () => {
        const action: LoadingActionTypes = {
            type: START_LOADING,
            payload: 'loadingMessageTest'
        }
        expect(loadingReducer({
            show: false,
            text: null
        }, action)).toEqual({
            show: true,
            text: 'loadingMessageTest'
        });
    });
    it("Stop Loading test", () => {
        const action: LoadingActionTypes = {
            type: STOP_LOADING,
            payload: null
        }
        expect(loadingReducer({
            show: true,
            text: 'loadingMessageTest'
        }, action)).toEqual({
            show: false,
            text: null
        });
    });
    it("Default test", () => {
        const action: LoadingActionTypes = {// @ts-ignore
            type: 'Other',
            payload: null
        }
        expect(loadingReducer({
            show: true,
            text: 'loadingMessageTest'
        }, action)).toEqual({
            show: true,
            text: 'loadingMessageTest'
        });
    });
});