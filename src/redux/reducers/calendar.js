import {SET_CURRENT_DATE} from '../types';

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
    currentDate: null
};

export const calendar = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_DATE:
            return {...state, currentDate: action.payload};
        default: return state;
    };
};
