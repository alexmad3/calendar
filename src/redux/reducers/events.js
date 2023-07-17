import {
  CREATE_EVENT,
  EDIT_EVENT,
  REMOVE_EVENT,
  GET_EVENTS
} from "../types";

const initialState = {
  events: [
    {
      title: 'title',
      date: 1649365200000,
      names: 'Влад, Педро',
      description: 'Четкая встреча',
    },
    {
      title: 'Встреча 2',
      date: 1605387500000,
      names: 'Влад, Педро',
      description: 'Четкая встреча 2',
    }
  ]
};

export const events = (state = initialState, action) => {
  const newStateEvents = [...state.events];

  switch (action.type) {
    case CREATE_EVENT:
      localStorage.setItem('events',
        JSON.stringify([...state.events, action.payload]));
      return { ...state, events: [...state.events, action.payload] };

    case EDIT_EVENT:
      newStateEvents.splice(newStateEvents.findIndex(event => event.date === action.payload.date), 1, action.payload);
      localStorage.setItem('events', JSON.stringify(newStateEvents));
      return { ...state, events: newStateEvents };

    case REMOVE_EVENT:
      newStateEvents.splice(newStateEvents.findIndex(event => event.date === action.payload), 1);
      localStorage.setItem('events', JSON.stringify(newStateEvents));
      return { ...state, events: newStateEvents };

    case GET_EVENTS:
      return { ...state, events: (JSON.parse(localStorage.getItem('events')) || []) };

    default:
      return state;
  };
};
