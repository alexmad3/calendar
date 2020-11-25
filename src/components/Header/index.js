import { Button } from '../../common/Button';
import { Search } from '../../common/Search';
import styles from './Header.module.sass';

function Header() {
    return(
        <header>
            <div className={styles.container}>
                <div className={styles.wrapperButtons}>
                    <Button text={'Добавить'} />
                    <Button text={'Обновить'} />
                </div>
                <Search />
            </div>
        </header>
    );
}

export default Header;
