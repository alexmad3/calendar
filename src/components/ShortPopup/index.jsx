import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createEvent, editEvent } from '../../redux/actions/events';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Input } from '../../common/Input';
import { CustomDatePicker } from '../../common/CustomDatePicker';
import { dateToNumDate } from '../../utilities';
import classNames from 'classnames/bind';
import styles from './ShortPopup.module.sass';

const cx = classNames.bind(styles);

const ShortPopup = props => {
  const [event, setEvent] = useState(''),
        [eventEmpty, setEventEmpty] = useState(false),
        [date, setDate] = useState(dateToNumDate()),
        [eventExists, setEventExists] = useState(false);

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
    props.events[newPatseDate] ? setEventExists(true) : setEventExists(false);
  };

  const onChangeEventName = (_name, value) => setEvent(value);

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
    clearValue();
  };

  useEffect(() => {
    if (!props.active)
      clearValue();
  }, [props.active, clearValue]);

  return (
    <div  className={cx({
            wrapper: true,
            active: props.active,
            oneError: (eventEmpty && !eventExists) || (!eventEmpty && eventExists),
            errors: eventEmpty && eventExists
    })}>
      <div className={styles.arrow}></div>

      <button className={styles.cancel}
              onClick={onClose}
      >
        <i className='fa fa-times'></i>
      </button>

      <div  className={cx({
              content: true,
              oneError: (eventEmpty && !eventExists) || (!eventEmpty && eventExists),
              errors: eventEmpty && eventExists
      })}>
        <Input  placeholder='Событие'
                value={event}
                onChange={onChangeEventName}
                onBlur={onControlEvents}
                isError={eventEmpty}
        />

        <CustomDatePicker date={date}
                          isError={eventExists}
                          onChange={onChangeEventDate}
        />

        <p  className={cx({
              errorPrompt: true,
              showError: eventEmpty,
              eventEmpty
        })}>
          Поле должно быть заполнено
        </p>

        <p  className={cx({
              errorPrompt: true,
              showError: eventExists,
              eventExists
        })}>
          Событие существует на введенную дату
        </p>

      </div>
      <div className={styles.wrapperButton}>
        <ButtonIcon className='success'
                    icon='fa fa-pencil'
                    text='Создать'
                    onClick={onCreateEvent}
        />
        {
          eventExists &&
          <ButtonIcon className='primary'
                      icon='fa fa-cog'
                      text='Заменить'
                      onClick={onEditEvent}
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
