import { connect } from 'react-redux';
import { getEvents } from './redux/actions/events';
import TopMenu from './components/TopMenu';
import MainContent from './components/MainContent';
import { useEffect } from 'react';

const App = ({getEvents}) => {

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <>
      <TopMenu />
      <MainContent />
    </>
  );
};

export default connect(null, {getEvents})(App);
