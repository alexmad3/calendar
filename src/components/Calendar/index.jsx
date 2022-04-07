import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CalendarCell } from '../../common/CalendarCell';
import {
  setActiveCell,
  visibleModalEvent,
  setDateToPicker
} from '../../redux/actions/modalEvent';
import styles from './Calendar.module.sass';

const Calendar = props => {
  const [displayCell, setDisplayCell] = useState([]);

  const calendarCalculation = useCallback(() => {
    let firstDay = new Date(new Date(props.selectedDate).setDate(1)).getDay(),
        year = new Date(props.selectedDate).getFullYear(),
        month = new Date(props.selectedDate).getMonth(),
        monthData = [],
        lastDate;

    if (firstDay === 0) {
      firstDay = 7;
    }

    for (let i = firstDay; i > 1; i--) {
      monthData.push({
        date: new Date(new Date(year, month, (i * (-1)) + 2)),
        event: props.events[+(new Date(year, month, (i * (-1)) + 2))]
      });
    }

    for (let i = 1; i <= 31; i++) {
      if (i > 28 && (new Date(new Date(year, month, i)).getMonth() !== month)) {
        lastDate = i - 1;
        break;
      } else {
        lastDate = i;

        monthData.push({
          date: new Date(new Date(year, month, i)),
          event: props.events[+(new Date(year, month, i))]
        });
      }
    }

    if (new Date(year, month, lastDate).getDay() !== 0) {
      for (let i = 1; i <= 7 - new Date(year, month, lastDate).getDay(); i++) {
        monthData.push({
          date: new Date(new Date(year, month + 1, i)),
          event: props.events[+(new Date(year, month + 1, i))]
        });
      }
    }

    setDisplayCell(monthData);
  }, [props.selectedDate, props.events]);

  useEffect(() => {
    calendarCalculation();
    props.visibleModalEvent(false);
    props.setActiveCell(null);
  }, [calendarCalculation]);

  const setActiveCell = date => {
    if (date !== props.activeCell) {
      props.onClickCell(true);
      props.setActiveCell(date);
      props.setDateToPicker(date);
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
                            activeCell={props.activeCell}
                            onActive={setActiveCell}
                            number={i + 1}
                            key={+el.date}
              />
            );
          } else {
            return (
              <CalendarCell date={+el.date}
                            event={el.event}
                            activeCell={props.activeCell}
                            onActive={setActiveCell}
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
