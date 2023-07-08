import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { Icon } from '../Icon';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './CustomDatePicker.module.sass';

export const CustomDatePicker = ({date, onChange, isError}) => {
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <fieldset
      className={styles.fieldset}
      style={isError ? {borderColor: 'red'} : null}
      onClick={onClick}
      tabIndex='0'
    >
      <legend
        className={styles.legend}
        style={isError ? {color: 'red'} : null}
      >
        Дата
      </legend>

      <input
        className={styles.input}
        ref={ref}
        value={value}
        readOnly
        onFocus={e => e.target.parentNode.focus()}
      />

      <Icon
        className={styles.iconCalendar}
        name="calendar24"
      />
    </fieldset>
  ));

  return (
    <div className={styles.wrapperDatePicker}>
      <DatePicker
        selected={date}
        onChange={date => onChange(date)}
        customInput={<CustomInput />}
        dateFormat='dd.MM.yyyy'
      />
    </div>
  );
};
