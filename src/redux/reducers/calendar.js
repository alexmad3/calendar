import { SET_CURRENT_DATE, GET_ID_EVENT } from '../types';

const initialState = {
  selectedDate: new Date(),
  idEvent: null
};

export const calendar = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_DATE:
      return { ...state, selectedDate: action.payload };

    case GET_ID_EVENT:
      return { ...state, idEvent: action.payload };

    default: return state;
  };
};
