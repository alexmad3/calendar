import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { visiblePopup, setActiveCell } from '../../redux/actions/popup';
import { createEvent, editEvent, removeEvent } from '../../redux/actions/events';
import { getIdEvent } from '../../redux/actions/calendar';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Input } from '../../common/Input';
import { CustomDatePicker } from '../../common/CustomDatePicker';
import classNames from 'classnames/bind';
import styles from './Popup.module.sass';

const cx = classNames.bind(styles);

const Popup = props => {
  const [event, setEvent] = useState('');
  const [date, setDate] = useState(new Date());
  const [names, setNames] = useState('');
  const [description, setDescription] = useState('');
  const [eventEmpty, setEventEmpty] = useState(false);
  const [eventExists, setEventExists] = useState(false);
  const [eventExistsId, setEventExistsId] = useState('');

  const updateStateInputs = useCallback(() => {
    if (props.idEvent) {
      let event = props.events.find(event => event.id === props.idEvent);

      setEvent(event.title);
      setDate(new Date(event.date));
      setNames(event.names);
      setDescription(event.description);
      setEventExistsId('');
    } else {
      setEvent('');
      setDate(+(props.dateToPicker));
      setNames('');
      setDescription('');
      setEventExistsId('');
    }
  }, [props.idEvent, props.events, props.dateToPicker]);

  useEffect(() => {
    updateStateInputs();
    setEventEmpty(false);
    setEventExists(false);
  }, [props.idEvent, updateStateInputs]);

  const clearValue = () => {
    setEvent('');
    setDate(new Date());
    setNames('');
    setDescription('');
    setEventExistsId('');
    setEventEmpty(false);
    setEventExists(false);
  };

  const checkEmptiness = (name, setError) =>
    name.trim() ? setError(false) : setError(true);

  const checkedEventExists = (newDate = date) => {
    const newParseDate =
      +(new Date(`${new Date(newDate).getFullYear()}-${new Date(newDate).getMonth() + 1}-${new Date(newDate).getDate()}`));

    for (let i = 0; i < props.events.length; i++) {
      if (newParseDate === props.events[i].date && props.idEvent !== props.events[i].id) {
        setEventExistsId(props.events[i].id);
        setEventExists(true);
        return;
      }
    }

    setEventExistsId('');
    setEventExists(false);
  };

  const onSaveEvent = () => {
    checkEmptiness(event, setEventEmpty);
    checkedEventExists();

    if (
      !eventEmpty &&
      !eventExists &&
      event.trim() 
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
        date,
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
    checkedEventExists();

    if (
      !eventEmpty &&
      !eventExists &&
      event.trim()
    ) {

      props.editEvent({
        id: props.idEvent,
        title: event,
        date,
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

    if (
      !eventEmpty &&
      event.trim()
    ) {

      props.editEvent({
        id: eventExistsId,
        title: event,
        date,
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
      className={cx({
        wrapper: true,
        visible: props.isVisible,
        oneError: (eventEmpty && !eventExists) || (!eventEmpty && eventExists),
        errors: eventEmpty && eventExists
      })}
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

      <div className={cx({
        content: true,
        oneError: (eventEmpty && !eventExists) || (!eventEmpty && eventExists),
        errors: eventEmpty && eventExists
      })}>
        <Input
          className={styles.field}
          placeholder='Событие'
          value={event}
          onChange={(_name, value) => setEvent(value)}
          onBlur={() => checkEmptiness(event, setEventEmpty)}
          isError={eventEmpty}
        />

        <CustomDatePicker
          date={date}
          isError={eventExists}
          onChange={date => {
            setDate(+(new Date(date)));
            checkedEventExists(date);
          }}
        />

        <Input
          className={styles.field}
          placeholder='Имена участников'
          value={names}
          onChange={(_name, value) => setNames(value)}
        />

        <textarea
          className={styles.description}
          placeholder='Описание'
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <p className={cx({
          errorPrompt: true,
          showError: eventEmpty,
          eventEmpty
        })}>
          Поле события должно быть заполнено
        </p>

        <p className={cx({
          errorPrompt: true,
          showError: eventExists,
          eventExists
        })}>
          Событие существует на введенную дату
        </p>
      </div>


      {
        !props.idEvent &&
        <div className={styles.wrapperButtons}>
          <ButtonIcon
            className='success'
            icon='fa fa-pencil'
            text='Создать'
            onClick={onSaveEvent}
          />

          <ButtonIcon
            icon='fa fa-times'
            text='Отменить'
            onClick={onClose}
          />

          {
            eventExists &&
            <ButtonIcon
              className='primary'
              icon='fa fa-cog'
              text='Заменить'
              onClick={onReplacement}
            />
          }
        </div>
      }

      {
        props.idEvent &&
        <div className={styles.wrapperButtons}>
          <ButtonIcon
            className='primary'
            icon='fa fa-cog'
            text='Редактировать'
            onClick={onEdit}
          />

          <ButtonIcon
            className='danger'
            icon='fa fa-trash'
            text='Удалить'
            onClick={removeEvent}
          />
          {
            eventExists &&
            <ButtonIcon
              className='primary'
              icon='fa fa-cog'
              text='Заменить'
              onClick={onReplacement}
            />
          }
        </div>
      }
    </div>
  );
};

const state = state => ({
  events: state.events.events,
  position: state.popup.position,
  months: state.calendar.months,
  otherMonths: state.calendar.otherMonths,
  currentDate: state.calendar.currentDate,
  idEvent: state.calendar.idEvent,
  dateToPicker: state.popup.dateToPicker
});

const dispatch = {
  visiblePopup,
  setActiveCell,
  createEvent,
  getIdEvent,
  editEvent,
  removeEvent
};

export default connect(state, dispatch)(Popup);
