import React from 'react';
import styles from './Input.module.sass';

export const Input = props =>
  <input
    className={
      `${styles.input} 
      ${props.mt ? styles.mt : ''} 
      ${props.isError ? styles.error : ''}`
    }
    placeholder={props.placeholder}
    value={props.value}
    name={props.name}
    onChange={(e) => props.onChange(props.name, e.target.value)}
    onBlur={props.onBlur}
  />;