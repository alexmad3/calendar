import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { visiblePopup, setActiveCell } from '../../redux/actions/popup';
import { createEvent, editEvent, removeEvent } from '../../redux/actions/events';
import { getIdEvent } from '../../redux/actions/calendar';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Input } from '../../common/Input';
import styles from './Popup.module.sass';

const Popup = props => {
  const [event, setEvent] = useState('');
  const [date, setDate] = useState('');
  const [names, setNames] = useState('');
  const [description, setDescription] = useState('');
  const [eventEmpty, setEventEmpty] = useState(false);
  const [dateEmpty, setDateEmpty] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [eventExists, setEventExists] = useState(false);
  const [eventExistsId, setEventExistsId] = useState('');

  const updateStateInputs = useCallback(() => {
    if (props.idEvent) {
      let event = props.events.find(event => event.id === props.idEvent);

      setEvent(event.title);
      setDate(`${new Date(event.date).getDate()}, ${new Date(event.date).getMonth() + 1}, ${new Date(event.date).getFullYear()}`);
      setNames(event.names);
      setDescription(event.description);
      setEventExistsId('');
    } else {
      setEvent('');
      setDate('');
      setNames('');
      setDescription('');
      setEventExistsId('');
    }
  }, [props.idEvent, props.events]);

  useEffect(() => {
    updateStateInputs();
    setEventEmpty(false);
    setDateEmpty(false);
    setDateError(false);
    setEventExists(false);
  }, [props.idEvent, updateStateInputs]);

  const clearValue = () => {
    setEvent('');
    setDate('');
    setNames('');
    setDescription('');
    setEventExistsId('');
    setEventEmpty(false);
    setDateEmpty(false);
    setDateError(false);
    setEventExists(false);
  };

  const parseDate = date => {
    let parseDate;
    if (date.indexOf(',') > 0) {
      parseDate = calculateDate(date.split(','));
    } else if (date.indexOf('.') > 0) {
      parseDate = calculateDate(date.split('.'));
    } else {
      parseDate = calculateDate(date.split(' '));
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
      parseDate = new Date(`${new Date(props.currentDate).getFullYear()}-${new Date(props.currentDate).getMonth() + 1}-${parseDate[0].trim()}`);
    } else if (parseDate.length === 2) {
      parseDate = new Date(`${new Date(props.currentDate).getFullYear()}-${parseDate[1]}-${parseDate[0].trim()}`);
    } else {
      parseDate = new Date(`${parseDate[2].trim()}-${parseDate[1].trim()}-${parseDate[0].trim()}`);
    }

    return parseDate;
  };

  const checkEmptiness = (name, setError) =>
    name.trim() ? setError(false) : setError(true);

  const errorDate = () =>
    parseDate(date) ? setDateError(false) : setDateError(true);

  const checkedEventExists = () => {
    if (!dateError) {
      let newDate = parseDate(date);

      for (let i = 0; i < props.events.length; i++) {
        if (newDate === props.events[i].date && props.idEvent !== props.events[i].id) {
          setEventExistsId(props.events[i].id);
          setEventExists(true);
          return;
        }
      }

      setEventExistsId('');
      setEventExists(false);
    }
  };

  const onSaveEvent = () => {
    checkEmptiness(event, setEventEmpty);
    checkEmptiness(date, setDateEmpty);
    errorDate();
    checkedEventExists();

    if (
      !eventEmpty &&
      !dateEmpty &&
      !dateError &&
      !eventExists &&
      event.trim() &&
      date.trim()
    ) {
      let id = 0;

      props.events.forEach(event => {
        if (event.id > id) {
          id = event.id
        }
      });

      props.createEvent({
        id: id + 1,
        title: event,
        date: parseDate(date),
        names,
        description
      });
      props.visiblePopup(false);
      props.setActiveCell(null);
      clearValue();
      props.getIdEvent(null);
    }
  };

  const onClose = () => {
    props.visiblePopup(false);
    props.setActiveCell(null);
    clearValue();
    props.getIdEvent(null);
  };

  const onEdit = () => {
    checkEmptiness(event, setEventEmpty);
    checkEmptiness(date, setDateEmpty);
    errorDate();
    checkedEventExists();

    if (
      !eventEmpty &&
      !dateEmpty &&
      !dateError &&
      !eventExists &&
      event.trim() &&
      date.trim()
    ) {

      props.editEvent({
        id: props.idEvent,
        title: event,
        date: parseDate(date),
        names,
        description
      });
      props.visiblePopup(false);
      props.setActiveCell(null);
      clearValue();
      props.getIdEvent(null);
    }
  };

  const onReplacement = () => {
    checkEmptiness(event, setEventEmpty);
    checkEmptiness(date, setDateEmpty);
    errorDate();

    if (
      !eventEmpty &&
      !dateEmpty &&
      !dateError &&
      event.trim() &&
      date.trim()
    ) {

      props.editEvent({
        id: eventExistsId,
        title: event,
        date: parseDate(date),
        names,
        description
      });
      props.visiblePopup(false);
      props.setActiveCell(null);
      clearValue();
      props.getIdEvent(null);
    }
  };

  const removeEvent = () => {
    props.removeEvent(props.idEvent);
    props.visiblePopup(false);
    props.setActiveCell(null);
    clearValue();
    props.getIdEvent(null);
  };

  return (
    <div
      className={`${styles.wrapper} ${props.isVisible ? styles.visible : ''}`}
      style={{ left: props.position.wrapperLeft + 'px', top: props.position.wrapperTop + 'px' }}
    >
      <div className={
        `${styles.arrow} ${styles[props.position.horizontalDirection]} ${styles[props.position.verticalDirection]}`
      }></div>

      <button
        className={styles.cancel}
        onClick={onClose}
      >
        <i className='fa fa-times'></i>
      </button>

      <div className={styles.content}>
        <Input
          placeholder={'Событие'}
          value={event}
          name={'event'}
          onChange={(_name, value) => setEvent(value)}
          onBlur={() => checkEmptiness(event, setEventEmpty)}
          isError={eventEmpty}
        />

        <Input
          placeholder={'День, месяц, год'}
          value={date}
          name={'date'}
          onChange={(_name, value) => setDate(value)}
          onBlur={() => {
            checkEmptiness(date, setDateEmpty);
            errorDate();
            checkedEventExists();
          }}
          isError={dateEmpty || dateError || eventExists}
          mt={true}
        />

        <Input
          placeholder={'Имена участников'}
          value={names}
          name={'names'}
          onChange={(_name, value) => setNames(value)}
          mt={true}
        />

        <textarea
          className={styles.textarea}
          placeholder='Описание'
          value={description}
          name={'description'}
          onChange={e => setDescription(e.target.value)}
        />

        {eventEmpty && <p className={styles.error}>Поле события должно быть заполнено</p>}
        {dateEmpty && <p className={styles.error}>Поле даты должно быть заполнено</p>}
        {dateError && <p className={styles.error}>Дата введена не корректно</p>}
        {eventExists && <p className={styles.error}>Событие существует на введенную дату</p>}
      </div>


      {
        !props.idEvent &&
        <div className={styles.wrapperButtons}>
          <ButtonIcon
            text={'Создать'}
            onClick={onSaveEvent}
          />

          <ButtonIcon
            text={'Отменить'}
            onClick={onClose}
          />

          {
            eventExists &&
            <ButtonIcon
              text={'Заменить'}
              onClick={onReplacement}
            />
          }
        </div>
      }

      {
        props.idEvent &&
        <div className={styles.wrapperButtons}>
          <ButtonIcon
            text={'Редактировать'}
            onClick={onEdit}
          />

          <ButtonIcon
            text={'Удалить'}
            onClick={removeEvent}
          />
          {
            eventExists &&
            <ButtonIcon
              text={'Заменить'}
              onClick={onReplacement}
            />
          }
        </div>
      }
    </div>
  );
};

const state = (state) => {
  return {
    events: state.events.events,
    position: state.popup.position,
    months: state.calendar.months,
    otherMonths: state.calendar.otherMonths,
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
