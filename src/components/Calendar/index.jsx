import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CalendarCell } from '../../common/CalendarCell';
import {
  setActiveCell,
  visibleModalEvent,
  setDateToPicker
} from '../../redux/actions/modalEvent';
import styles from './Calendar.module.sass';

const Calendar = ({selectedDate, events, activeCell, setDateToPicker, setActiveCell, visibleModalEvent, onClickCell}) => {
  const [displayCell, setDisplayCell] = useState([]);

  const calendarCalculation = useCallback(() => {
    let firstDay = new Date(new Date(selectedDate).setDate(1)).getDay(),
        year = new Date(selectedDate).getFullYear(),
        month = new Date(selectedDate).getMonth(),
        monthData = [],
        lastDate;

    if (firstDay === 0) {
      firstDay = 7;
    }

    for (let i = firstDay; i > 1; i--) {
      monthData.push({
        date: new Date(year, month, (i * (-1)) + 2),
        event: events[+(new Date(year, month, (i * (-1)) + 2))]
      });
    }

    for (let i = 1; i <= 31; i++) {
      if (i > 28 && (new Date(new Date(year, month, i)).getMonth() !== month)) {
        lastDate = i - 1;
        break;
      } else {
        lastDate = i;

        monthData.push({
          date: new Date(year, month, i),
          event: events[+(new Date(year, month, i))]
        });
      }
    }

    if (new Date(year, month, lastDate).getDay() !== 0) {
      for (let i = 1; i <= 7 - new Date(year, month, lastDate).getDay(); i++) {
        monthData.push({
          date: new Date(year, month + 1, i),
          event: events[+(new Date(year, month + 1, i))]
        });
      }
    }

    setDisplayCell(monthData);
  }, [selectedDate, events]);

  useEffect(() => {
    calendarCalculation();
    visibleModalEvent(false);
    setActiveCell(null);
  }, [calendarCalculation, visibleModalEvent, setActiveCell]);

  const onSelectCell = date => {
    if (date !== activeCell) {
      onClickCell(true);
      setActiveCell(date);
      setDateToPicker(date);
    }
  };

  return (
    <div className={styles.calendar}>
      {
        displayCell.map((el, i) => {
          if (i < 7) {
            return (
              <CalendarCell date={+el.date}
                            event={el.event}
                            activeCell={activeCell}
                            onActive={onSelectCell}
                            number={i + 1}
                            key={+el.date}
              />
            );
          } else {
            return (
              <CalendarCell date={+el.date}
                            event={el.event}
                            activeCell={activeCell}
                            onActive={onSelectCell}
                            number={i + 1}
                            key={+el.date}
              />
            );
          }
        })
      }
    </div>
  );
};

const state = state => ({
  events: state.events.events,
  activeCell: state.modalEvent.activeCell,
  selectedDate: state.calendar.selectedDate
});

const dispatch = {
  setActiveCell,
  visibleModalEvent,
  setDateToPicker
};

export default connect(state, dispatch)(Calendar);
