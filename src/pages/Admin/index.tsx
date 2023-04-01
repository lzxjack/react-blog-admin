import React, { lazy } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

import RequireAuth from '@/components/RequireAuth';

import s from './index.scss';

const Article = lazy(
  () =>
    import(/* webpackChunkName:'Article', webpackPrefetch:true */ '@/pages/Admin/Article')
);
const About = lazy(
  () => import(/* webpackChunkName:'About', webpackPrefetch:true */ '@/pages/Admin/About')
);
const Home = lazy(
  () => import(/* webpackChunkName:'Home', webpackPrefetch:true */ '@/pages/Admin/Home')
);

const Admin: React.FC = () => {
  return (
    <>
      <nav>
        <NavLink to='/admin'>Admin</NavLink>
        &nbsp;
        <NavLink to='/admin/article'>article</NavLink>
        &nbsp;
        <NavLink to='/admin/about'>about</NavLink>
      </nav>
      <Routes>
        <Route
          path=''
          element={
            <RequireAuth requireLogin={true} to='/'>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path='article'
          element={
            <RequireAuth requireLogin={true} to='/'>
              <Article />
            </RequireAuth>
          }
        />
        <Route
          path='about'
          element={
            <RequireAuth requireLogin={true} to='/'>
              <About />
            </RequireAuth>
          }
        />
        <Route path='*' element={<Navigate to='' />} />
      </Routes>
    </>
  );
};

export default Admin;
