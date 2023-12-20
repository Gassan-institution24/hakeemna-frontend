import React, { useRef } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import MainLayout from 'src/layouts/main';

// import { PATH_AFTER_LOGIN } from 'src/config-global';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { HomePage, mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';
import { userRoutes } from './user';

// ----------------------------------------------------------------------

export default function Router() {
  const divRef = useRef(null);
  const scrollToDiv = () => {
    // Scroll logic using divRef.current.scrollIntoView() or any other scroll method
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    // {
    //   path: '/',
    //   element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    // },

    // ----------------------------------------------------------------------

    // SET INDEX PAGE WITH HOME PAGE
    {
      path: '/',
      element: (
        <MainLayout scrollToDiv={scrollToDiv}>
          <HomePage divRef={divRef}/>
        </MainLayout>
      ),
    },

    // Auth routes
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Main routes
    ...mainRoutes,

    // Components routes
    ...componentsRoutes,

    // user routes
    ...userRoutes,

    // No match 404
    // { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
