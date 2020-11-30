import { VISIBLE_POPUP, ACTIVE_CELL, POSITION_POPUP } from "../types";

export function visiblePopup(bool) {
    return {
        type: VISIBLE_POPUP,
        payload: bool
    }
};

export function setActiveCell(num) {
    return {
        type: ACTIVE_CELL,
        payload: num
    }
};

export function setPositionPopup(pos) {
    return {
        type: POSITION_POPUP,
        payload: pos
    }
};
