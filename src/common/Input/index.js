import React from 'react';
import styles from './Input.module.sass';

export const Input = (props) => {
    return(
        <input
            className={`${styles.input} ${props.mt ? styles.mt : ''}`}
            placeholder={props.placeholder}
            value={props.value}
            name={props.name}
            onChange={(e) => props.onChange(props.name, e.target.value)}
        />
    );
};
