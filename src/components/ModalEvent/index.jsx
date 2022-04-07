import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { visibleModalEvent, setActiveCell } from '../../redux/actions/modalEvent';
import { createEvent, editEvent, removeEvent } from '../../redux/actions/events';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Input } from '../../common/Input';
import { CustomDatePicker } from '../../common/CustomDatePicker';
import classNames from 'classnames/bind';
import styles from './ModalEvent.module.sass';

const cx = classNames.bind(styles);

const ModalEvent = props => {
  const parseDate = (date = new Date()) =>
    +(new Date(`${new Date(date).getFullYear()}-${new Date(date).getMonth() + 1}-${new Date(date).getDate()}`));

  const [event, setEvent] = useState(''),
        [date, setDate] = useState(parseDate()),
        [names, setNames] = useState(''),
        [description, setDescription] = useState(''),
        [eventEmpty, setEventEmpty] = useState(false),
        [eventExists, setEventExists] = useState(false);

  const updateStateInputs = useCallback(() => {
    setEvent(props.events[props.dateToPicker]?.title || '');
    setDate(parseDate(props.dateToPicker));
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
    const newParseDate = parseDate(newDate);
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
        title: event,
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

  return (
    <div  className={cx({
            externalModalBackground: true,
            visible: props.isVisible
          })}
    >
      <div  className={cx({
              wrapper: true,
              oneError: (eventEmpty && !eventExists) || (!eventEmpty && eventExists),
              errors: eventEmpty && eventExists
            })}
      >
        <div  className={cx({
                arrow: true
              })}
        ></div>

        <button className={styles.cancel}
                onClick={onClose}
        >
          <i className='fa fa-times'></i>
        </button>

        <div  className={cx({
                content: true,
                oneError: (eventEmpty && !eventExists) || (!eventEmpty && eventExists),
                errors: eventEmpty && eventExists
              })}
        >
          <Input  className={styles.field}
                  placeholder='Событие'
                  value={event}
                  onChange={(_name, value) => setEvent(value)}
                  onBlur={() => checkEmptiness(event, setEventEmpty)}
                  isError={eventEmpty}
          />

          <CustomDatePicker date={date}
                            isError={eventExists}
                            onChange={date => {
                              setDate(parseDate(date));
                              checkedEventExists(parseDate(date));
                            }}
          />

          <Input  className={styles.field}
                  placeholder='Имена участников'
                  value={names}
                  onChange={(_name, value) => setNames(value)}
          />

          <textarea className={styles.description}
                    placeholder='Описание'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
          />

          <p  className={cx({
                errorPrompt: true,
                showError: eventEmpty,
                eventEmpty
              })}
          >
            Поле события должно быть заполнено
          </p>

          <p  className={cx({
                errorPrompt: true,
                showError: eventExists,
                eventExists
              })}
          >
            Событие существует на введенную дату
          </p>
        </div>


        {
          !(props.activeCell === props.events[date]?.date || date === props.events[date]?.date) ?
          <div className={styles.wrapperButtons}>
            <ButtonIcon className='success'
                        icon='fa fa-pencil'
                        text='Создать'
                        onClick={() => onSubmit('createEvent')}
            />

            <ButtonIcon icon='fa fa-times'
                        text='Отменить'
                        onClick={onClose}
            />
          </div>

            :

          <div className={styles.wrapperButtons}>
            <ButtonIcon className='primary'
                        icon='fa fa-cog'
                        text='Перезаписать'
                        onClick={() => onSubmit('editEvent')}
            />

            <ButtonIcon icon='fa fa-times'
                        text='Отменить'
                        onClick={onClose}
            />

            <ButtonIcon className='danger'
                        icon='fa fa-trash'
                        text='Удалить'
                        onClick={onRemove}
            />
          </div>
        }
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
