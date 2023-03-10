export const START_LOADING = 'START_LOADING';
export const STOP_LOADING = 'STOP_LOADING';

interface StartLoadingAction {
    type: typeof START_LOADING,
    payload: string
}

interface EndLoadingAction {
    type: typeof STOP_LOADING
    payload: null
}

export type LoadingActionTypes = StartLoadingAction | EndLoadingAction;