import {STOP_LOADING, START_LOADING} from "./actionTypes";

export function startLoading(loadingMessage: string) {
    return {
        type: START_LOADING,
        payload: loadingMessage
    }
}

export function stopLoading() {
    return {
        type: STOP_LOADING,
        payload: null
    }
}