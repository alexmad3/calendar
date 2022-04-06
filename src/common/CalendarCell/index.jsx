import classNames from 'classnames/bind';
import { days } from '../../constants';
import styles from './CalendarCell.module.sass';

const cx = classNames.bind(styles);

export const CalendarCell = ({date, number, event, activeCell, onActive}) =>
  <div  className={cx({
          wrapperCell: true,
          event: event?.title,
          activeCell: activeCell === date
        })}
        onClick={(e) => onActive(e, number, date)}
  >
    <p className={styles.day}>
      {
        number <= 7 ?
          `${days[new Date(date).getDay()]} ${new Date(date).getDate()}`
            :
          new Date(date).getDate()
      }
    </p>

    {event?.title && <h3>{event.title}</h3>}
    {event?.names && <p>{event.names}</p>}
  </div>;
