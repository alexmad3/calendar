import React from 'react';
import { ButtonIcon } from '../ButtonIcon';
import { Input } from '../Input';
import styles from './Popup.module.sass';

export default class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: '',
            date: '',
            names: '',
            description: ''
        };
    };

    onChange = (name, value) => {
        this.setState({[name]: value});
    };

    render() {
        return(
            <div className={styles.wrapper}>
                <button className={styles.cancel}><i className='fa fa-times'></i></button>
                <div className={styles.content}>
                    <Input
                        placeholder={'Событие'}
                        value={this.state.event}
                        name={'event'}
                        onChange={this.onChange}
                    />
                    <Input
                        placeholder={'День, месяц, год'}
                        value={this.state.date}
                        name={'date'}
                    />
                    <Input
                        placeholder={'Имена участников'}
                        value={this.state.names}
                        name={'names'}
                    />

                    <textarea
                        className={styles.textarea}
                        placeholder='Описание'
                        value={this.state.description}
                        name={'description'}
                    />
                </div>
                <div className={styles.wrapperButtons}>
                    <ButtonIcon text={'Создать'}/>
                    <ButtonIcon text={'Отменить'}/>
                </div>
            </div>
        );
    }
};