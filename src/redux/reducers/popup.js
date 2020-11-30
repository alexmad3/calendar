import { ACTIVE_CELL, POSITION_POPUP, VISIBLE_POPUP } from "../types";

const initialState = {
    isVisible: false,
    activeCell: null,
    position: {
        wrapperTop: 0,
        wrapperLeft: 0,
        horizontalDirection: 'left',
        verticalDirection: 'top'
    }
};

export const popup = (state = initialState, action) => {
    switch (action.type) {
        case VISIBLE_POPUP:
            return {...state, isVisible: action.payload};

        case ACTIVE_CELL:
            return {...state, activeCell: action.payload};

        case POSITION_POPUP:
            return {...state, position: {...action.payload}};

        default: return state;
    };
};
