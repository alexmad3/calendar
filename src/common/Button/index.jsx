import styles from './Button.module.sass';

export const Button = props =>
  <button
    className={`${styles.button} ${props.active ? styles.active : ''}`}
    onClick={() => props.onClick()}
  >
    {props.text}
  </button>;
