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

    componentDidUpdate(prevProps) {
        if (prevProps.left !== this.props.left || prevProps.top !== this.props.top) {
            this.clearValue();
        }
    };

    onChange = (name, value) => {
        this.setState({[name]: value});
    };

    clearValue = () => {
        ['event', 'date', 'names', 'description'].forEach((name) => this.setState({[name]: ''}));
    };

    onClose = () => {
        this.props.close();
        this.clearValue();
    };

    render() {
        return(
            <div
                className={`${styles.wrapper} ${this.props.isVisible ? styles.visible : ''}`}
                style={{left: this.props.left + 'px', top: this.props.top}}
            >
                <button
                    className={styles.cancel}
                    onClick={this.onClose}
                >
                    <i className='fa fa-times'></i>
                </button>

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
                        onChange={this.onChange}
                        mt={true}
                    />

                    <Input
                        placeholder={'Имена участников'}
                        value={this.state.names}
                        name={'names'}
                        onChange={this.onChange}
                        mt={true}
                    />

                    <textarea
                        className={styles.textarea}
                        placeholder='Описание'
                        value={this.state.description}
                        name={'description'}
                        onChange={(e) => this.onChange(e.target.name, e.target.value)}
                    />
                </div>

                <div className={styles.wrapperButtons}>
                    <ButtonIcon
                        text={'Создать'}
                    />

                    <ButtonIcon
                        text={'Отменить'}
                        onClick={this.onClose}
                    />
                </div>
            </div>
        );
    }
};
