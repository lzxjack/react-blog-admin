import './global.custom.scss';

import React, { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import ErrorBoundary from '@/components/ErrorBoundary';

import s from './App.scss';

const Admin = lazy(
  () => import(/* webpackChunkName:'Admin', webpackPrefetch:true */ '@/pages/Admin')
);
const Home = lazy(
  () => import(/* webpackChunkName:'Home', webpackPrefetch:true */ '@/pages/Home')
);

const App: React.FC = () => {
  return (
    <div className={s.AppBox}>
      <nav>
        <Link to='/admin'>admin</Link>
        &nbsp;
        <Link to='/home'>home</Link>
      </nav>
      <ErrorBoundary>
        <Suspense fallback={<>123123</>}>
          <Routes>
            <Route path='/' element={<Admin />} />
            <Route path='admin' element={<Admin />} />
            <Route path='home' element={<Home />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;
