import { CREATE_EVENT, EDIT_EVENT, REMOVE_EVENT, SET_EVENTS } from "../types";

const initialState = {
  events: {
    1649365200000: {
      title: 'title',
      date: 1649365200000,
      names: 'Влад, Педро',
      description: 'Четкая встреча',
    },
    1649538000000: {
      title: 'Встреча 2',
      date: 1605387500000,
      names: 'Влад, Педро',
      description: 'Четкая встреча 2',
    }
  }
};

export const events = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EVENT:
      localStorage.setItem('events', JSON.stringify({...state.events, [action.payload.date]: action.payload}));
      console.log(localStorage.getItem('events'))
      return { ...state, events: {...state.events, [action.payload.date]: action.payload} };

    case EDIT_EVENT:
      localStorage.setItem('events', JSON.stringify({...state.events, [action.payload.date]: action.payload}));
      return { ...state, events: {...state.events, [action.payload.date]: action.payload} };

    case REMOVE_EVENT:
      let newState = {...state.events};
      delete newState[action.payload];
      localStorage.setItem('events', JSON.stringify(newState));
      return { ...state, events: newState };

    case SET_EVENTS:
      return { ...state, events: (JSON.parse(localStorage.getItem('events')) || {}) };

    default: return state;
  };
};
