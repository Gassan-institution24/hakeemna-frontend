import React, { useRef } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import MainLayout from 'src/layouts/main';

// import { PATH_AFTER_LOGIN } from 'src/config-global';
import { authRoutes } from './auth';
// import { authDemoRoutes } from './auth-demo';
import { HomePage, mainRoutes } from './main';
import { dashboardRoutes } from './super-admin-dashboard';
import { unitServiceDashboardRoutes } from './unit-service-dashboard';
import { unitServiceEmployeeDashboardRoutes } from './employee-dashboard';
// import { componentsRoutes } from './components';
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
  const divRef2 = useRef(null);
  const scrollToDiv2 = () => {
    // Scroll logic using divRef.current.scrollIntoView() or any other scroll method
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return useRoutes([
    {
      path: '/',
      element: (
        <MainLayout scrollToDiv={scrollToDiv} scrollToDiv2={scrollToDiv2}>
          <HomePage divRef={divRef} divRef2={divRef2} />
        </MainLayout>
      ),
    },

    // Auth routes
    ...authRoutes,
    // ...authDemoRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // unit service dashboard routes
    ...unitServiceDashboardRoutes,

    // unit service employee dashboard routes
    ...unitServiceEmployeeDashboardRoutes,

    // Main routes
    ...mainRoutes,

    // Components routes
    // ...componentsRoutes,

    // user routes
    ...userRoutes,

    // No match 404
    // { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
