import React from 'react';
import styles from './Input.module.sass';

export const Input = (props) => {
    return(
        <input
            className={styles.input}
            placeholder={props.placeholder}
            value={props.value}
            name={props.name}
            onChange={() => props.onChange(props.name, props.value)}
        />
    );
};