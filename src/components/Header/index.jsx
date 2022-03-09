import React, { useState } from 'react';
import { Button } from '../../common/Button';
import { Search } from '../Search';
import ShortPopup from '../ShortPopup';
import styles from './Header.module.sass';

const Header = () => {
  const [activePopup, setActivePopup] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const createEvent = () => {
    setActivePopup(!activePopup);
  };

  const onChangeSearch = value => {
    setSearchValue(value);
  };

  return (
    <header>
      <div className={styles.container}>
        <div>
          <Button
            text={'Добавить'}
            active={activePopup}
            onClick={createEvent}
          />

          <Button
            text={'Обновить'}
            onClick={() => window.location.reload()}
          />
        </div>

        <ShortPopup
          active={activePopup}
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

export default Header;
