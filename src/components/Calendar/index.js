import React from 'react';
import { connect } from 'react-redux';
import { CalendarCell } from '../../common/CalendarCell';
import { setActiveCell, setPositionPopup, visiblePopup } from '../../redux/actions/popup';
import { getIdEvent } from '../../redux/actions/calendar';
import { setEvents } from '../../redux/actions/events';
import styles from './Calendar.module.sass';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthData: [],
      displayCell: [],
    };

    this.days = [
      'Воскресенье, ',
      'Понедельник, ',
      'Вторник, ',
      'Среда, ',
      'Четверг, ',
      'Пятница, ',
      'Суббота, '
    ];
  };

  componentDidMount() {
    this.calendarCalculation();
    this.props.setEvents();
  };

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.date || prevProps.events !== this.props.events) {
      this.calendarCalculation();
      this.props.visiblePopup(false);
      this.props.setActiveCell(null);
    }
  }

  calendarCalculation = () => {
    let firstDay = new Date(new Date(this.props.date).setDate(1)).getDay(),
      year = new Date(this.props.date).getFullYear(),
      month = new Date(this.props.date).getMonth(),
      monthData = [],
      lastDate;

    if (firstDay === 0) {
      firstDay = 7;
    }

    prevDays:
    for (let i = firstDay; i > 1; i--) {
      for (let j = 0; j < this.props.events.length; j++) {
        if (new Date(year, month, (i * (-1)) + 2).setHours(0, 0, 0, 0) === new Date(this.props.events[j].date).setHours(0, 0, 0, 0)) {
          monthData.push({
            date: new Date(new Date(year, month, (i * (-1)) + 2)),
            title: this.props.events[j].title,
            names: this.props.events[j].names,
            idEvent: this.props.events[j].id
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
        for (let j = 0; j < this.props.events.length; j++) {
          if (new Date(year, month, i).setHours(0, 0, 0, 0) === new Date(this.props.events[j].date).setHours(0, 0, 0, 0)) {
            monthData.push({
              date: new Date(new Date(year, month, i)),
              title: this.props.events[j].title,
              names: this.props.events[j].names,
              idEvent: this.props.events[j].id
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
        for (let j = 0; j < this.props.events.length; j++) {
          if (new Date(year, month + 1, i).setHours(0, 0, 0, 0) === new Date(this.props.events[j].date).setHours(0, 0, 0, 0)) {
            monthData.push({
              date: new Date(new Date(year, month + 1, i)),
              title: this.props.events[j].title,
              names: this.props.events[j].names,
              idEvent: this.props.events[j].id
            });
            continue futDays;
          }
        }
        monthData.push({ date: new Date(new Date(year, month + 1, i)) });
      }
    }

    this.setState({ displayCell: monthData });
  };

  setActiveCell = (e, activeCell, number, idEvent = null) => {
    if (activeCell !== this.props.activeCell || idEvent) {
      this.props.onClickCell(true);
      this.props.setActiveCell(activeCell);

      const parent = e.target.parentNode.getBoundingClientRect(),
        element = e.target.getBoundingClientRect();

      let wrapperTop,
        wrapperLeft,
        horizontalDirection,
        verticalDirection,
        lines = document.querySelector(`.${styles.calendar}`).children.length / 7;

      if ((parent.right - (element.left + 464 + e.target.offsetWidth)) > 0) {
        wrapperLeft = element.left + 30 + e.target.offsetWidth;
        horizontalDirection = 'left';
      } else {
        wrapperLeft = element.left - 464;
        horizontalDirection = 'right';
      }

      if (number / 7 <= lines - 2) {
        if (number % 7 === 0) {
          wrapperTop = Math.floor(number / 7) * 250 + 208 - 250;
        } else {
          wrapperTop = Math.floor(number / 7) * 250 + 208;
        }
        verticalDirection = 'top';
      } else {
        if (number % 7 === 0) {
          wrapperTop = (Math.floor(number / 7) * 250 + 208) - (514 - 250) - 250;
        } else {
          wrapperTop = (Math.floor(number / 7) * 250 + 208) - (514 - 250);
        }
        verticalDirection = 'bottom';
      }

      this.props.setPositionPopup({ wrapperTop, wrapperLeft, horizontalDirection, verticalDirection });
      this.props.getIdEvent(idEvent);
    }
  };

  render() {
    return (
      <div className={styles.calendar}>
        {
          this.state.displayCell.map((el, i) => {
            if (i < 7) {
              return <CalendarCell
                day={`${this.days[new Date(el.date).getDay()]} ${new Date(el.date).getDate()}`}
                title={el.title}
                names={el.names}
                id={+el.date}
                activeCell={this.props.activeCell}
                onActive={this.setActiveCell}
                number={i + 1}
                idEvent={el.idEvent}
                key={i}
              />
            } else {
              return <CalendarCell
                day={new Date(el.date).getDate()}
                title={el.title}
                names={el.names}
                id={+el.date}
                activeCell={this.props.activeCell}
                onActive={this.setActiveCell}
                number={i + 1}
                idEvent={el.idEvent}
                key={i}
              />
            }
          })
        }
      </div>
    );
  };
};

const state = state => {
  return {
    events: state.events.events,
    activeCell: state.popup.activeCell
  };
};

const dispatch = {
  setActiveCell,
  setPositionPopup,
  visiblePopup,
  getIdEvent,
  setEvents
};

export default connect(state, dispatch)(Calendar);
