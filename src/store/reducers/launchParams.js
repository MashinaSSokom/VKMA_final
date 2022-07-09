import {initLaunchParams} from "../actionTypes";

const defaultState = {
    params: {}
}

export const launchParamsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case (initLaunchParams): {
            const launchParams = action.payload
            return {...state, params: launchParams}
        }

        default:
            return state
    }
}
