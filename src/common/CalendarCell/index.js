import styles from './CalendarCell.module.sass';

export const CalendarCell = (props) => {
    // console.log(props)
    return(
        <div
            className={`${styles.wrapperCell} ${props.title ? styles.event : ''} ${props.activeCell === props.id ? styles.activeCell : ''} `}
            onClick={(e) => props.onActive(e, props.id, props.number)}
        >
            <p className={styles.day}>
                {props.day}
            </p>
            {
                props.title &&
                    <>
                        <p className={styles.title}>{props.title}</p>
                        <p>{props.names}</p>
                    </>
            }
        </div>
    );
};
