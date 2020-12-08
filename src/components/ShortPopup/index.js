import React from 'react';
import { connect } from 'react-redux';
import { createEvent, editEvent } from '../../redux/actions/events';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Input } from '../../common/Input';
import styles from './ShortPopup.module.sass';

class ShortPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: '',
            eventEmpty: false,
            dateError: false,
            eventExists: false
        };
    };

    onChange = (name, value) => {
        this.setState({[name]: value});
    };

    createEvent = () => {
        this.checkEmptiness();
        this.errorDate();
        this.checkedEventExists();

        if (
            !this.state.eventEmpty &&
            !this.state.dateError &&
            !this.state.eventExists &&
            this.state.event.trim()
        ) {
            let id = 0,
                index = this.state.event.indexOf(',') >= 0 ? this.state.event.slice(0, this.state.event.indexOf(',')) : this.state.event.slice(0),
                date = this.state.event.indexOf(',') === -1 ? '' : this.state.event.slice(this.state.event.indexOf(',') + 1);
    
            this.props.events.forEach(event => {
                if (event.id > id) {
                    id = event.id
                }
            });
    
            this.props.createEvent({
                id: id + 1,
                title: index,
                date: this.parseDate(date),
                names: '',
                description: '',
            });
            this.props.onVisible();
            this.clearValue();
        }
    };

    parseDate = date => {
        let parseDate = date.trim();
        if (parseDate.indexOf(',') > 0) {
            parseDate = this.calculateDate(parseDate.split(','));
        } else if (parseDate.indexOf('.') > 0) {
            parseDate = this.calculateDate(parseDate.split('.'));
        } else {
            parseDate = this.calculateDate(parseDate.split(' '));
        }

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
        if (parseDate.length === 1) {
            parseDate = new Date(`${new Date(this.props.currentDate).getFullYear()}-${new Date(this.props.currentDate).getMonth() + 1}-${parseDate[0].trim() === '' ? new Date().getDate() : parseDate[0].trim()}`);
        } else if (parseDate.length === 2) {
            parseDate = new Date(`${new Date(this.props.currentDate).getFullYear()}-${parseDate[1]}-${parseDate[0].trim()}`);
        } else {
            let day;
            if (parseDate[0].trim() === '') {
                day = new Date().getDate();
            } else {
                day = parseDate[0].trim();
            }
            parseDate = new Date(`${parseDate[2].trim()}-${parseDate[1].trim()}-${day}`);
        }

        return parseDate;
    };

    checkEmptiness = () => {
        if (this.state.event.trim()) {
            this.setState({eventEmpty: false});
        } else {
            this.setState({eventEmpty: true});
        }
    };

    errorDate = () => {
        let data = this.state.event.indexOf(',') === -1 ? '' : this.state.event.slice(this.state.event.indexOf(',') + 1);
        if (this.parseDate(data)) {
            this.setState({dateError: false});
        } else {
            this.setState({dateError: true});
        }
    };

    checkedEventExists = () => {
        if (!this.state.dateError) {
            let date = this.parseDate(this.state.event.indexOf(',') === -1 ? '' : this.state.event.slice(this.state.event.indexOf(',') + 1));
    
            for (let i = 0; i < this.props.events.length; i++) {
                if (date === this.props.events[i].date) {
                    this.setState({eventExistsId: this.props.events[i].id, eventExists: true});
                    return;
                }
            }

            this.setState({eventExistsId: '', eventExists: false});
        }
    };

    onReplacement = () => {
        this.checkEmptiness();
        this.errorDate();
        this.checkedEventExists();

        if (
            !this.state.eventEmpty &&
            !this.state.dateError &&
            this.state.event.trim()
        ) {
            let index = this.state.event.indexOf(',') >= 0 ? this.state.event.slice(0, this.state.event.indexOf(',')) : this.state.event.slice(0);
            
            this.props.editEvent({
                id: this.state.eventExistsId,
                title:  index,
                date: this.parseDate(this.state.event.indexOf(',') === -1 ? '' : this.state.event.slice(this.state.event.indexOf(',') + 1)),
                names: '',
                description: '',
            });
            this.props.onVisible();
            this.clearValue();
        }
    };

    clearValue = () => {
        this.setState({event: ''});
        ['eventEmpty', 'dateError', 'eventExists'].forEach(name => this.setState({[name]: false}));
    };

    onClose = () => {
        this.props.onVisible();
        this.clearValue();
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
                        onBlur={() => {
                            this.checkEmptiness();
                            this.errorDate();
                            this.checkedEventExists();
                        }}
                    />
                    {this.state.eventEmpty && <p className={styles.error}>Поле должно быть заполнено</p>}
                    {this.state.dateError && <p className={styles.error}>Дата введена не корректно</p>}
                    {this.state.eventExists && !this.state.eventEmpty && <p className={styles.error}>Событие существует на введенную дату</p>}

                </div>
                <div className={styles.wrapperButton}>
                    <ButtonIcon onClick={this.createEvent} text={'Создать'} />
                    {
                        this.state.eventExists &&
                            <ButtonIcon
                                text={'Заменить'}
                                onClick={this.onReplacement}
                            />
                    }
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
    createEvent,
    editEvent
}

export default connect(state, dispatch)(ShortPopup);
