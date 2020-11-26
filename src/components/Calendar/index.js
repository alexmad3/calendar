import React from 'react';
import {connect} from 'react-redux';
import { CalendarCell } from '../../common/CalendarCell';
import styles from './Calendar.module.sass';

class Calendar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            monthData: [],
            displayCell: [],
            activeCell: null
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
            this.setState({activeCell: null});
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

        prevDays:
        for (let i = firstDay; i > 1; i--) {
            for (let j = 0; j < this.props.events.length; j++) {
                if (new Date(year, month, (i * (-1)) + 2 ).setHours(0, 0, 0, 0) === new Date(this.props.events[j].date).setHours(0, 0, 0, 0)) {
                    monthData.push({
                        date: new Date(new Date(year, month, (i * (-1)) + 2 )),
                        title: this.props.events[j].title,
                        names: this.props.events[j].names
                    });
                    continue prevDays;
                }
            }
            monthData.push({date: new Date(new Date(year, month, (i * (-1)) + 2 ))});
        }

        presDays:
        for (let i = 1; i <= 31; i++) {
            if (i > 28 && (new Date(new Date(year, month, i)).getMonth() !== month)) {
                lastDate = i - 1;
                break;
            } else {
                lastDate = i;
                for (let j = 0; j < this.props.events.length; j++) {
                    if (new Date(year, month, i).setHours(0, 0, 0, 0) === new Date(this.props.events[j].date).setHours(0, 0, 0, 0)) {
                        monthData.push({
                            date: new Date(new Date(year, month, i)),
                            title: this.props.events[j].title,
                            names: this.props.events[j].names
                        });
                        continue presDays;
                    }
                }
                monthData.push({date: new Date(new Date(year, month, i))});
            }
        }

        if (new Date(year, month, lastDate).getDay() !== 0) {
            futDays:
            for (let i = 1; i <= 7 - new Date(year, month, lastDate).getDay(); i++) {
                for (let j = 0; j < this.props.events.length; j++) {
                    if (new Date(year, month + 1, i).setHours(0, 0, 0, 0) === new Date(this.props.events[j].date).setHours(0, 0, 0, 0)) {
                        monthData.push({
                            date: new Date(new Date(year, month + 1, i)),
                            title: this.props.events[j].title,
                            names: this.props.events[j].names
                        });
                        continue futDays;
                    }
                }
                monthData.push({date: new Date(new Date(year, month + 1, i))});
            }
        }

        this.setState({displayCell: monthData});
    };

    onActiveCell = activeCell => {
        this.setState({activeCell});
    };

    render() {
        return(
            <div className={styles.calendar}>
                {
                    this.state.displayCell.map((el, i) => {
                        if (i < 7) {
                            return <CalendarCell
                                        day={`${this.days[new Date(el.date).getDay()]} ${new Date(el.date).getDate()}`}
                                        title={el.title}
                                        names={el.names}
                                        id={+el.date}
                                        activeCell={this.state.activeCell}
                                        onActive={this.onActiveCell}
                                        key={i} 
                                    />
                        } else {
                            return <CalendarCell
                                        day={new Date(el.date).getDate()}
                                        title={el.title}
                                        names={el.names}
                                        id={+el.date}
                                        activeCell={this.state.activeCell}
                                        onActive={this.onActiveCell}
                                        key={i}
                                    />
                        }
                    })
                }
            </div>
        );
    };
};

const mapStateToProps = state => {
    return {
        events: state.events.events
    };
};

export default connect(mapStateToProps, null)(Calendar);
