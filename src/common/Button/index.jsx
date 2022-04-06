import classNames from 'classnames/bind';
import styles from './Button.module.sass';

const cx = classNames.bind(styles);

export const Button = props =>
  <button className={cx({
            button: true,
            active: props.active
          })}
          onClick={() => props.onClick()}
  >
    {props.text}
  </button>;
