import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { visibleModalEvent, setActiveCell } from '../../redux/actions/modalEvent';
import { createEvent, editEvent, removeEvent } from '../../redux/actions/events';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { CustomDatePicker } from '../../common/CustomDatePicker';
import { dateToNumDate } from '../../utilities';
import classNames from 'classnames/bind';
import styles from './ModalEvent.module.sass';

const cx = classNames.bind(styles);

const ModalEvent = props => {
  const [event, setEvent] = useState(''),
        [date, setDate] = useState(dateToNumDate()),
        [names, setNames] = useState(''),
        [description, setDescription] = useState(''),
        [eventEmpty, setEventEmpty] = useState(false),
        [eventExists, setEventExists] = useState(false);

  const updateStateInputs = useCallback(() => {
    setEvent(props.events[props.dateToPicker]?.title || '');
    setDate(dateToNumDate(props.dateToPicker));
    setNames(props.events[props.dateToPicker]?.names || '');
    setDescription(props.events[props.dateToPicker]?.description || '');
  }, [props.events, props.dateToPicker]);

  useEffect(() => {
    if (props.activeCell) {
      updateStateInputs();
    }
  }, [updateStateInputs, props.activeCell]);

  const checkEmptiness = (name, setError) =>
    name.trim() ? setError(false) : setError(true);

  const checkedEventExists = (newDate = date) => {
    const newParseDate = dateToNumDate(newDate);
    props.events[newParseDate] ? setEventExists(true) : setEventExists(false);
  };

  const onClose = () => {
    setEventEmpty(false);
    setEventExists(false);
    props.visibleModalEvent(false);
    props.setActiveCell(null);
  };

  const onSubmit = method => {
    checkEmptiness(event, setEventEmpty);

    if (!eventEmpty && event.trim()) {
      props[method]({
        title: event.trim(),
        date,
        names,
        description
      });

      onClose();
    }
  };

  const onRemove = () => {
    props.removeEvent(date);
    onClose();
  };

  const onChangeEventName = (_name, value) => setEvent(value);

  const onControlEvents = () => checkEmptiness(event, setEventEmpty);

  const onChangeEventDate = newDate => {
    setDate(dateToNumDate(newDate));
    checkedEventExists(dateToNumDate(newDate));
  };

  const onChangeEventParticipant = (_name, value) => setNames(value);

  const onChangeEventDescription = e => setDescription(e.target.value);

  const onCreateEvent = () => onSubmit('createEvent');

  const onEditEvent = () => onSubmit('editEvent');

  return (
    <div
      className={cx({
        overlay: true,
        visible: props.isVisible
      })}
    >
      <div
        className={cx({
          wrapper: true,
          oneError: (eventEmpty && !eventExists) || (!eventEmpty && eventExists),
          errors: eventEmpty && eventExists
        })}
      >
        <Button
          className={styles.cancel}
          colorScheme='transparent'
          icon='close16'
          iconClass={styles.canselIcon}
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
            className={styles.field}
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

          <Input
            className={styles.field}
            placeholder='Имена участников'
            value={names}
            onChange={onChangeEventParticipant}
          />

          <textarea
            className={styles.description}
            placeholder='Описание'
            value={description}
            onChange={onChangeEventDescription}
          />

          <p 
            className={cx({
              errorPrompt: true,
              showError: eventEmpty,
              eventEmpty
            })}
          >
            Поле события должно быть заполнено
          </p>

          <p
            className={cx({
              errorPrompt: true,
              showError: eventExists,
              eventExists
            })}
          >
            Событие существует на введенную дату
          </p>
        </div>

        <div className={styles.actions}>
          {
            !(props.activeCell === props.events[date]?.date || date === props.events[date]?.date) ?
              <Button
                colorScheme='success'
                icon='pencil24'
                iconClass={`${styles.icon} indentRight`}
                onClick={onCreateEvent}
              >
                Создать
              </Button>

                :

              <Button
                colorScheme='primary'
                icon='gear24'
                iconClass={`${styles.icon} indentRight`}
                onClick={onEditEvent}
              >
                Перезаписать
              </Button>
          }

          <Button
            icon='close24'
            iconClass={`${styles.icon} indentRight`}
            onClick={onClose}
          >
            Отменить
          </Button>

          {
            !(props.activeCell === props.events[date]?.date || date === props.events[date]?.date) ?
              null

                :

              <Button
                colorScheme='danger'
                icon='trash24'
                iconClass={`${styles.icon} indentRight`}
                onClick={onRemove}
              >
                Удалить
              </Button>
          }
        </div>
      </div>
    </div>
  );
};

const state = state => ({
  events: state.events.events,
  activeCell: state.modalEvent.activeCell,
  dateToPicker: state.modalEvent.dateToPicker
});

const dispatch = {
  visibleModalEvent,
  setActiveCell,
  createEvent,
  editEvent,
  removeEvent
};

export default connect(state, dispatch)(ModalEvent);
