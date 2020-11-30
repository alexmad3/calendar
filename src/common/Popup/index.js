import React from 'react';
import { connect } from 'react-redux';
import { visiblePopup, setActiveCell } from '../../redux/actions/popup';
import { ButtonIcon } from '../ButtonIcon';
import { Input } from '../Input';
import styles from './Popup.module.sass';

class Popup extends React.Component {
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

    clearValue = () => {
        ['event', 'date', 'names', 'description'].forEach((name) => this.setState({[name]: ''}));
    };

    onClose = () => {
        this.props.visiblePopup(false);
        this.props.setActiveCell(null);
        this.clearValue();
    };

    render() {
        return(
            <div
                className={`${styles.wrapper} ${this.props.isVisible ? styles.visible : ''}`}
                style={{left: this.props.position.wrapperLeft + 'px', top: this.props.position.wrapperTop + 'px'}}
            >
                <div className={
                    `${styles.arrow} ${styles[this.props.position.horizontalDirection]} ${styles[this.props.position.verticalDirection]}`
                }></div>
    
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

const state = (state) => {
    return {
        position: state.popup.position
    };
};

const dispatch = {
    visiblePopup,
    setActiveCell
};

export default connect(state, dispatch)(Popup);
