import { connect } from 'react-redux';
import { getEvents } from './redux/actions/events';
import Header from './components/Header';
import MainContent from './components/MainContent';
import { useEffect } from 'react';

const App = ({getEvents}) => {

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <>
      <Header />
      <MainContent />
    </>
  );
};

export default connect(null, {getEvents})(App);
