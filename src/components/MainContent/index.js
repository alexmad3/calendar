import React from 'react';
import { connect } from 'react-redux';
import { ButtonIcon } from '../../common/ButtonIcon';
import Calendar from '../Calendar';
import Popup from '../../common/Popup';
import { visiblePopup } from '../../redux/actions/popup';
import { setCurrentDate } from '../../redux/actions/calendar';
import styles from './MainContent.module.sass';

class MainContent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentDate: new Date(),
            displayDate: ''
        };
    };

    componentDidMount() {
        this.setDisplayDate();
    };

    setDisplayDate = () => {
        this.props.setCurrentDate(this.state.currentDate);
        let date = new Date(this.state.currentDate);
        this.setState({
            displayDate: `${this.props.months[date.getMonth()]} ${date.getFullYear()}`
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

    onClickCell = isVisible => {
        this.props.visiblePopup(isVisible);
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
                <Calendar
                    date={this.state.currentDate}
                    onClickCell={this.onClickCell}
                />
                <Popup 
                    isVisible={this.props.isVisiblePopup}
                    close={this.onClickCell}
                />
            </div>
        );
    };
}

const state = state => {
    return {
        isVisiblePopup: state.popup.isVisible,
        months: state.calendar.months
    };
};

const dispatch = {
    visiblePopup,
    setCurrentDate
};

export default connect(state, dispatch)(MainContent);
