import { Input } from '../../common/Input';
import styles from './Search.module.sass';

export const Search = props =>
  <div className={styles.wrapperSearch}>
    <i className={'fa fa-search ' + styles.iconSearch}></i>
    <Input
      value={props.value}
      placeholder='Событие, дата или участник'
      onChange={(_name, value) => props.onChangeSearch(value)}
    />
  </div>;

