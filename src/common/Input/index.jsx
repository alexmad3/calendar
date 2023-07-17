import React from 'react';
import classNames from 'classnames/bind';
import styles from './Input.module.sass';

const cx = classNames.bind(styles);

export const Input = props =>
  <input
    className={props.className + ' ' + cx({input: true, error: props.isError})}
    placeholder={props.placeholder}
    value={props.value}
    onChange={e => props.onChange(e.target.value)}
    onBlur={props.onBlur}
  />;
