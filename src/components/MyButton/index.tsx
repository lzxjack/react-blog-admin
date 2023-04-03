import classNames from 'classnames';
import React, { MouseEventHandler } from 'react';

import s from './index.scss';

interface Props {
  text: string;
  danger?: boolean;
  small?: boolean;
  className?: string;
  style?: Object;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const MyButton: React.FC<Props> = ({
  text,
  onClick,
  danger,
  small,
  className,
  style
}) => {
  return (
    <div
      style={style}
      className={classNames(s.myButtonBox, className, {
        [s.btnDanger]: danger,
        [s.btnSamll]: small
      })}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default MyButton;
