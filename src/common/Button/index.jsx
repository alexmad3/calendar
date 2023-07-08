import classNames from 'classnames/bind';
import { Icon } from '../Icon';
import styles from './Button.module.sass';

const cx = classNames.bind(styles);

export const Button = ({
  className,
  colorScheme,
  size,
  isActive,
  onClick,
  icon,
  iconClass,
  children,
}) =>  {
  const classes = className?.split(' ').reduce((target, key) => {
    target[key] = true;
    return target;
  }, {});

  return (
    <button
      className={cx({
        button: true,
        [colorScheme || 'base']: true,
        [`size_${size || 'm'}`]: true,
        active: isActive,
          ...classes
      })}
      onClick={onClick}
    >
      {
        icon &&
        <Icon
          className={`${iconClass} ${styles.icon}`}
          name={icon}
        />
      }

      { children }
    </button>
  );
};
