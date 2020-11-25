import styles from './CalendarCell.module.sass';

export const CalendarCell = (props) => {
    console.log(props)
    return(
        <div className={styles.wrapperCell}>
            <div className={styles.day}>
                {props.day}
            </div>
        </div>
    );
};
