import React, { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

import MainLayout from 'src/layouts/main';

// import { PATH_AFTER_LOGIN } from 'src/config-global';
import { authRoutes } from './auth';
import { userRoutes } from './user';
import { HomePage, mainRoutes } from './main';
import { dashboardRoutes } from './super-admin-dashboard';
import { unitServiceDashboardRoutes } from './unit-service-dashboard';
import { unitServiceEmployeeDashboardRoutes } from './employee-dashboard';

const Page404 = lazy(() => import('src/pages/errors/404'));

// ----------------------------------------------------------------------

export default function Router() {

  return useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <HomePage  />
        </MainLayout>
      ),
    },

    // Auth routes
    ...authRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // unit service dashboard routes
    ...unitServiceDashboardRoutes,

    // unit service employee dashboard routes
    ...unitServiceEmployeeDashboardRoutes,

    // Main routes
    ...mainRoutes,

    // user routes
    ...userRoutes,

    // No match 404
    { path: '*', element: <Page404 /> },
  ]);
}
