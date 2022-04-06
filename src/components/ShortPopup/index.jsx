import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createEvent, editEvent } from '../../redux/actions/events';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Input } from '../../common/Input';
import { CustomDatePicker } from '../../common/CustomDatePicker';
import classNames from 'classnames/bind';
import styles from './ShortPopup.module.sass';

const cx = classNames.bind(styles);

const ShortPopup = props => {
  const parseDate = (date = new Date()) =>
    +(new Date(`${new Date(date).getFullYear()}-${new Date(date).getMonth() + 1}-${new Date(date).getDate()}`));

  const [event, setEvent] = useState('');
  const [eventEmpty, setEventEmpty] = useState(false);
  const [date, setDate] = useState(parseDate());
  const [eventExists, setEventExists] = useState(false);

  const createEvent = () => {
    checkEmptiness();
    checkedEventExists();

    if (
      !eventEmpty &&
      !eventExists &&
      event.trim()
    ) {
      props.createEvent({
        title: event.trim(),
        date: parseDate(date),
        names: '',
        description: '',
      });

      props.onVisible();
      clearValue();
    }
  };

  const checkEmptiness = () =>
    event.trim() ? setEventEmpty(false) : setEventEmpty(true);

  const checkedEventExists = (newDate = date) => {
    const newPatseDate = parseDate(newDate);

    props.events[newPatseDate] ? setEventExists(true) : setEventExists(false);
  };

  const onReplacement = () => {
    checkEmptiness();
    checkedEventExists();

    if (
      !eventEmpty &&
      event.trim()
    ) {
      props.editEvent({
        title: event.trim(),
        date: parseDate(date),
        names: '',
        description: '',
      });
      props.onVisible();
      clearValue();
    }
  };

  const clearValue = useCallback(() => {
    setEvent('');
    setDate(parseDate());
    setEventEmpty(false);
    setEventExists(false);
  }, []);

  useEffect(() => {
    if (!props.active)
      clearValue();
  }, [props.active, clearValue]);

  const onClose = () => {
    props.onVisible();
    clearValue();
  };

  return (
    <div className={cx({
      wrapper: true,
      active: props.active,
      oneError: (eventEmpty && !eventExists) || (!eventEmpty && eventExists),
      errors: eventEmpty && eventExists
    })}>
      <div className={styles.arrow}></div>

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
          placeholder='Событие'
          value={event}
          onChange={(_name, value) => setEvent(value)}
          onBlur={() => {
            checkEmptiness();
            checkedEventExists();
          }}
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

        <p className={cx({
          errorPrompt: true,
          showError: eventEmpty,
          eventEmpty
        })}>
          Поле должно быть заполнено
        </p>

        <p className={cx({
          errorPrompt: true,
          showError: eventExists,
          eventExists
        })}>
          Событие существует на введенную дату
        </p>

      </div>
      <div className={styles.wrapperButton}>
        <ButtonIcon
          className='success'
          icon='fa fa-pencil'
          text='Создать'
          onClick={createEvent}
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

export default connect(state, dispatch)(ShortPopup);
