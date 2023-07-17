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
  const [currentEvent, setCurrentEvent] = useState({}),
        [event, setEvent] = useState(''),
        [date, setDate] = useState(dateToNumDate()),
        [names, setNames] = useState(''),
        [description, setDescription] = useState(''),
        [eventEmpty, setEventEmpty] = useState(false),
        [eventExists, setEventExists] = useState(false),
        [hidingEmpty, setHidingEmpty] = useState(false),
        [hidingExists, setHidingExists] = useState(false);

  const updateStates = useCallback(date => {
    setCurrentEvent(props.events.find(event => event.date === date));
    setEvent((props.events.find(event => event.date === date))?.title || '');
    setDate(dateToNumDate(date));
    setNames((props.events.find(event => event.date === date))?.names || '');
    setDescription((props.events.find(event => event.date === date))?.description || '');
  }, [props.events]);

  useEffect(() => {
    if (props.activeCell) {
      updateStates(props.dateToPicker);
    }
  }, [updateStates, props.activeCell, props.dateToPicker]);

  const checkEmptiness = (name, setError) =>
    name.trim() ? setError(false) : setError(true);

  const checkedEventExists = (newDate = date) => {
    const newParseDate = dateToNumDate(newDate);
    setCurrentEvent(props.events.find(event => event.date === newParseDate));
    if (props.events.find(event => event.date === newParseDate)) {
      setEventExists(true);
      setHidingExists(true);
    } else {
      setEventExists(false);
    }
  };

  const onClose = () => {
    setEventEmpty(false);
    setEventExists(false);
    setHidingEmpty(false);
    setHidingExists(false);
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

  const onChangeEventName = value => {
    setEvent(value);
    setHidingEmpty(true);
  };

  const onControlEvents = () => checkEmptiness(event, setEventEmpty);

  const onChangeEventDate = newDate => {
    updateStates(dateToNumDate(newDate));
    checkedEventExists(dateToNumDate(newDate));
  };

  const onChangeEventParticipant = value => setNames(value);

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
          modal: true,
          oneError: (eventEmpty && !eventExists) || (!eventEmpty && eventExists),
          errors: eventEmpty && eventExists
        })}
      >
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
              hidingError: !eventEmpty && hidingEmpty
            })}
          >
            Поле события должно быть заполнено
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
            !(props.activeCell === currentEvent?.date || date === currentEvent?.date) ?
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
            !(props.activeCell === currentEvent?.date || date === currentEvent?.date) ?
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
