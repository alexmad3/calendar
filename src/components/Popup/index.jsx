import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { visiblePopup, setActiveCell } from '../../redux/actions/popup';
import { createEvent, editEvent, removeEvent } from '../../redux/actions/events';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Input } from '../../common/Input';
import { CustomDatePicker } from '../../common/CustomDatePicker';
import classNames from 'classnames/bind';
import styles from './Popup.module.sass';

const cx = classNames.bind(styles);

const Popup = props => {
  const parseDate = (date = new Date()) =>
    +(new Date(`${new Date(date).getFullYear()}-${new Date(date).getMonth() + 1}-${new Date(date).getDate()}`));

  const [event, setEvent] = useState('');
  const [date, setDate] = useState(parseDate());
  const [names, setNames] = useState('');
  const [description, setDescription] = useState('');
  const [eventEmpty, setEventEmpty] = useState(false);
  const [eventExists, setEventExists] = useState(false);

  const updateStateInputs = useCallback(() => {
    setEvent(props.events[props.dateToPicker]?.title || '');
    setDate(parseDate(props.dateToPicker));
    setNames(props.events[props.dateToPicker]?.names || '');
    setDescription(props.events[props.dateToPicker]?.description || '');
  }, [props.events, props.dateToPicker]);

  useEffect(() => {
    updateStateInputs();
    setEventEmpty(false);
    setEventExists(false);
  }, [updateStateInputs]);

  const clearValue = () => {
    setEvent('');
    setDate(parseDate());
    setNames('');
    setDescription('');
    setEventEmpty(false);
    setEventExists(false);
  };

  const checkEmptiness = (name, setError) =>
    name.trim() ? setError(false) : setError(true);

  const checkedEventExists = (newDate = date) => {
    const newParseDate =
      +(new Date(`${new Date(newDate).getFullYear()}-${new Date(newDate).getMonth() + 1}-${new Date(newDate).getDate()}`));

    props.events[newParseDate] ? setEventExists(true) : setEventExists(false);
  };

  const onSaveEvent = () => {
    checkEmptiness(event, setEventEmpty);
    checkedEventExists();

    if (
      !eventEmpty &&
      !eventExists &&
      event.trim() 
    ) {
      props.createEvent({
        title: event,
        date,
        names,
        description
      });
      props.visiblePopup(false);
      props.setActiveCell(null);
      clearValue();
    }
  };

  const onClose = () => {
    props.visiblePopup(false);
    props.setActiveCell(null);
    clearValue();
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
        title: event,
        date,
        names,
        description
      });
      props.visiblePopup(false);
      props.setActiveCell(null);
      clearValue();
    }
  };

  const onReplacement = () => {
    checkEmptiness(event, setEventEmpty);

    if (
      !eventEmpty &&
      event.trim()
    ) {

      props.editEvent({
        title: event,
        date,
        names,
        description
      });
      props.visiblePopup(false);
      props.setActiveCell(null);
      clearValue();
    }
  };

  const removeEvent = () => {
    props.removeEvent(props.dateToPicker);
    props.visiblePopup(false);
    props.setActiveCell(null);
    clearValue();
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
            setDate(parseDate(date));
            checkedEventExists(parseDate(date));
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
        !props.events[props.dateToPicker] &&
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
        props.events[props.dateToPicker] &&
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
  dateToPicker: state.popup.dateToPicker
});

const dispatch = {
  visiblePopup,
  setActiveCell,
  createEvent,
  editEvent,
  removeEvent
};

export default connect(state, dispatch)(Popup);
