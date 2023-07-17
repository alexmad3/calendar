import classNames from 'classnames/bind';
import styles from './Icon.module.sass';
import Icons from './sprite.svg';

const cx = classNames.bind(styles);

export const Icon = ({
  name,
  className,
  onClick,
}) => {
  const classes = className?.split(' ').reduce((target, key) => {
    target[key] = true;
    return target;
  }, {});

  return (
  <svg
    className={cx({
      icon: true,
      ...classes,
    })}
    onClick={typeof onClick === 'function' ? () => onClick() : null}
  >
    <use href={Icons + '#' + name} />
  </svg>
  );
};
