import React from 'react';
import { connect } from 'react-redux';
import { visiblePopup, setActiveCell } from '../../redux/actions/popup';
import { createEvent, editEvent, removeEvent } from '../../redux/actions/events';
import { getIdEvent } from '../../redux/actions/calendar';
import { ButtonIcon } from '../ButtonIcon';
import { Input } from '../Input';
import styles from './Popup.module.sass';

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: '',
            date: '',
            names: '',
            description: '',
            eventEmpty: false,
            dateEmpty: false,
            dateError: false
        };
        this.months = [
            'Января',
            'Февраля',
            'Марта',
            'Апреля',
            'Мая',
            'Июня',
            'Июля',
            'Августа',
            'Сентября',
            'Октября',
            'Ноября',
            'Декабря'
        ];
    };

    componentDidMount = () => {
        this.updateStateInputs();
    };

    componentDidUpdate = (prevProps) => {
        if (prevProps.idEvent !== this.props.idEvent) {
            this.updateStateInputs();
            ['eventEmpty', 'dateEmpty', 'dateError'].forEach(name => this.setState({[name]: false}));
        }
    };

    updateStateInputs = () => {
        if (this.props.idEvent) {
            let event = this.props.events.find(event => event.id === this.props.idEvent);
            this.setState({event: event.title, date: `${new Date(event.date).getDate()}, ${new Date(event.date).getMonth() + 1}, ${new Date(event.date).getFullYear()}`, names: event.names, description: event.description});
        } else {
            this.setState({event: '', date: '', names: '', description: ''});
        }
    };

    onChange = (name, value) => {
        this.setState({[name]: value});
    };

    clearValue = () => {
        ['event', 'date', 'names', 'description'].forEach(name => this.setState({[name]: ''}));
        ['eventEmpty', 'dateEmpty', 'dateError'].forEach(name => this.setState({[name]: false}));
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

        return +parseDate;
    };

    calculateDate = parseDate => {
        if (isNaN(parseDate[1]) && parseDate[1]) {
            for (let i = 0; i < this.props.months.length; i++) {
                if (
                    (this.props.months[i].toLowerCase() === parseDate[1].toLowerCase().trim()) ||
                    (this.months[i].toLowerCase() === parseDate[1].toLowerCase().trim())
                ) {
                    parseDate[1] = i + 1;
                    break;
                }
            }
        }
        if (parseDate.length === 1) {
            parseDate = new Date(`${new Date(this.props.currentDate).getFullYear()}-${new Date(this.props.currentDate).getMonth() + 1}-${parseDate[0].trim()}`);
        } else if (parseDate.length === 2) {
            parseDate = new Date(`${new Date(this.props.currentDate).getFullYear()}-${parseDate[1]}-${parseDate[0].trim()}`);
        } else {
            parseDate = new Date(`${parseDate[2].trim()}-${parseDate[1].trim()}-${parseDate[0].trim()}`);
        }

        return parseDate;
    };

    checkEmptiness = (name, error) => {
        if (this.state[name].trim()) {
            this.setState({[error]: false});
        } else {
            this.setState({[error]: true});
        }
    };

    errorDate = () => {
        if (this.parseDate(this.state.date)) {
            this.setState({dateError: false});
        } else {
            this.setState({dateError: true});
        }
    };

    onSaveEvent = () => {
        this.checkEmptiness('event', 'eventEmpty');
        this.checkEmptiness('date', 'dateEmpty');
        this.errorDate();

        if (!this.state.eventEmpty && !this.state.dateEmpty && !this.state.dateError && this.state.event.trim() && this.state.date.trim()) {
            let id = 0;

            this.props.events.forEach(event => {
                if (event.id > id) {
                    id = event.id
                }
            });

            this.props.createEvent({
                id: id + 1,
                title: this.state.event,
                date: this.parseDate(this.state.date),
                names: this.state.names,
                description: this.state.description,
            });
            this.props.visiblePopup(false);
            this.props.setActiveCell(null);
            this.clearValue();
            this.props.getIdEvent(null);
        }
    };

    onClose = () => {
        this.props.visiblePopup(false);
        this.props.setActiveCell(null);
        this.clearValue();
        this.props.getIdEvent(null);
    };

    onEdit = () => {
        this.checkEmptiness('event', 'eventEmpty');
        this.checkEmptiness('date', 'dateEmpty');
        this.errorDate();

        if (!this.state.eventEmpty && !this.state.dateEmpty && !this.state.dateError && this.state.event.trim() && this.state.date.trim()) {
            this.props.editEvent({
                id: this.props.idEvent,
                title: this.state.event,
                date: this.parseDate(this.state.date),
                names: this.state.names,
                description: this.state.description,
            });
            this.props.visiblePopup(false);
            this.props.setActiveCell(null);
            this.clearValue();
            this.props.getIdEvent(null);
        }
    };

    removeEvent = () => {
        this.props.removeEvent(this.props.idEvent);
        this.props.visiblePopup(false);
        this.props.setActiveCell(null);
        this.clearValue();
        this.props.getIdEvent(null);
    };

    render() {
        return(
            <div
                className={`${styles.wrapper} ${this.props.isVisible ? styles.visible : ''}`}
                style={{left: this.props.position.wrapperLeft + 'px', top: this.props.position.wrapperTop + 'px'}}
            >
                <div className={
                    `${styles.arrow} ${styles[this.props.position.horizontalDirection]} ${styles[this.props.position.verticalDirection]}`
                }></div>
    
                <button
                    className={styles.cancel}
                    onClick={this.onClose}
                >
                    <i className='fa fa-times'></i>
                </button>

                <div className={styles.content}>
                    <Input
                        placeholder={'Событие'}
                        value={this.state.event}
                        name={'event'}
                        onChange={this.onChange}
                        onBlur={() => this.checkEmptiness('event', 'eventEmpty')}
                        isError={this.state.eventEmpty}
                    />

                    <Input
                        placeholder={'День, месяц, год'}
                        value={this.state.date}
                        name={'date'}
                        onChange={this.onChange}
                        onBlur={() => {
                            this.checkEmptiness('date', 'dateEmpty');
                            this.errorDate();
                        }}
                        isError={this.state.dateEmpty || this.state.dateError}
                        mt={true}
                    />

                    <Input
                        placeholder={'Имена участников'}
                        value={this.state.names}
                        name={'names'}
                        onChange={this.onChange}
                        mt={true}
                    />

                    <textarea
                        className={styles.textarea}
                        placeholder='Описание'
                        value={this.state.description}
                        name={'description'}
                        onChange={(e) => this.onChange(e.target.name, e.target.value)}
                    />

                    {this.state.eventEmpty && <p className={styles.error}>Поле события должно быть заполнено</p>}
                    {this.state.dateEmpty && <p className={styles.error}>Поле даты должно быть заполнено</p>}
                    {this.state.dateError && <p className={styles.error}>Дата введена не корректно</p> }
                </div>


                {
                    !this.props.idEvent &&
                        <div className={styles.wrapperButtons}>
                            <ButtonIcon
                                text={'Создать'}
                                onClick={this.onSaveEvent}
                            />

                            <ButtonIcon
                                text={'Отменить'}
                                onClick={this.onClose}
                            />
                        </div>
                }

                {
                    this.props.idEvent &&
                        <div className={styles.wrapperButtons}>
                            <ButtonIcon
                                text={'Редактировать'}
                                onClick={this.onEdit}
                            />

                            <ButtonIcon
                                text={'Удалить'}
                                onClick={this.removeEvent}
                            />
                        </div>
                }
            </div>
        );
    }
};

const state = (state) => {
    console.log(state)
    return {
        events: state.events.events,
        position: state.popup.position,
        months: state.calendar.months,
        currentDate: state.calendar.currentDate,
        idEvent: state.calendar.idEvent
    };
};

const dispatch = {
    visiblePopup,
    setActiveCell,
    createEvent,
    getIdEvent,
    editEvent,
    removeEvent
};

export default connect(state, dispatch)(Popup);
