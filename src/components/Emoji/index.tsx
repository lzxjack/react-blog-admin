import { Popover } from '@arco-design/web-react';
import classNames from 'classnames';
import React from 'react';

import EmojiItem from './EmojiItem';
import { emojiFood, emojiNature, emojiPeople, emojiSymbol } from './emojis';
import s from './index.scss';

interface EmojiType {
  emojis: string[];
  show: string;
}

interface Props {
  className?: string;
  style?: object;
}

const Emoji: React.FC<Props> = ({ className, style }) => {
  const emojiData: EmojiType[] = [
    {
      emojis: emojiPeople,
      show: '😜'
    },
    {
      emojis: emojiNature,
      show: '✂️'
    },
    {
      emojis: emojiSymbol,
      show: '🆗'
    },
    {
      emojis: emojiFood,
      show: '🍎'
    }
  ];

  return (
    <div className={classNames(s.emojiBox, className)} style={style}>
      {emojiData.map((item, index) => (
        <Popover
          key={index}
          position='bottom'
          content={
            <div className={s.emojiContent}>
              <EmojiItem emojis={item.emojis} />
            </div>
          }
          trigger='hover'
        >
          <div className={s.emojiBtn}>{item.show}</div>
        </Popover>
      ))}
    </div>
  );
};

export default Emoji;
