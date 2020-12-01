import {SET_CURRENT_DATE, GET_ID_EVENT} from '../types';

const initialState = {
    months: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ],
    currentDate: null,
    idEvent: null
};

export const calendar = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_DATE:
            return {...state, currentDate: action.payload};

        case GET_ID_EVENT:
            return {...state, idEvent: action.payload};

        default: return state;
    };
};
