import { combineReducers } from "redux";
import { events } from "./reducers/events";
import { modalEvent } from "./reducers/modalEvent";
import { calendar } from './reducers/calendar';

export const rootReducer = combineReducers({
  events,
  modalEvent,
  calendar
});
