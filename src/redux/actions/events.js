import { CREATE_EVENT, EDIT_EVENT, REMOVE_EVENT, GET_EVENTS } from "../types";

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

export const getEvents = events => ({
  type: GET_EVENTS,
  payload: events
});
