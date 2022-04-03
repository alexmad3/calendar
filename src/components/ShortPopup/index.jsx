import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createEvent, editEvent } from '../../redux/actions/events';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Input } from '../../common/Input';
import { CustomDatePicker } from '../../common/CustomDatePicker';
import classNames from 'classnames/bind';
import styles from './ShortPopup.module.sass';

const cx = classNames.bind(styles);

const ShortPopup = props => {
  const [event, setEvent] = useState('');
  const [eventEmpty, setEventEmpty] = useState(false);
  const [date, setDate] = useState(+(new Date()));
  const [eventExists, setEventExists] = useState(false);
  const [eventExistsId, setEventExistsId] = useState('');

  const createEvent = () => {
    checkEmptiness();
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
        title: event.trim(),
        date: parseDate(date),
        names: '',
        description: '',
      });

      props.onVisible();
      clearValue();
    }
  };

  const parseDate = (date = new Date()) =>
    +(new Date(`${new Date(date).getFullYear()}-${new Date(date).getMonth() + 1}-${new Date(date).getDate()}`));

  const checkEmptiness = () =>
    event.trim() ? setEventEmpty(false) : setEventEmpty(true);

  const checkedEventExists = (newDate = date) => {
    const newPatseDate = parseDate(newDate);

    for (let i = 0; i < props.events.length; i++) {
      if (newPatseDate === props.events[i].date) {
        setEventExistsId(props.events[i].id);
        setEventExists(true);
        return;
      }
    }

    setEventExistsId('');
    setEventExists(false);
  };

  const onReplacement = () => {
    checkEmptiness();
    checkedEventExists();

    if (
      !eventEmpty &&
      event.trim()
    ) {
      props.editEvent({
        id: eventExistsId,
        title: event.trim(),
        date: parseDate(date),
        names: '',
        description: '',
      });
      props.onVisible();
      clearValue();
    }
  };

  const clearValue = () => {
    setEvent('');
    setDate(+(new Date()));
    setEventEmpty(false);
    setEventExists(false);
    setEventExistsId('');
  };

  useEffect(() => {
    if (!props.active)
      clearValue();
  }, [props.active]);

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
            setDate(+(new Date(date)));
            checkedEventExists(date);
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
