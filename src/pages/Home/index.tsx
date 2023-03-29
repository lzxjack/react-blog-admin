import React from 'react';
import { Link } from 'react-router-dom';

import s from './index.scss';

const Home: React.FC = () => {
  return (
    <>
      <nav>
        <Link to='/home'>home</Link>
        &nbsp;
        <Link to='/article'>article</Link>
      </nav>
    </>
  );
};

export default Home;
