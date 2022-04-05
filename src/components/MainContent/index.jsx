import React from 'react';
import { connect } from 'react-redux';
import Calendar from '../Calendar';
import Popup from '../Popup';
import { visiblePopup } from '../../redux/actions/popup';
import styles from './MainContent.module.sass';

const MainContent = ({ visiblePopup, isVisiblePopup}) => {
  const onClickCell = isVisible => {
    visiblePopup(isVisible);
  };

  return (
    <div className={styles.container}>
      <Calendar
        onClickCell={onClickCell}
      />
      <Popup
        isVisible={isVisiblePopup}
        close={onClickCell}
      />
    </div>
  );
}

const state = state => ({
  isVisiblePopup: state.popup.isVisible
});

const dispatch = {
  visiblePopup
};

export default connect(state, dispatch)(MainContent);
