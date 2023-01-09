import {startLoading, stopLoading} from "./actions";
import {START_LOADING, STOP_LOADING} from "./actionTypes";

describe("Loading actions test", () => {
    it("startLoading test", () => {
        expect(startLoading('loadingMessageTest')).toEqual({
            type: START_LOADING,
            payload: 'loadingMessageTest'
        })
    });
    it("stopLoading test", () => {
        expect(stopLoading()).toEqual({
            type: STOP_LOADING,
            payload: null
        })
    });
});