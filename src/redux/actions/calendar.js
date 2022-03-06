import { SET_CURRENT_DATE, GET_ID_EVENT } from "../types";

export const setCurrentDate = date => ({
  type: SET_CURRENT_DATE,
  payload: date
});

export const getIdEvent = id => ({
  type: GET_ID_EVENT,
  payload: id
});
