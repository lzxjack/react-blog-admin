import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { auth } from '@/utils/cloudBase';

interface Props {
  requireLogin: boolean;
  to: string;
  children: any;
}

export default ({ requireLogin, to, children }: Props) => {
  const location = useLocation();
  const isLogin = auth.hasLoginState();

  if (requireLogin) {
    return isLogin ? children : <Navigate to={to} state={{ from: location }} replace />;
  } else {
    return isLogin ? <Navigate to={to} state={{ from: location }} replace /> : children;
  }
};
