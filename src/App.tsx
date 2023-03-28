import './global.custom.scss';

import React, { lazy, Suspense } from 'react';

// import { Link, Route, Routes } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';

import s from './App.scss';

const Admin = lazy(
  () => import(/* webpackChunkName:'Admin', webpackPrefetch:true */ '@/pages/Admin')
);

const Login = lazy(
  () => import(/* webpackChunkName:'Login', webpackPrefetch:true */ '@/pages/Login')
);

const App: React.FC = () => {
  const loginState = true;

  return <ErrorBoundary>{loginState ? <Admin /> : <Login />}</ErrorBoundary>;
};

export default App;
