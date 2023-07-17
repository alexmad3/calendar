import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createEvent, editEvent } from '../../redux/actions/events';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { CustomDatePicker } from '../../common/CustomDatePicker';
import { dateToNumDate } from '../../utilities';
import classNames from 'classnames/bind';
import styles from './PopupEvent.module.sass';

const cx = classNames.bind(styles);

const PopupEvent = props => {
  const [event, setEvent] = useState(''),
        [eventEmpty, setEventEmpty] = useState(false),
        [date, setDate] = useState(dateToNumDate()),
        [eventExists, setEventExists] = useState(false),
        [hidingEmpty, setHidingEmpty] = useState(false),
        [hidingExists, setHidingExists] = useState(false);

  const onSubmit = method => {
    checkEmptiness();
    checkedEventExists();

    if (!eventEmpty && !eventExists && event.trim()) {
      props[method]({
        title: event.trim(),
        date,
        names: '',
        description: '',
      });

      props.onVisible();
      clearValue();
    }
  };

  const onCreateEvent = () => onSubmit('createEvent');

  const onEditEvent = () => onSubmit('editEvent');

  const checkEmptiness = () =>
    event.trim() ? setEventEmpty(false) : setEventEmpty(true);

  const checkedEventExists = (newDate = date) => {
    const newPatseDate = dateToNumDate(newDate);
    if (props.events.find(event => event.date === newPatseDate)) {
      setEventExists(true);
      setHidingExists(true);
    } else {
      setEventExists(false);
    }
  };

  const onChangeEventName = value => {
    setEvent(value);
    setHidingEmpty(true);
  };

  const onControlEvents = () => {
    checkEmptiness();
    checkedEventExists();
  };

  const onChangeEventDate = newDate => {
    setDate(dateToNumDate(newDate));
    checkedEventExists(dateToNumDate(newDate));
  };

  const clearValue = useCallback(() => {
    setEvent('');
    setDate(dateToNumDate());
    setEventEmpty(false);
    setEventExists(false);
  }, []);

  const onClose = () => {
    props.onVisible();
    setHidingEmpty(false);
    setHidingExists(false);
    clearValue();
  };

  useEffect(() => {
    if (!props.active)
      clearValue();
  }, [props.active, clearValue]);

  return (
    <div
      className={cx({
        popup: true,
        active: props.active,
        oneError: (eventEmpty && !eventExists) || (!eventEmpty && eventExists),
        errors: eventEmpty && eventExists
      })}
    >
      <div className={styles.arrow}></div>

      <Button
        className={styles.cancel}
        colorScheme='transparent'
        icon='close16'
        iconClass={styles.iconCancel}
        onClick={onClose}
      />

      <div
        className={cx({
          content: true,
          oneError: (eventEmpty && !eventExists) || (!eventEmpty && eventExists),
          errors: eventEmpty && eventExists
        })}
      >
        <Input
          placeholder='Событие'
          value={event}
          onChange={onChangeEventName}
          onBlur={onControlEvents}
          isError={eventEmpty}
        />

        <CustomDatePicker
          date={date}
          isError={eventExists}
          onChange={onChangeEventDate}
        />

        <p
          className={cx({
            errorPrompt: true,
            showError: eventEmpty,
            hidingError: !eventEmpty && hidingEmpty
          })}
        >
          Поле должно быть заполнено
        </p>

        <p
          className={cx({
            errorPrompt: true,
            showError: eventExists,
            hidingError: !eventExists && hidingExists
          })}
        >
          Событие существует на введенную дату
        </p>
      </div>

      <div className={styles.actions}>
        {
          eventExists ?
            <Button
              colorScheme='primary'
              icon='gear24'
              iconClass={`${styles.icon} indentRight`}
              onClick={onEditEvent}
            >
              Заменить
            </Button>

              :

            <Button
              colorScheme='success'
              icon='pencil24'
              iconClass={`${styles.icon} indentRight`}
              onClick={onCreateEvent}
            >
              Создать
            </Button>
        }
      </div>
    </div>
  );
};

const state = state => ({
  events: state.events.events
});

const dispatch = {
  createEvent,
  editEvent
};

export default connect(state, dispatch)(PopupEvent);
