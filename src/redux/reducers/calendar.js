import { SELECTED_DATE } from '../types';

const initialState = {
  selectedDate: new Date()
};

export const calendar = (state = initialState, action) => {
  switch (action.type) {
    case SELECTED_DATE:
      return { ...state, selectedDate: action.payload };

    default:
      return state;
  };
};
