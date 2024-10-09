import React, { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import MainLayout from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { userRoutes } from './user';
import { mainRoutes } from './main';
import { dashboardRoutes } from './super-admin-dashboard';
import { stakeholderDashboardRoutes } from './stakeholder-dashboard';
import { unitServiceDashboardRoutes } from './unit-service-dashboard';
import { unitServiceEmployeeDashboardRoutes } from './employee-dashboard';

const HomePage = lazy(() => import('src/pages/home/home'));
const Page404 = lazy(() => import('src/pages/errors/404'));
// const JwtLoginPage = lazy(() => import('src/pages/auth/login'));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <Suspense fallback={<SplashScreen />}>
          <MainLayout>
            <HomePage />
          </MainLayout>
        </Suspense>
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
    { path: '/404', element: <Page404 /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
