import {
  VISIBLE_MODAL_EVENT,
  ACTIVE_CELL,
  SET_DATE_TO_PICKER
} from "../types";

export const visibleModalEvent = bool => ({
  type: VISIBLE_MODAL_EVENT,
  payload: bool
});

export const setActiveCell = num => ({
  type: ACTIVE_CELL,
  payload: num
});

export const setDateToPicker = date => ({
  type: SET_DATE_TO_PICKER,
  payload: date
});
