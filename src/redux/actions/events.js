import { CREATE_EVENT, EDIT_EVENT, REMOVE_EVENT, SET_EVENTS } from "../types";

export const createEvent = event => ({
  type: CREATE_EVENT,
  payload: event
});

export const editEvent = event => ({
  type: EDIT_EVENT,
  payload: event
});

export const removeEvent = id => ({
  type: REMOVE_EVENT,
  payload: id
});

export const setEvents = events => ({
  type: SET_EVENTS,
  payload: events
});
