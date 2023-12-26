import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { GuestGuard } from 'src/auth/guard';
import CompactLayout from 'src/layouts/compact';
import AuthClassicLayout from 'src/layouts/auth/classic';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// JWT
const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/jwt/register'));
const JwtUSRegisterPage = lazy(() => import('src/pages/auth/jwt/unit-service-register'));
const JwtStakeholderRegisterPage = lazy(() => import('src/pages/auth/jwt/stakeholder-register'));
const ForgetPasswordPage = lazy(() => import('src/pages/auth/jwt/forgot-password'));
const VerifyPage = lazy(() => import('src/pages/auth/jwt/verify'));
const NewPasswordPage = lazy(() => import('src/pages/auth/jwt/new-password'));

// ----------------------------------------------------------------------

const authJwt = {
  path: 'jwt',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <JwtLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <JwtRegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register/us',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <JwtUSRegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register/stakeholder',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <JwtStakeholderRegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      element: (
        <CompactLayout>
          <Outlet />
        </CompactLayout>
      ),
      // children: [
      //   { path: 'verify', element: <VerifyPage /> },
      //   { path: 'new-password', element: <NewPasswordPage /> },
      //   { path: 'forgot-password', element: <ForgetPasswordPage /> },
      // ],
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authJwt],
  },
];
