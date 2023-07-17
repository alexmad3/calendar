import {
  ACTIVE_CELL,
  VISIBLE_MODAL_EVENT,
  SET_DATE_TO_PICKER
} from "../types";

const initialState = {
  isVisible: false,
  activeCell: null,
  dateToPicker: null
};

export const modalEvent = (state = initialState, action) => {
  switch (action.type) {
    case VISIBLE_MODAL_EVENT:
      return { ...state, isVisible: action.payload };

    case ACTIVE_CELL:
      return { ...state, activeCell: action.payload };

    case SET_DATE_TO_PICKER:
      return { ...state, dateToPicker: action.payload};

    default:
      return state;
  };
};
