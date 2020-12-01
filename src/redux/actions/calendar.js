import { SET_CURRENT_DATE, GET_ID_EVENT } from "../types";

export function setCurrentDate(date) {
    return {
        type: SET_CURRENT_DATE,
        payload: date
    }
};

export function getIdEvent(id) {
    return {
        type: GET_ID_EVENT,
        payload: id
    }
};
