import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import UserDashboardLayout from 'src/layouts/dashboard/indexUser';

import { LoadingScreen } from 'src/components/loading-screen';
// import TableCreatePage from 'src/pages/dashboard/tables/new';
// import TableEditPage from 'src/pages/dashboard/tables/edit';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
// const TablesListPage = lazy(() => import('src/pages/dashboard/tables/list'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserAppointmentsPage = lazy(() => import('src/pages/dashboard/user/appointments'));
const Booking = lazy(() => import('src/pages/dashboard/user/appointmentsbooking'));
const Doctorpage = lazy(() => import('src/pages/dashboard/user/doctorpage'));
const Insurance = lazy(() => import('src/pages/dashboard/user/insurance'));
const Share = lazy(() => import('src/pages/dashboard/user/share'));
const FinancilMovment = lazy(() => import('src/pages/dashboard/user/FinancilMovment'));
const Family = lazy(() => import('src/pages/dashboard/user/Family'));
const Specialities = lazy(() => import('src/pages/dashboard/user/specialities'));
const PatientPrescriptions = lazy(() => import('src/pages/dashboard/user/prescriptions'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
const Medicalreports = lazy(() => import('src/pages/dashboard/user/Medicalreports'));
const Emergency = lazy(() => import('src/pages/dashboard/user/emergency'));
const Watingroom = lazy(() => import('src/pages/dashboard/user/watingroom'));
const BMI = lazy(() => import('src/sections/user/bmi'));
const Oldpatientsdata = lazy(() => import('src/sections/user/oldpatientsdata'));
const ProfileQr =  lazy(() => import('src/sections/user/profile-qr'));

// ----------------------------------------------------------------------

export const userRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <UserDashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </UserDashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'user',
        element: (
          <RoleBasedGuard hasContent roles={['patient']}>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </RoleBasedGuard>
        ),
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'myprofile/:id', element: <ProfileQr /> },
          { path: 'medicalreports', element: <Medicalreports /> },
          { path: 'emergency', element: <Emergency /> },
          { path: 'watingroom', element: <Watingroom /> },
          { path: 'prescriptions', element: <PatientPrescriptions /> },
          { path: 'bmi', element: <BMI /> },
          { path: 'oldpatientdata', element: <Oldpatientsdata /> },
          { path: 'appointments', element: <UserAppointmentsPage /> },
          { path: 'bookappointment/:id', element: <Booking /> },
          { path: 'doctorpage/:id', element: <Doctorpage /> },
          { path: 'insurance', element: <Insurance /> },
          { path: 'specialities', element: <Specialities /> },
          // { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
          { path: 'share', element: <Share /> },
          { path: 'financilmovment', element: <FinancilMovment /> },
          { path: 'family', element: <Family /> },
        ],
      },
    ],
  },
];
