import classNames from 'classnames/bind';
import { days } from '../../constants';
import styles from './CalendarCell.module.sass';

const cx = classNames.bind(styles);

export const CalendarCell = ({date, number, event, activeCell, onActive}) => {
  let displayedDate  = number <= 7 ?
    `${days[new Date(date).getDay()]} ${new Date(date).getDate()}` :
    new Date(date).getDate();

  const onActiveCell = () => onActive(date);

  return (
    <div  className={cx({
          wrapperCell: true,
          event: event?.title,
          activeCell: activeCell === date
        })}
          onClick={onActiveCell}
    >
      <p className={styles.day}>
        {displayedDate}
      </p>

      {event?.title && <h3>{event.title}</h3>}
      {event?.names && <p>{event.names}</p>}
    </div>
  );
};
