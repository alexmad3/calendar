import { VISIBLE_POPUP, ACTIVE_CELL, POSITION_POPUP } from "../types";

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
