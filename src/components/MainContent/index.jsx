import React from 'react';
import { connect } from 'react-redux';
import Calendar from '../Calendar';
import ModalEvent from '../ModalEvent';
import { visibleModalEvent } from '../../redux/actions/modalEvent';
import styles from './MainContent.module.sass';

const MainContent = ({ visibleModalEvent, isVisibleModalEvent}) => {
  const onClickCell = isVisible => {
    visibleModalEvent(isVisible);
  };

  return (
    <div className={styles.container}>
      <Calendar onClickCell={onClickCell} />

      <ModalEvent
        isVisible={isVisibleModalEvent}
        close={onClickCell}
      />
    </div>
  );
}

const state = state => ({
  isVisibleModalEvent: state.modalEvent.isVisible
});

const dispatch = {
  visibleModalEvent
};

export default connect(state, dispatch)(MainContent);
