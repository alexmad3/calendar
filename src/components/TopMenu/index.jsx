import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from '../../common/Button';
import { Search } from '../Search';
import PopupEvent from '../PopupEvent';
import { setSelectedDate } from '../../redux/actions/calendar';
import { months } from '../../constants';
import styles from './TopMenu.module.sass';

const TopMenu = ({setSelectedDate, selectedDate}) => {
  const [isActivePopup, setActivePopup] = useState(false),
        [searchValue, setSearchValue] = useState(''),
        [displayDate, setDisplayDate] = useState('');

  const onVisiblePopupEvent = () => {
    setActivePopup(!isActivePopup);
  };

  const onChangeSearch = value => {
    setSearchValue(value);
  };

  const setterDisplayDate = useCallback((date = new Date()) => {
    setSelectedDate(date);
    setDisplayDate(`${months[date.getMonth()]} ${date.getFullYear()}`);
  }, [setSelectedDate]);

  useEffect(() => setterDisplayDate(), [setterDisplayDate]);

  const changeMonth = sign => {
    if (!sign) {
      setterDisplayDate();
      return;
    }

    if (sign === '+') {
      setterDisplayDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)));
    } else {
      setterDisplayDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)));
    }
  };

  return (
    <header>
      <div className={styles.container}>
        <div className={styles.actions}>
          <Button
            colorScheme='primary'
            size='l'
            isActive={isActivePopup}
            onClick={onVisiblePopupEvent}
          >
            Добавить
          </Button>

          <Button
            colorScheme='primary'
            size='l'
            onClick={() => window.location.reload()}
          >
            Обновить
          </Button>
        </div>

        <div className={styles.actions}>
          <Button
            icon='angle16'
            iconClass='rotate270'
            onClick={() => changeMonth('-')}
          />

          <span className={styles.date}>{displayDate}</span>

          <Button
            icon='angle16'
            iconClass='rotate90'
            onClick={() => changeMonth('+')}
          />

          <Button onClick={() => changeMonth()}>
            Текущий месяц
          </Button>
        </div>

        <PopupEvent
          active={isActivePopup}
          onVisible={() => setActivePopup(false)}
        />

        <Search
          value={searchValue}
          onChangeSearch={onChangeSearch}
        />
      </div>
    </header>
  );
};

const state = state => ({
  selectedDate: state.calendar.selectedDate
});

const dispatch = {
  setSelectedDate
};

export default connect(state, dispatch)(TopMenu);
