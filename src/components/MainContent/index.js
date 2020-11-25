import React from 'react';
import { ButtonIcon } from '../../common/ButtonIcon';
import Calendar from '../Calendar';
import styles from './MainContent.module.sass';

class MainContent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentDate: new Date(),
            displayDate: ''
        };
        this.months = [
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
        ];
    };

    componentDidMount() {
        this.setDisplayDate();
    };

    setDisplayDate = () => {
        let date = new Date(this.state.currentDate);
        this.setState({
            displayDate: `${this.months[date.getMonth()]} ${date.getFullYear()}`
        });
    };

    changeMonth = (sign) => {
        let date = new Date(this.state.currentDate);
        if (sign === '+') {
            this.setState({currentDate: date.setMonth(date.getMonth() + 1)}, () => this.setDisplayDate());
        } else {
            this.setState({currentDate: date.setMonth(date.getMonth() - 1)}, () => this.setDisplayDate());
        }
    };

    currentMonth = () => {
        this.setState({currentDate: new Date()}, () => this.setDisplayDate());
    };

    render() {
        return(
            <div className={styles.container}>
                <div className={styles.wrapperNavigation}>
                    <ButtonIcon icon='fa fa-caret-left' onClick={() => this.changeMonth('-')} />
                    <span className={styles.date}>{this.state.displayDate}</span>
                    <ButtonIcon icon='fa fa-caret-right' onClick={() => this.changeMonth('+')} />
                    <ButtonIcon text='Сегодня' onClick={this.currentMonth} />
                </div>
                <Calendar date={this.state.currentDate} />
            </div>
        );
    };
}

export default MainContent;
