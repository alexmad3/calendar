import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from '../../common/Button';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Search } from '../Search';
import ShortPopup from '../ShortPopup';
import { setSelectedDate } from '../../redux/actions/calendar';
import { months } from '../../constants';
import styles from './Header.module.sass';

const Header = ({setSelectedDate, selectedDate}) => {
  const [activePopup, setActivePopup] = useState(false),
        [searchValue, setSearchValue] = useState(''),
        [displayDate, setDisplayDate] = useState('');

  const onVisibleShortPopup = () => {
    setActivePopup(!activePopup);
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
        <div>
          <Button text={'Добавить'}
                  active={activePopup}
                  onClick={onVisibleShortPopup}
          />

          <Button text={'Обновить'}
                  onClick={() => window.location.reload()}
          />
        </div>

        <div className={styles.controlButtons}>
          <ButtonIcon icon='fa fa-caret-left'
                      onClick={() => changeMonth('-')}
          />
          <span className={styles.date}>{displayDate}</span>
          <ButtonIcon icon='fa fa-caret-right'
                      onClick={() => changeMonth('+')}
          />
          <ButtonIcon text='Текущий месяц'
                      onClick={() => changeMonth()}
          />
        </div>

        <ShortPopup active={activePopup}
                    onVisible={() => setActivePopup(false)}
        />

        <Search value={searchValue}
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

export default connect(state, dispatch)(Header);
