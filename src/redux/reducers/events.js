import { CREATE_EVENT } from "../types";

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
            return {...state, events: [...state.events, action.payload]};
        default: return state;
    };
};
