import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createEvent, editEvent } from '../../redux/actions/events';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Input } from '../../common/Input';
import styles from './ShortPopup.module.sass';

const ShortPopup = props => {
  const [event, setEvent] = useState('');
  const [eventEmpty, setEventEmpty] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [eventExists, setEventExists] = useState(false);
  const [eventExistsId, setEventExistsId] = useState('');

  const createEvent = () => {
    checkEmptiness();
    errorDate();
    checkedEventExists();

    if (
      !eventEmpty &&
      !dateError &&
      !eventExists &&
      event.trim()
    ) {
      let id = 0,
        index = event.indexOf(',') >= 0 ? event.slice(0, event.indexOf(',')) : event.slice(0),
        date = event.indexOf(',') === -1 ? '' : event.slice(event.indexOf(',') + 1);

      props.events.forEach(event => {
        if (event.id > id) {
          id = event.id
        }
      });

      props.createEvent({
        id: id + 1,
        title: index,
        date: parseDate(date),
        names: '',
        description: '',
      });
      props.onVisible();
      clearValue();
    }
  };

  const parseDate = date => {
    let parseDate = date.trim();
    if (parseDate.indexOf(',') > 0) {
      parseDate = calculateDate(parseDate.split(','));
    } else if (parseDate.indexOf('.') > 0) {
      parseDate = calculateDate(parseDate.split('.'));
    } else {
      parseDate = calculateDate(parseDate.split(' '));
    }

    return +parseDate;
  };

  const calculateDate = parseDate => {
    if (isNaN(parseDate[1]) && parseDate[1]) {
      for (let i = 0; i < props.months.length; i++) {
        if (
          (props.months[i].toLowerCase() === parseDate[1].toLowerCase().trim()) ||
          (props.otherMonths[i].toLowerCase() === parseDate[1].toLowerCase().trim())
        ) {
          parseDate[1] = i + 1;
          break;
        }
      }
    }
    if (parseDate.length === 1) {
      parseDate = new Date(`${new Date(props.currentDate).getFullYear()}-${new Date(props.currentDate).getMonth() + 1}-${parseDate[0].trim() === '' ? new Date().getDate() : parseDate[0].trim()}`);
    } else if (parseDate.length === 2) {
      parseDate = new Date(`${new Date(props.currentDate).getFullYear()}-${parseDate[1]}-${parseDate[0].trim()}`);
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

  const checkEmptiness = () => {
    if (event.trim()) {
      setEventEmpty(false);
    } else {
      setEventEmpty(true);
    }
  };

  const errorDate = () => {
    let data = event.indexOf(',') === -1 ? '' : event.slice(event.indexOf(',') + 1);
    if (parseDate(data)) {
      setDateError(false);
    } else {
      setDateError(true);
    }
  };

  const checkedEventExists = () => {
    if (!dateError) {
      let date = parseDate(event.indexOf(',') === -1 ? '' : event.slice(event.indexOf(',') + 1));

      for (let i = 0; i < props.events.length; i++) {
        if (date === props.events[i].date) {
          setEventExistsId(props.events[i].id);
          setEventExists(true);
          return;
        }
      }

      setEventExistsId('');
      setEventExists(false);
    }
  };

  const onReplacement = () => {
    checkEmptiness();
    errorDate();
    checkedEventExists();

    if (
      !eventEmpty &&
      !dateError &&
      event.trim()
    ) {
      let index = event.indexOf(',') >= 0 ? event.slice(0, event.indexOf(',')) : event.slice(0);

      props.editEvent({
        id: eventExistsId,
        title: index,
        date: parseDate(event.indexOf(',') === -1 ? '' : event.slice(event.indexOf(',') + 1)),
        names: '',
        description: '',
      });
      props.onVisible();
      clearValue();
    }
  };

  const clearValue = () => {
    setEvent('');
    setEventEmpty(false);
    setDateError(false);
    setEventExists(false);
    setEventExistsId('');
  };

  const onClose = () => {
    props.onVisible();
    clearValue();
  };

  return (
    <div className={`${styles.wrapper} ${props.active ? styles.active : ''}`}>
      <div className={styles.arrow}></div>

      <button
        className={styles.cancel}
        onClick={onClose}
      >
        <i className='fa fa-times'></i>
      </button>

      <div className={styles.content}>
        <Input
          placeholder={'Событие, дата'}
          value={event}
          name={'event'}
          onChange={(_name, value) => setEvent(value)}
          onBlur={() => {
            checkEmptiness();
            errorDate();
            checkedEventExists();
          }}
        />
        {eventEmpty && <p className={styles.error}>Поле должно быть заполнено</p>}
        {dateError && <p className={styles.error}>Дата введена не корректно</p>}
        {eventExists && !eventEmpty && <p className={styles.error}>Событие существует на введенную дату</p>}

      </div>
      <div className={styles.wrapperButton}>
        <ButtonIcon onClick={createEvent} text={'Создать'} />
        {
          eventExists &&
          <ButtonIcon
            text={'Заменить'}
            onClick={onReplacement}
          />
        }
      </div>
    </div>
  );
};

const state = state => ({
  events: state.events.events,
  currentDate: state.calendar.currentDate,
  months: state.calendar.months,
  otherMonths: state.calendar.otherMonths
});

const dispatch = {
  createEvent,
  editEvent
}

export default connect(state, dispatch)(ShortPopup);
