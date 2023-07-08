import { Input } from '../../common/Input';
import { Icon } from '../../common/Icon';
import styles from './Search.module.sass';

export const Search = props =>
  <div className={styles.wrapperSearch}>
    <Icon
      className={`${styles.iconSearch} indentRight`}
      name='search24'
    />

    <Input
      className={styles.field}
      value={props.value}
      placeholder='Событие, дата или участник'
      onChange={(_name, value) => props.onChangeSearch(value)}
    />
  </div>;
