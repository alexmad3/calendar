import React from 'react';
import { CalendarCell } from '../../common/CalendarCell';
import styles from './Calendar.module.sass';

class Calendar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            monthData: [],
            displayCell: []
        };

        this.days = [
            'Воскресенье, ',
            'Понедельник, ',
            'Вторник, ',
            'Среда, ',
            'Четверг, ',
            'Пятница, ',
            'Суббота, '
        ];
    };

    componentDidMount() {
        this.calendarCalculation();
    };

    componentDidUpdate(prevProps) {
        if (prevProps.date !== this.props.date) {
            this.calendarCalculation();
        }
    }

    calendarCalculation = () => {
        let firstDay = new Date(new Date(this.props.date).setDate(1)).getDay(),
            year = new Date(this.props.date).getFullYear(),
            month = new Date(this.props.date).getMonth(),
            monthData = [],
            lastDate;

        if (firstDay === 0) {
            firstDay = 7;
        }

        for (let i = firstDay; i > 1; i--) {
            monthData.push(new Date(new Date(year, month, (i * (-1)) + 2 )));
        }

        for (let i = 1; i <= 31; i++) {
            if (i > 28 && (new Date(new Date(year, month, i)).getMonth() !== month)) {
                lastDate = i - 1;
                break;
            } else {
                lastDate = i;
                monthData.push(new Date(new Date(year, month, i)));
            }
        }

        if (new Date(year, month, lastDate).getDay() !== 0) {
            for (let i = 1; i <= 7 - new Date(year, month, lastDate).getDay(); i++) {
                monthData.push(new Date(new Date(year, month + 1, i)));
            }
        }

        this.setState({displayCell: monthData});
    };

    render() {
        return(
            <div className={styles.calendar}>
                {
                    this.state.displayCell.map((el, i) => {
                        if (i < 7) {
                            return <CalendarCell day={`${this.days[new Date(el).getDay()]} ${new Date(el).getDate()}`} key={i} />
                        } else {
                            return <CalendarCell day={new Date(el).getDate()} key={i} />
                        }
                    })
                }
            </div>
        );
    };
};

export default Calendar;
