import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// ENTRANCE MANAGEMENT
const EntranceManagementHomePage = lazy(() => import('src/pages/employee/entranceManagement/home'));
const EntranceManagementNewPage = lazy(() => import('src/pages/employee/entranceManagement/new'));
const EntranceManagementEditPage = lazy(() => import('src/pages/employee/entranceManagement/edit'));

// APPOINTMENTS
const AppointmentsHomePage = lazy(() => import('src/pages/employee/appointments/home'));
const AppointmentsInfoPage = lazy(() => import('src/pages/employee/appointments/info'));

// ACCOUNTING
// ECONOMIC MOVEMENTS
const EconomicHomePage = lazy(() =>
  import('src/pages/employee/accounting/economic-movements/home')
);
const EconomicInfoPage = lazy(() =>
  import('src/pages/employee/accounting/economic-movements/info')
);
const EconomicEditPage = lazy(() =>
  import('src/pages/employee/accounting/economic-movements/edit')
);
const EconomicNewPage = lazy(() => import('src/pages/employee/accounting/economic-movements/new'));
// PAYMENT CONTROL
const PaymentControlHomePage = lazy(() =>
  import('src/pages/employee/accounting/payment-control/home')
);
const PaymentControlInfoPage = lazy(() =>
  import('src/pages/employee/accounting/payment-control/info')
);
const PaymentControlEditPage = lazy(() =>
  import('src/pages/employee/accounting/payment-control/edit')
);
const PaymentControlNewPage = lazy(() =>
  import('src/pages/employee/accounting/payment-control/new')
);
// RECEIPTS
const RecieptsHomePage = lazy(() => import('src/pages/employee/accounting/reciepts/home'));
const RecieptsInfoPage = lazy(() => import('src/pages/employee/accounting/reciepts/info'));
const RecieptsEditPage = lazy(() => import('src/pages/employee/accounting/reciepts/edit'));
const RecieptsNewPage = lazy(() => import('src/pages/employee/accounting/reciepts/new'));
// COMMUNICATION
const CommunicationHomePage = lazy(() => import('src/pages/employee/communication/home'));
// WORK GROUPS
const WorkGroupsHomePage = lazy(() => import('src/pages/employee/wgroups/home'));
// QUALITY CONTROL
const QCHomePage = lazy(() => import('src/pages/employee/qualitycontrol/home'));

// PROFILE
const ProfileHomePage = lazy(() => import('src/pages/employee/profile/home'));
const ProfileEditPage = lazy(() => import('src/pages/employee/profile/edit'));

// APPOINTMENT CONFIGURATION
const AppointmentConfigPage = lazy(() =>
  import('src/pages/employee/appoint-config/appoint-config')
);
const AppointmentConfigDetailsPage = lazy(() =>
  import('src/pages/employee/appoint-config/appoint-config-detail')
);
const NewAppointmentConfigPage = lazy(() =>
  import('src/pages/employee/appoint-config/new-appoint-config')
);

// CALENDER
const CalenderPage = lazy(() => import('src/pages/employee/calender/calender'));

// ----------------------------------------------------------------------

export const unitServiceEmployeeDashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <RoleBasedGuard hasContent roles={['admin', 'employee']}>
          <DashboardLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </RoleBasedGuard>
      </AuthGuard>
    ),
    children: [
      // { element: <IndexPage />, index: true },
      // { path: '', element: < /> },
      {
        path: 'entrancemanagement',
        children: [
          { element: <EntranceManagementHomePage />, index: true },
          { path: 'new', element: <EntranceManagementNewPage /> },
          { path: ':id/edit', element: <EntranceManagementEditPage /> },
        ],
      },
      {
        path: 'appointments',
        children: [
          { element: <AppointmentsHomePage />, index: true },
          { path: ':id/info', element: <AppointmentsInfoPage /> },
        ],
      },
      {
        path: 'appointmentconfig',
        children: [
          { element: <AppointmentConfigPage />, index: true },
          { path: 'new', element: <NewAppointmentConfigPage /> },
          { path: ':coid', element: <AppointmentConfigDetailsPage /> },
        ],
      },
      {
        path: 'accounting',
        children: [
          {
            path: 'economicmovements',
            children: [
              { element: <EconomicHomePage />, index: true },
              { path: ':id/info', element: <EconomicInfoPage /> },
              { path: ':id/edit', element: <EconomicEditPage /> },
              { path: 'new', element: <EconomicNewPage /> },
            ],
          },
          {
            path: 'paymentcontrol',
            children: [
              { element: <PaymentControlHomePage />, index: true },
              { path: ':id/info', element: <PaymentControlInfoPage /> },
              { path: ':id/edit', element: <PaymentControlEditPage /> },
              { path: 'new', element: <PaymentControlNewPage /> },
            ],
          },
          {
            path: 'reciepts',
            children: [
              { element: <RecieptsHomePage />, index: true },
              { path: ':id/info', element: <RecieptsInfoPage /> },
              { path: ':id/edit', element: <RecieptsEditPage /> },
              { path: 'new', element: <RecieptsNewPage /> },
            ],
          },
        ],
      },

      {
        path: 'communication',
        children: [{ element: <CommunicationHomePage />, index: true }],
      },
      {
        path: 'wgroups',
        children: [{ element: <WorkGroupsHomePage />, index: true }],
      },
      {
        path: 'qc',
        children: [{ element: <QCHomePage />, index: true }],
      },
      {
        path: 'profile',
        children: [
          { element: <ProfileHomePage />, index: true },
          { path: 'edit', element: <ProfileEditPage /> },
        ],
      },
      {
        path: 'calender',
        element: <CalenderPage />,
      },
    ],
  },
];
