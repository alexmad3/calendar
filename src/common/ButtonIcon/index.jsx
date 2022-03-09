import styles from './ButtonIcon.module.sass';

export const ButtonIcon = props =>
  <button
    className={styles.btn}
    onClick={props.onClick}
  >
    {props.icon && <i className={props.icon}></i>}
    {props.text}
  </button>;