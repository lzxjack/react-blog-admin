import React, { lazy } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

import { renderRoutes } from '@/routes';

import s from './index.scss';

const Article = lazy(
  () => import(/* webpackChunkName:'Article', webpackPrefetch:true */ '@/pages/Article')
);
const About = lazy(
  () => import(/* webpackChunkName:'About', webpackPrefetch:true */ '@/pages/About')
);

const Home: React.FC = () => {
  return (
    <>
      <nav>
        <NavLink to='/home'>home</NavLink>
        &nbsp;
        <NavLink to='/home/article'>article</NavLink>
        &nbsp;
        <NavLink to='/home/about'>about</NavLink>
      </nav>
      <Routes>
        <Route path='article' element={<Article />} />
        <Route path='about' element={<About />} />
        {/* <Route path='*' element={<Navigate to='/home' />} /> */}
      </Routes>
    </>
  );
};

export default Home;
