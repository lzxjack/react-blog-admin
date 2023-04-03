import React from 'react';

import s from './index.scss';

const Home: React.FC = () => {
  const arr = new Array(20).fill(1);

  return (
    <>
      {arr.map((item, index) => (
        <div key={index} className={s.test}>
          test
        </div>
      ))}
    </>
  );
};

export default Home;
