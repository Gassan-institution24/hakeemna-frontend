import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import CompactLayout from 'src/layouts/compact';
import AuthClassicLayout from 'src/layouts/auth/classic';
// import AuthModernLayout from 'src/layouts/auth/modern';
// import AuthModernCompLayout from 'src/layouts/auth/modern-compact';

import { LoadingScreen } from 'src/components/loading-screen';
import MainLayout from 'src/layouts/main';

// ----------------------------------------------------------------------

// JWT
const JwtLoginPage = lazy(() => import('src/pages/auth/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/register'));
const JwtUSRegisterPage = lazy(() => import('src/pages/auth/unit-service-register'));
const JwtStakeholderRegisterPage = lazy(() => import('src/pages/auth/stakeholder-register'));
const ForgetPasswordPage = lazy(() => import('src/pages/auth/forgot-password'));
const VerifyPage = lazy(() => import('src/pages/auth/verify'));
const NewPasswordPage = lazy(() => import('src/pages/auth/new-password'));
const ActivationPage = lazy(() => import('src/pages/auth/activation'));
const PatientNewUserPage = lazy(() => import('src/pages/auth/patient-new-user'));

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'login',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <MainLayout>
          <AuthClassicLayout>
            <JwtLoginPage />
          </AuthClassicLayout>
        </MainLayout>
      </Suspense>
    ),
  },
  {
    path: 'register',
    element: (
      <MainLayout>
        <AuthClassicLayout title="your health medical record">
          <JwtRegisterPage />
        </AuthClassicLayout>
      </MainLayout>
    ),
  },
  {
    path: 'register/serviceunit',
    element: (
      <MainLayout>
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <JwtUSRegisterPage />
        </AuthClassicLayout>
      </MainLayout>
    ),
  },
  {
    path: 'register/stakeholder',
    element: (
      <MainLayout>
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <JwtStakeholderRegisterPage />
        </AuthClassicLayout>
      </MainLayout>
    ),
  },
  {
    element: (
      <MainLayout>
        <CompactLayout>
          <Outlet />
        </CompactLayout>
      </MainLayout>
    ),
    children: [
      { path: 'verify', element: <VerifyPage /> },
      { path: 'activation/:token', element: <ActivationPage /> },
      { path: 'new-password', element: <NewPasswordPage /> },
      { path: 'forgot-password', element: <ForgetPasswordPage /> },
      { path: 'makeuser/:token', element: <PatientNewUserPage /> },
    ],
  },
];

// export const authRoutes = [
//   {
//     path: 'auth',
//     children: [authJwt],
//   },
// ];
