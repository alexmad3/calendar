import styles from './Button.module.sass';

export const Button = (props) => {
    return(
        <button className={styles.button} onClick={() => props.onClick()}>
            {props.text}
        </button>
    );
};
