import { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { Input } from '../../common/Input';
import { Icon } from '../../common/Icon';
import {
  setActiveCell,
  visibleModalEvent,
  setDateToPicker,
} from '../../redux/actions/modalEvent';
import styles from './Search.module.sass';

const cx = classNames.bind(styles);

const Item = ({
  event,
  onClick,
}) =>
  <span
    className={styles.item}
    title={`${new Date(event.date).toLocaleDateString()} ${event.names} ${event.title}`}
    onClick={typeof onClick === 'function' ? () => onClick() : null}
  >
    { `${new Date(event.date).toLocaleDateString()} ${event.names} ${event.title}` }
  </span>;

const Search = ({
  events,
  visibleModalEvent,
  setActiveCell,
  setDateToPicker,
}) => {
  const [search, setSearch] = useState(''),
        [foundEvents, setFoundedEvents] = useState([]);

  const onChangeSearch = value => {
    setSearch(value);

    if (value.length > 0) {
      setFoundedEvents(events.filter(event => {
        for (const prop in event) {
          if (prop === 'date' && new Date(event[prop]).toLocaleDateString().indexOf(value) !== -1) {
            return true;
          };

          if (prop !== 'date' && event[prop].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
            return true;
          }
        }
        return false;
      }));
    } else {
      setFoundedEvents([]);
    }
  };

  const selectEvent = date => {
    visibleModalEvent(true);
    setActiveCell(date);
    setDateToPicker(date);
    clearSearch();
  };

  const clearSearch = () => setSearch('');

  return (
    <div className={styles.search}>
      <Icon
        className={`${styles.iconSearch} indentRight`}
        name='search24'
      />

      <Input
        className={styles.field}
        value={search}
        placeholder='Поиск события'
        onChange={onChangeSearch}
      />

      <Icon
        className={cx({
          iconClose: true,
          visibleIconClose: !!search.length
        })}
        name='close16'
        onClick={clearSearch}
      />

      <div
        className={cx({
          items: true,
          visibleItems: !!search.length
        })}
      >
        {
          !foundEvents.length && search.length ?
            <span
              className={styles.item}
              data-not-found
            >
              События не найдены
            </span>

              :

            foundEvents.map((event, i) =>
              i < 5 ? <Item
                  key={event.date}
                  event={event}
                  onClick={() => selectEvent(+event.date)}
                />
                  :
                null
            )
        }
      </div>
    </div>
  );
};

const state = state => ({
  events: state.events.events,
});

const dispatch = {
  visibleModalEvent,
  setActiveCell,
  setDateToPicker
};

export default connect(state, dispatch)(Search);
