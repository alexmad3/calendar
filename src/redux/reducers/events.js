import { CREATE_EVENT, EDIT_EVENT, REMOVE_EVENT, SET_EVENTS } from "../types";

const initialState = {
    events: [{
        title: 'Встреча',
        date: 1605387600000,
        names: 'Влад, Педро',
        description: 'Четкая встреча',
        id: 1
    }, {
        title: 'Встреча 2',
        date: 1605387500000,
        names: 'Влад, Педро',
        description: 'Четкая встреча 2',
        id: 2
    }]
};

export const events = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_EVENT:
            localStorage.setItem('events', JSON.stringify([...state.events, action.payload]));
            console.log(localStorage.getItem('events'))
            return {...state, events: [...state.events, action.payload]};

        case EDIT_EVENT:
            localStorage.setItem('events', JSON.stringify(state.events.map(event => event.id === action.payload.id ? action.payload : event)));
            return {...state, events: state.events.map(event => event.id === action.payload.id ? action.payload : event) };

        case REMOVE_EVENT:
            localStorage.setItem('events', JSON.stringify(state.events.filter(event => event.id !== action.payload)));
            return {...state, events: state.events.filter(event => event.id !== action.payload) };

        case SET_EVENTS:
            return {...state, events: JSON.parse(localStorage.getItem('events'))};

        default: return state;
    };
};
