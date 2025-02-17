import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import WorkGroupPermissionsBarLayout from 'src/layouts/workgroup-permission-minibar';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// APPOINTMENTS
const AppointmentsHomePage = lazy(() => import('src/pages/employee/appointments/home'));
const AppointmentEditPage = lazy(() => import('src/pages/employee/appointments/edit'));
const AppointmentsBookPage = lazy(() => import('src/pages/employee/appointments/book'));

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
const WorkGroupsPermissionPage = lazy(() => import('src/pages/employee/wgroups/permissions/home'));
const WorkGroupsEmployeePermissionPage = lazy(() =>
  import('src/pages/employee/wgroups/permissions/employee')
);
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
const AppointmentsToday = lazy(() =>
  import('src/pages/employee/appointmentsToday/appintmentaToday')
);
const RecordPage = lazy(() => import('src/pages/employee/appointmentsToday/recordPage'));
const PrescriotionPage = lazy(() =>
  import('src/pages/employee/appointmentsToday/prescriotionPage')
);
const MedicalreportPage = lazy(() => import('src/pages/employee/appointmentsToday/medicalPage'));
const SickleavePage = lazy(() => import('src/pages/employee/appointmentsToday/sickleavePage'));
const DoctorReportPage = lazy(() => import('src/pages/employee/appointmentsToday/docreport'));

// PATIENT
const PatientsPage = lazy(() => import('src/pages/employee/patients/patients_table'));
const PatientInfoPage = lazy(() => import('src/pages/employee/patients/patient-profile'));
const PatientNewPage = lazy(() => import('src/pages/employee/patients/new-patient'));

// CHECKLIST
const ChecklistPage = lazy(() => import('src/pages/employee/checklist/table'));
const ChecklistNewPage = lazy(() => import('src/pages/employee/checklist/new'));
const ChecklistEditPage = lazy(() => import('src/pages/employee/checklist/edit'));

// ADJUSTABLE DOC
const AdjustPage = lazy(() => import('src/pages/employee/adjustable-doc/table'));
const AdjustNewPage = lazy(() => import('src/pages/employee/adjustable-doc/new'));
const AdjustEditPage = lazy(() => import('src/pages/employee/adjustable-doc/edit'));

// BLOGS
const BlogsPage = lazy(() => import('src/pages/employee/blogs/table'));
const BlogsNewPage = lazy(() => import('src/pages/employee/blogs/new'));
const BlogsEditPage = lazy(() => import('src/pages/employee/blogs/edit'));

const BrowseBlogs = lazy(() => import('src/pages/employee/blogs/browse-blogs'));
const PreviewBlogs = lazy(() => import('src/pages/employee/blogs/preview-blogs'));
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
        path: 'documents/checklist',
        children: [
          { element: <ChecklistPage />, index: true },
          { path: 'list', element: <ChecklistPage /> },
          { path: 'new', element: <ChecklistNewPage /> },
          { path: ':id/edit', element: <ChecklistEditPage /> },
        ],
      },
      {
        path: 'documents/adjustable',
        children: [
          { element: <AdjustPage />, index: true },
          { path: 'list', element: <AdjustPage /> },
          { path: 'new', element: <AdjustNewPage /> },
          { path: ':id/edit', element: <AdjustEditPage /> },
        ],
      },
      { path: 'browzeblogs', element: <BrowseBlogs /> },
      { path: 'browzeblogs/:id', element: <PreviewBlogs /> },
      {
        path: 'documents/blogs',
        children: [
          { element: <BlogsPage />, index: true },
          { path: 'list', element: <BlogsPage /> },
          { path: 'new', element: <BlogsNewPage /> },
          { path: ':id/edit', element: <BlogsEditPage /> },
        ],
      },
      {
        path: 'appointments',
        children: [
          { element: <AppointmentsHomePage />, index: true },
          { path: 'list', element: <AppointmentsHomePage /> },
          { path: ':id', element: <AppointmentEditPage /> },
          { path: 'book', element: <AppointmentsBookPage /> },
          {
            path: 'config',
            children: [
              { element: <AppointmentConfigPage />, index: true },
              { path: 'new', element: <NewAppointmentConfigPage /> },
              { path: ':coid', element: <AppointmentConfigDetailsPage /> },
            ],
          },
        ],
      },
      {
        path: 'mypatients',
        children: [
          { element: <PatientsPage />, index: true },
          { path: 'new', element: <PatientNewPage /> },
          { path: ':id', element: <PatientInfoPage /> },
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
        path: 'profile',
        children: [
          { element: <ProfileHomePage />, index: true },
          { path: 'settings', element: <ProfileHomePage /> },
          { path: 'edit', element: <ProfileEditPage /> },
          {
            path: 'communication',
            children: [{ element: <CommunicationHomePage />, index: true }],
          },
          {
            path: 'wgroups',
            children: [
              { element: <WorkGroupsHomePage />, index: true },
              {
                path: ':wgid',
                element: (
                  <WorkGroupPermissionsBarLayout>
                    <Outlet />
                  </WorkGroupPermissionsBarLayout>
                ),
                children: [
                  { element: <WorkGroupsPermissionPage />, index: true },
                  {
                    path: 'employee/:emid',
                    element: <WorkGroupsEmployeePermissionPage />,
                  },
                ],
              },
            ],
          },
          {
            path: 'qc',
            children: [{ element: <QCHomePage />, index: true }],
          },
        ],
      },
      {
        path: 'calender',
        element: <CalenderPage />,
      },
      {
        path: 'appointmentsToday',
        element: <AppointmentsToday />,
      },
      {
        path: 'recored/:id',
        element: <RecordPage />,
      },
      {
        path: 'prescription/:id',
        element: <PrescriotionPage />,
      },
      {
        path: 'examination/:id',
        element: <MedicalreportPage />,
      },
      {
        path: 'sickleave/:id',
        element: <SickleavePage />,
      },
      {
        path: 'docreport/:id',
        element: <DoctorReportPage />,
      },
    ],
  },
];
