import React, { forwardRef } from 'react';
import classNames from 'classnames/bind';
import DatePicker from 'react-datepicker';
import { Icon } from '../Icon';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './CustomDatePicker.module.sass';

const cx = classNames.bind(styles);

export const CustomDatePicker = ({date, onChange, isError}) => {
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <fieldset
      className={cx({
        fieldset: true,
        errorFieldset: isError
      })}
      onClick={onClick}
      tabIndex='0'
    >
      <legend
        className={cx({
          legend: true,
          errorLegend: isError
        })}
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
