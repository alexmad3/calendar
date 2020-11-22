import React from 'react';
import styles from './MainContent.module.sass';

class MainContent extends React.Component {
    constructor(props){
        super(props);
    };

    render() {
        return(
            <div className={styles.container}></div>
        );
    };
}

export default MainContent;