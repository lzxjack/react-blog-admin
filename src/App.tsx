import './global.custom.scss';

import React, { Suspense } from 'react';
import { Routes, useLocation } from 'react-router-dom';

import { renderRoutes, routes } from '@/utils/routes';

const App: React.FC = () => {
  const location = useLocation();

  const loginState = !true;

  return (
    <Suspense fallback={null}>
      <Routes>{renderRoutes(location, loginState, routes)}</Routes>
    </Suspense>
  );
};

export default App;
