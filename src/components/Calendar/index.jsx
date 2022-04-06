import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CalendarCell } from '../../common/CalendarCell';
import { setActiveCell, setPositionPopup, visiblePopup, setDateToPicker } from '../../redux/actions/popup';
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

  const setActiveCell = (e, number, date) => {
    if (date !== props.activeCell) {
      props.onClickCell(true);
      props.setActiveCell(date);
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
              event={el.event}
              activeCell={props.activeCell}
              onActive={setActiveCell}
              number={i + 1}
              key={+el.date}
            />
          } else {
            return <CalendarCell
              day={new Date(el.date).getDate()}
              date={+el.date}
              event={el.event}
              activeCell={props.activeCell}
              onActive={setActiveCell}
              number={i + 1}
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
  setEvents,
  setDateToPicker
};

export default connect(state, dispatch)(Calendar);
