import {initLaunchParams, GET_USER_BY_ID, SET_LOADING_FALSE, SET_LOADING_TRUE} from "../actionTypes";
import {act} from "react-dom/test-utils";

const defaultState = {
    params: {},
    user: {},
    loading: false
}

export const launchParamsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case (initLaunchParams): {
            const launchParams = action.payload
            return {...state, params: launchParams}
        } 
        case (GET_USER_BY_ID): {
            console.log('Подгружаю в стейт', action.payload)
            return {...state, user: action.payload}
        }
        case (SET_LOADING_FALSE): {
            return {...state, loading: false}
        }
        case (SET_LOADING_TRUE): {
            return {...state, loading: true}
        }
        default:
            return state
    }
}

export const getUserById = (payload) => ({type: GET_USER_BY_ID, payload})
export const setLoadingTrue = () => ({type: SET_LOADING_TRUE})
export const setLoadingFalse = () => ({type: SET_LOADING_FALSE})