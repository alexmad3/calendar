import { combineReducers } from "redux";
import { events } from "./reducers/events";
import { popup } from "./reducers/popup";

export const rootReducer = combineReducers({
    events,
    popup
});
