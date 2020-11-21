import styles from './Search.module.sass';
import search from '../../icons/search.png';

export const Search = (props) => {

    return(
        <div className={styles.wrapperSearch}>
            <img className={styles.iconSearch} src={search} alt='Поиск'></img>
            <input className={styles.search} value={props.value} placeholder='Событие, дата или участник' />
        </div>
    );
};
