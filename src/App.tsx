import './global.custom.scss';

import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import RequireAuth from '@/components/RequireAuth';

const Login = lazy(
  () => import(/* webpackChunkName:'Login', webpackPrefetch:true */ '@/pages/Login')
);
const Admin = lazy(
  () => import(/* webpackChunkName:'Admin', webpackPrefetch:true */ '@/pages/Admin')
);

const App: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route
          path='/'
          element={
            <RequireAuth requireLogin={false} to='/admin/home'>
              <Login />
            </RequireAuth>
          }
        />
        <Route
          path='admin/*'
          element={
            <RequireAuth requireLogin={true} to='/'>
              <Admin />
            </RequireAuth>
          }
        />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Suspense>
  );
};

export default App;
