import { VISIBLE_POPUP, ACTIVE_CELL, POSITION_POPUP, SET_DATE_TO_PICKER } from "../types";

export const visiblePopup = bool => ({
  type: VISIBLE_POPUP,
  payload: bool
});

export const setActiveCell = num => ({
  type: ACTIVE_CELL,
  payload: num
});

export const setPositionPopup = pos => ({
  type: POSITION_POPUP,
  payload: pos
});

export const setDateToPicker = date => ({
  type: SET_DATE_TO_PICKER,
  payload: date
});
