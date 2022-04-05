import classNames from 'classnames/bind';
import styles from './ButtonIcon.module.sass';

const cx = classNames.bind(styles);

export const ButtonIcon = props =>  {
  const classesArray = props.className?.split(' ').reduce((target, key) => {
    target[key] = true;
    return target;
  }, {});

  return (
    <button
      className={cx({
        btn: true,
        ...classesArray
      })}
      onClick={props.onClick}
    >
      {props.icon && 
        <i className={props.icon + ' ' + cx({icon: true, mr: props.icon && props.text})}></i>
      }
      {props.text}
    </button>
  );
};
