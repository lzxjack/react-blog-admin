import { Tag } from '@arco-design/web-react';
import React from 'react';

import s from './index.scss';

interface Props {
  tags: string[];
}

const TableTag: React.FC<Props> = ({ tags }) => {
  const COLORS = [
    'red',
    'orangered',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'arcoblue',
    'purple',
    'pinkpurple',
    'magenta',
    'gray'
  ];

  return (
    <div className={s.tableTag}>
      {tags.map((tag, index) => {
        return (
          <Tag
            key={index}
            color={COLORS[tag.length % COLORS.length]}
            bordered
            className={s.tagItem}
          >
            {tag}
          </Tag>
        );
      })}
    </div>
  );
};

export default TableTag;
