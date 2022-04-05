import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CalendarCell } from '../../common/CalendarCell';
import { setActiveCell, setPositionPopup, visiblePopup, setDateToPicker } from '../../redux/actions/popup';
import { getIdEvent } from '../../redux/actions/calendar';
import { setEvents } from '../../redux/actions/events';
import { days } from '../../constants';
import styles from './Calendar.module.sass';

const Calendar = props => {
  const [displayCell, setDisplayCell] = useState([]);

  const calendarCalculation = () => {
    let firstDay = new Date(new Date(props.selectedDate).setDate(1)).getDay(),
        year = new Date(props.selectedDate).getFullYear(),
        month = new Date(props.selectedDate).getMonth(),
        monthData = [],
        lastDate;

    if (firstDay === 0) {
      firstDay = 7;
    }

    prevDays:
    for (let i = firstDay; i > 1; i--) {
      for (let j = 0; j < props.events.length; j++) {
        if (new Date(year, month, (i * (-1)) + 2).setHours(0, 0, 0, 0) === new Date(props.events[j].date).setHours(0, 0, 0, 0)) {
          monthData.push({
            date: new Date(new Date(year, month, (i * (-1)) + 2)),
            title: props.events[j].title,
            names: props.events[j].names,
            idEvent: props.events[j].id
          });
          continue prevDays;
        }
      }
      monthData.push({ date: new Date(new Date(year, month, (i * (-1)) + 2)) });
    }

    presDays:
    for (let i = 1; i <= 31; i++) {
      if (i > 28 && (new Date(new Date(year, month, i)).getMonth() !== month)) {
        lastDate = i - 1;
        break;
      } else {
        lastDate = i;
        for (let j = 0; j < props.events.length; j++) {
          if (new Date(year, month, i).setHours(0, 0, 0, 0) === new Date(props.events[j].date).setHours(0, 0, 0, 0)) {
            monthData.push({
              date: new Date(new Date(year, month, i)),
              title: props.events[j].title,
              names: props.events[j].names,
              idEvent: props.events[j].id
            });
            continue presDays;
          }
        }
        monthData.push({ date: new Date(new Date(year, month, i)) });
      }
    }

    if (new Date(year, month, lastDate).getDay() !== 0) {
      futDays:
      for (let i = 1; i <= 7 - new Date(year, month, lastDate).getDay(); i++) {
        for (let j = 0; j < props.events.length; j++) {
          if (new Date(year, month + 1, i).setHours(0, 0, 0, 0) === new Date(props.events[j].date).setHours(0, 0, 0, 0)) {
            monthData.push({
              date: new Date(new Date(year, month + 1, i)),
              title: props.events[j].title,
              names: props.events[j].names,
              idEvent: props.events[j].id
            });
            continue futDays;
          }
        }
        monthData.push({ date: new Date(new Date(year, month + 1, i)) });
      }
    }

    setDisplayCell(monthData);
  };

  useEffect(() => {
    calendarCalculation();
    props.setEvents();
  }, []); // max update events

  useEffect(() => {
    calendarCalculation();
    props.visiblePopup(false);
    props.setActiveCell(null);
  }, [props.selectedDate, props.events]);

  const setActiveCell = (e, activeCell, number, idEvent = null, date) => {
    if (activeCell !== props.activeCell || idEvent) {
      props.onClickCell(true);
      props.setActiveCell(activeCell);
      props.setDateToPicker(date);

      const parent = e.target.parentNode.getBoundingClientRect(),
            element = e.target.getBoundingClientRect();

      let wrapperTop,
          wrapperLeft,
          horizontalDirection,
          verticalDirection,
          lines = document.querySelector(`.${styles.calendar}`).children.length / 7;

      if ((parent.right - (element.left + 576 + e.target.offsetWidth)) > 0) {
        wrapperLeft = element.left + 30 + e.target.offsetWidth;
        horizontalDirection = 'left';
      } else {
        wrapperLeft = element.left - 576;
        horizontalDirection = 'right';
      }

      if (number / 7 <= lines - 2) {
        if (number % 7 === 0) {
          wrapperTop = Math.floor(number / 7) * 250 + 112 - 250;
        } else {
          wrapperTop = Math.floor(number / 7) * 250 + 112;
        }
        verticalDirection = 'top';
      } else {
        if (number % 7 === 0) {
          wrapperTop = (Math.floor(number / 7) * 250 + 112) - (482 - 250) - 250;
        } else {
          wrapperTop = (Math.floor(number / 7) * 250 + 112) - (482 - 250);
        }
        verticalDirection = 'bottom';
      }

      props.setPositionPopup({ wrapperTop, wrapperLeft, horizontalDirection, verticalDirection });
      props.getIdEvent(idEvent);
    }
  };

  return (
    <div className={styles.calendar}>
      {
        displayCell.map((el, i) => {
          if (i < 7) {
            return <CalendarCell
              day={`${days[new Date(el.date).getDay()]} ${new Date(el.date).getDate()}`}
              date={+el.date}
              title={el.title}
              names={el.names}
              id={+el.date}
              activeCell={props.activeCell}
              onActive={setActiveCell}
              number={i + 1}
              idEvent={el.idEvent}
              key={+el.date}
            />
          } else {
            return <CalendarCell
              day={new Date(el.date).getDate()}
              date={+el.date}
              title={el.title}
              names={el.names}
              id={+el.date}
              activeCell={props.activeCell}
              onActive={setActiveCell}
              number={i + 1}
              idEvent={el.idEvent}
              key={+el.date}
            />
          }
        })
      }
    </div>
  );
};

const state = state => ({
  events: state.events.events,
  activeCell: state.popup.activeCell,
  selectedDate: state.calendar.selectedDate
});

const dispatch = {
  setActiveCell,
  setPositionPopup,
  visiblePopup,
  getIdEvent,
  setEvents,
  setDateToPicker
};

export default connect(state, dispatch)(Calendar);
