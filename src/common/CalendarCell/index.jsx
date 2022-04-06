import classNames from 'classnames/bind';
import styles from './CalendarCell.module.sass';

const cx = classNames.bind(styles);

export const CalendarCell = ({day, date, number, event, activeCell, onActive}) =>
  <div
    className={cx({
      wrapperCell: true,
      event: event?.title,
      activeCell: activeCell === date
    })}
    onClick={(e) => onActive(e, number, date)}
  >
    <p className={styles.day}>
      {day}
    </p>

    {event?.title && <h3>{event.title}</h3>}
    {event?.names && <p>{event.names}</p>}
  </div>;
