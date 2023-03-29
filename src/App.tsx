import './global.custom.scss';

import { useMount } from 'ahooks';
import React, { lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { selectIsLogin } from '@/redux/selectors';
import { login, logout } from '@/redux/slices/isLogin';
import { auth } from '@/utils/cloudBase';

const Login = lazy(
  () => import(/* webpackChunkName:'Login', webpackPrefetch:true */ '@/pages/Login')
);
const Home = lazy(
  () => import(/* webpackChunkName:'Home', webpackPrefetch:true */ '@/pages/Home')
);

const App: React.FC = () => {
  const isLogin = useSelector(selectIsLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useMount(() => {
    dispatch(auth.hasLoginState() ? login() : logout());
  });

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path='/' element={isLogin ? <Navigate to='/home' /> : <Login />} />
        <Route path='/home/*' element={isLogin ? <Home /> : <Login />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Suspense>
  );
};

export default App;
