import React from 'react';
import { connect } from 'react-redux';
import { Button } from '../../common/Button';
import { Search } from '../Search';
import ShortPopup from '../ShortPopup';
import styles from './Header.module.sass';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePopup: false
        };
    };

    createEvent = () => {
        this.setState({activePopup: !this.state.activePopup});
    };

    render() {
        return(
            <header>
                <div className={styles.container}>
                    <div className={styles.wrapperButtons}>
                        <Button
                            text={'Добавить'}
                            active={this.state.activePopup}
                            onClick={this.createEvent}
                        />

                        <Button
                            text={'Обновить'}
                            onClick={() => window.location.reload()}
                        />
                    </div>

                    <ShortPopup
                        active={this.state.activePopup}
                        onVisible={() => this.setState({activePopup: false})}
                    />

                    <Search />
                </div>
            </header>
        );
    };
};

export default connect(null)(Header);
