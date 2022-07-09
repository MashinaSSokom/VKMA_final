import { combineReducers } from "redux";
import {launchParamsReducer} from "./launchParams";

export default combineReducers({ launchParams: launchParamsReducer });
