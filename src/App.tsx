import './global.custom.scss';

import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, useLocation } from 'react-router-dom';

import { selectIsLogin } from '@/redux/selectors';
import { login, logout } from '@/redux/slices/isLogin';
import { auth } from '@/utils/cloudBase';
import { renderRoutes, routes } from '@/utils/routes';

const App: React.FC = () => {
  const location = useLocation();
  const isLogin = useSelector(selectIsLogin);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.hasLoginState() ? dispatch(login()) : dispatch(logout());
  }, []);

  return (
    <Suspense fallback={null}>
      <Routes>{renderRoutes(location, isLogin, routes)}</Routes>
    </Suspense>
  );
};

export default App;
