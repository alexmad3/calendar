import { combineReducers } from "redux";
import { events } from "./reducers/events";
import { popup } from "./reducers/popup";
import { calendar } from './reducers/calendar';

export const rootReducer = combineReducers({
  events,
  popup,
  calendar
});
