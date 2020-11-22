import styles from './Search.module.sass';

export const Search = (props) => {

    return(
        <div className={styles.wrapperSearch}>
            <i className={'fa fa-search ' + styles.iconSearch}></i>
            <input className={styles.search} value={props.value} placeholder='Событие, дата или участник' />
        </div>
    );
};
