import styles from './Button.module.sass';

export const Button = (props) => {
    return(
        <button className={styles.button}>
            {props.text}
        </button>
    );
};
