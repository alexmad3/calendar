import React from 'react';
import { connect } from 'react-redux';
import { createEvent } from '../../redux/actions/events';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Input } from '../../common/Input';
import styles from './ShortPopup.module.sass';

class ShortPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: ''
        };
    };

    onChange = (name, value) => {
        this.setState({[name]: value});
    };

    createEvent = () => {
        let id = 0, date = this.state.event.slice(this.state.event.indexOf(',') + 1);
        console.log(date)
        while (date[0] === ' ') {
            date = date.slice(1);
        }

        this.props.events.forEach(event => {
            if (event.id > id) {
                id = event.id
            }
        });

        console.log(this.state.event.slice(this.state.event.indexOf(',') + 1))
        this.props.createEvent({
            id: id + 1,
            title: this.state.event.slice(0, this.state.event.indexOf(',')),
            date: this.parseDate(date),
            names: '',
            description: '',
        });
    };

    parseDate = date => {
        let parseDate;
        if (date.indexOf(',') > 0) {
            parseDate = this.calculateDate(date.split(','));
        } else if (date.indexOf('.') > 0) {
            parseDate = this.calculateDate(date.split('.'));
        } else {
            parseDate = this.calculateDate(date.split(' '));
        }

        console.log(parseDate)

        return +parseDate;
    };

    calculateDate = parseDate => {
        if (isNaN(parseDate[1]) && parseDate[1]) {
            for (let i = 0; i < this.props.months.length; i++) {
                if (
                    (this.props.months[i].toLowerCase() === parseDate[1].toLowerCase().trim()) ||
                    (this.props.otherMonths[i].toLowerCase() === parseDate[1].toLowerCase().trim())
                ) {
                    parseDate[1] = i + 1;
                    break;
                }
            }
        }
        console.log(parseDate)
        if (parseDate.length === 1) {
            parseDate = new Date(`${new Date(this.props.currentDate).getFullYear()}-${new Date(this.props.currentDate).getMonth() + 1}-${parseDate[0].trim()}`);
        } else if (parseDate.length === 2) {
            parseDate = new Date(`${new Date(this.props.currentDate).getFullYear()}-${parseDate[1]}-${parseDate[0].trim()}`);
        } else {
            parseDate = new Date(`${parseDate[2].trim()}-${parseDate[1].trim()}-${parseDate[0].trim()}`);
        }

        return parseDate;
    };

    onClose = () => {
        this.props.onActive();
        this.setState({event: ''});
    };

    render() {
        return(
            <div className={`${styles.wrapper} ${this.props.active ? styles.active : ''}`}>
                <div className={styles.arrow}></div>

                <button
                    className={styles.cancel}
                    onClick={this.onClose}
                >
                    <i className='fa fa-times'></i>
                </button>

                <div className={styles.content}>
                    <Input
                        placeholder={'Событие, дата'}
                        value={this.state.event}
                        name={'event'}
                        onChange={this.onChange}
                    />

                    <div className={styles.wrapperButton}>
                        <ButtonIcon onClick={this.createEvent} text={'Создать'} />
                    </div>
                </div>
            </div>
        );
    };
};

const state = state => {
    return {
        events: state.events.events,
        currentDate: state.calendar.currentDate,
        months: state.calendar.months,
        otherMonths: state.calendar.otherMonths
    }
};

const dispatch = {
    createEvent
}

export default connect(state, dispatch)(ShortPopup);
