import { CREATE_EVENT, EDIT_EVENT, REMOVE_EVENT, SET_EVENTS } from "../types";

export function createEvent(event) {
    return {
        type: CREATE_EVENT,
        payload: event
    }
};

export function editEvent(event) {
    return {
        type: EDIT_EVENT,
        payload: event
    }
};

export function removeEvent(id) {
    return {
        type: REMOVE_EVENT,
        payload: id
    }
};

export function setEvents(events) {
    return {
        type: SET_EVENTS,
        payload: events
    }
};
