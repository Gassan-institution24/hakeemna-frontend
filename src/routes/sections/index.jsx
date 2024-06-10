import React, { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

import MainLayout from 'src/layouts/main';
import AuthClassicLayout from 'src/layouts/auth/classic';

import { authRoutes } from './auth';
import { userRoutes } from './user';
import { HomePage, mainRoutes } from './main';
import { dashboardRoutes } from './super-admin-dashboard';
import { unitServiceDashboardRoutes } from './unit-service-dashboard';
import { unitServiceEmployeeDashboardRoutes } from './employee-dashboard';
import { stakeholderDashboardRoutes } from './stakeholder-dashboard';

const Page404 = lazy(() => import('src/pages/errors/404'));
const JwtLoginPage = lazy(() => import('src/pages/auth/login'));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <HomePage />
        </MainLayout>
      ),
    },
    
    // {
    //   path: '/',
    //   element: (
    //     <AuthClassicLayout>
    //       <JwtLoginPage />
    //     </AuthClassicLayout>
    //   ),
    // },

    // Auth routes
    ...authRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // unit of service dashboard routes
    ...unitServiceDashboardRoutes,

    // unit of service employee dashboard routes
    ...unitServiceEmployeeDashboardRoutes,

    // stakeholder dashboard routes
    ...stakeholderDashboardRoutes,

    // Main routes
    ...mainRoutes,

    // user routes
    ...userRoutes,

    // No match 404
    { path: '*', element: <Page404 /> },
  ]);
}
