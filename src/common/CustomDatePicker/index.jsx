import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './CustomDatePicker.module.sass';

export const CustomDatePicker = ({date, onChange, isError}) => {
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <fieldset
      className={styles.fieldset}
      style={isError ? {borderColor: 'red'} : null}
      onClick={onClick}
      tabIndex='0'
    >
      <legend className={styles.legend} style={isError ? {color: 'red'} : null}>Дата</legend>
      <input
        className={styles.input}
        ref={ref}
        value={value}
        readOnly
        onFocus={e => e.target.parentNode.focus()}
      />
      <i className={'fa fa-calendar ' + styles.iconCalendar}></i>
    </fieldset>
  ));

  return (
    <div className={styles.wrapperDatePicker}>
      <DatePicker
        selected={date}
        onChange={date => onChange(date)}
        customInput={<ExampleCustomInput />}
        dateFormat="dd.MM.yyyy"
        classNames={styles.error}
      />
    </div>
  );
}
