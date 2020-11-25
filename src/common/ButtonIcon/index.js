import styles from './ButtonIcon.module.sass';

export const ButtonIcon = (props) => {
    return(
        <button className={styles.btn} onClick={props.onClick}>
            {props.icon ? <i className={props.icon}></i> : null}
            {props.text}
        </button>
    );
};
