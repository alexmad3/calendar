import { combineReducers } from "redux";
import { eventsReducers } from "./eventsReducer";

export const rootReducer = combineReducers({
    events: eventsReducers
});
