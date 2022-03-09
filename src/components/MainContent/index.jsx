import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ButtonIcon } from '../../common/ButtonIcon';
import Calendar from '../Calendar';
import Popup from '../Popup';
import { visiblePopup } from '../../redux/actions/popup';
import { setCurrentDate } from '../../redux/actions/calendar';
import styles from './MainContent.module.sass';

const MainContent = props => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState('');
  
    const setterDisplayDate = useCallback(() => {
      props.setCurrentDate(currentDate);
      let date = new Date(currentDate);
      setDisplayDate(`${props.months[date.getMonth()]} ${date.getFullYear()}`);
    }, [currentDate, props]);

  useEffect(() => setterDisplayDate(), [setterDisplayDate]);

  const changeMonth = sign => {
    let date = new Date(currentDate);
    if (sign === '+') {
      setCurrentDate(() => date.setMonth(date.getMonth() + 1));
      setterDisplayDate();
    } else {
      setCurrentDate(() => date.setMonth(date.getMonth() - 1));
      setterDisplayDate()
    }
  };

  const currentMonth = () => {
    currentDate(new Date());
    setterDisplayDate();
  };

  const onClickCell = isVisible => {
    props.visiblePopup(isVisible);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapperNavigation}>
        <ButtonIcon icon='fa fa-caret-left' onClick={() => changeMonth('-')} />
        <span className={styles.date}>{displayDate}</span>
        <ButtonIcon icon='fa fa-caret-right' onClick={() => changeMonth('+')} />
        <ButtonIcon text='Сегодня' onClick={currentMonth} />
      </div>
      <Calendar
        date={currentDate}
        onClickCell={onClickCell}
      />
      <Popup
        isVisible={props.isVisiblePopup}
        close={onClickCell}
      />
    </div>
  );
}

const state = state => ({
  isVisiblePopup: state.popup.isVisible,
  months: state.calendar.months
});

const dispatch = {
  visiblePopup,
  setCurrentDate
};

export default connect(state, dispatch)(MainContent);
