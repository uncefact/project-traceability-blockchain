import {LoadingType} from "../types/LoadingType";
import {STOP_LOADING, LoadingActionTypes, START_LOADING} from "./actionTypes";

const initialState: LoadingType = {
    show: false,
    text: null
};

export function loadingReducer(
    state = initialState,
    action: LoadingActionTypes
): LoadingType {
    switch(action.type) {
        case START_LOADING:
            return ({
                show: true,
                text: action.payload
            })
        case STOP_LOADING:
            return ({
                show: false,
                text: action.payload
            })
        default:
            return state;
    }
}