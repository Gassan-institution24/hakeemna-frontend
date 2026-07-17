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
const EconomicHomePage = lazy(
  () => import('src/pages/employee/accounting/economic-movements/home')
);
const EconomicInfoPage = lazy(
  () => import('src/pages/employee/accounting/economic-movements/info')
);
const EconomicEditPage = lazy(
  () => import('src/pages/employee/accounting/economic-movements/edit')
);
const EconomicNewPage = lazy(() => import('src/pages/employee/accounting/economic-movements/new'));
// PAYMENT CONTROL
const PaymentControlHomePage = lazy(
  () => import('src/pages/employee/accounting/payment-control/home')
);
const PaymentControlInfoPage = lazy(
  () => import('src/pages/employee/accounting/payment-control/info')
);
const PaymentControlEditPage = lazy(
  () => import('src/pages/employee/accounting/payment-control/edit')
);
const PaymentControlNewPage = lazy(
  () => import('src/pages/employee/accounting/payment-control/new')
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
// QUALITY CONTROL
const QCHomePage = lazy(() => import('src/pages/employee/qualitycontrol/home'));

// PROFILE
const ProfileHomePage = lazy(() => import('src/pages/employee/profile/home'));
const ProfileEditPage = lazy(() => import('src/pages/employee/profile/edit'));

// APPOINTMENT CONFIGURATION
const AppointmentConfigPage = lazy(
  () => import('src/pages/employee/appoint-config/appoint-config')
);
const AppointmentConfigDetailsPage = lazy(
  () => import('src/pages/employee/appoint-config/appoint-config-detail')
);
const NewAppointmentConfigPage = lazy(
  () => import('src/pages/employee/appoint-config/new-appoint-config')
);

// CALENDER
const CalenderPage = lazy(() => import('src/pages/employee/calender/calender'));
const AppointmentsToday = lazy(
  () => import('src/pages/employee/appointmentsToday/appintmentaToday')
);
const RecordPage = lazy(() => import('src/pages/employee/appointmentsToday/recordPage'));
const PrescriotionPage = lazy(
  () => import('src/pages/employee/appointmentsToday/prescriotionPage')
);
const MedicalAnalysisPageview = lazy(
  () => import('src/pages/employee/appointmentsToday/medical-analysisPage')
);const RadiologyPageview = lazy(
  () => import('src/pages/employee/appointmentsToday/radiologyPage')
);
const MedicalreportPage = lazy(() => import('src/pages/employee/appointmentsToday/medicalPage'));
const SickleavePage = lazy(() => import('src/pages/employee/appointmentsToday/sickleavePage'));
const DoctorReportPage = lazy(() => import('src/pages/employee/appointmentsToday/docreport'));
const DiagnosisPageView = lazy(() => import('src/pages/employee/appointmentsToday/diagnosisPage'));
const QrCodePage = lazy(() => import('src/pages/employee/qr-code'));

// PATIENT
const PatientsPage = lazy(() => import('src/pages/employee/patients/patients_table'));
const PatientInfoPage = lazy(() => import('src/pages/employee/patients/patient-profile'));
const PatientNewPage = lazy(() => import('src/pages/employee/patients/new-patient'));
const VideoCallPage = lazy(() => import('src/pages/employee/patients/videoCallPage'));

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


// HR
const MyAttendencePage = lazy(() => import('src/pages/employee/attendence/my_attendence'));
const MySalaryPage = lazy(() => import('src/pages/employee/salary/home'));

// KPIs
const KpisPage = lazy(() => import('src/pages/employee/kpis/kpis'));

// medical analysis
const MedicalAnalysisPage = lazy(
  () => import('src/pages/employee/medical-services/medical-analysis/medical-analysis')
);
const MedicalAnalysisViewPage = lazy(
  () => import('src/pages/employee/medical-services/medical-analysis/medical-analysis_view')
);
const MedicalAnalysisEditPage = lazy(
  () => import('src/pages/employee/medical-services/medical-analysis/medical-analysis_edit')
);
const MedicalAnalysisCreatePage = lazy(
  () => import('src/pages/employee/medical-services/medical-analysis/medical-analysis_create')
);
// favorite diagnosis
const FavoriteDiagnosisPage = lazy(
  () => import('src/pages/employee/medical-services/diagnosis/diagnosis')
);
const FavoriteDiagnosisViewPage = lazy(
  () => import('src/pages/employee/medical-services/diagnosis/diagnosis_view')
);
const FavoriteDiagnosisEditPage = lazy(
  () => import('src/pages/employee/medical-services/diagnosis/diagnosis_edit')
);
const FavoriteDiagnosisCreatePage = lazy(
  () => import('src/pages/employee/medical-services/diagnosis/diagnosis_create')
);
// medicines
const MedicinesPage = lazy(
  () => import('src/pages/employee/medical-services/medication/medication')
);
const MedicationViewPage = lazy(
  () => import('src/pages/employee/medical-services/medication/medication_view')
);
const MedicationEditPage = lazy(
  () => import('src/pages/employee/medical-services/medication/medication_edit')
);
const MedicationCreatePage = lazy(
  () => import('src/pages/employee/medical-services/medication/medication_create')
);
// radiology
const RadiologyPage = lazy(() => import('src/pages/employee/medical-services/radiology/radiology'));
const RadiologyViewPage = lazy(
  () => import('src/pages/employee/medical-services/radiology/radiology_view')
);
const RadiologyEditPage = lazy(
  () => import('src/pages/employee/medical-services/radiology/radiology_edit')
);
const RadiologyCreatePage = lazy(
  () => import('src/pages/employee/medical-services/radiology/radiology_create')
);
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
        path: 'profile/myattendence',
        children: [{ element: <MyAttendencePage />, index: true }],
      },
      {
        path: 'profile/mysalary',
        children: [{ element: <MySalaryPage />, index: true }],
      },
      {
        path: 'Kpis',
        children: [{ element: <KpisPage />, index: true }],
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
        path: 'medicalAnalysis/:id',
        element: <MedicalAnalysisPageview />,
      },
      {
        path: 'radiology/:id',
        element: <RadiologyPageview />,
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
      {
        path: 'diagnosis/:id',
        element: <DiagnosisPageView />,
      },
      {
        path: 'qr-code',
        element: <QrCodePage />,
      },
      {
        path: 'medical-services',
        children: [
          { element: <MedicalAnalysisPage />, index: true },
          {
            path: 'medical-analysis',
            children: [
              { element: <MedicalAnalysisPage />, index: true },
              { path: 'new', element: <MedicalAnalysisCreatePage /> },
              { path: ':id', element: <MedicalAnalysisViewPage /> },
              { path: ':id/edit', element: <MedicalAnalysisEditPage /> },
            ],
          },
          {
            path: 'medicines',
            children: [
              { element: <MedicinesPage />, index: true },
              { path: ':id', element: <MedicationViewPage /> },
              { path: ':id/edit', element: <MedicationEditPage /> },
              { path: 'new', element: <MedicationCreatePage /> },
            ],
          },
          {
            path: 'radiology',
            children: [
              { element: <RadiologyPage />, index: true },
              { path: ':id', element: <RadiologyViewPage /> },
              { path: ':id/edit', element: <RadiologyEditPage /> },
              { path: 'new', element: <RadiologyCreatePage /> },
            ],
          },
          {
            path: 'diagnosis',
            children: [
              { element: <FavoriteDiagnosisPage />, index: true },
              { path: 'new', element: <FavoriteDiagnosisCreatePage /> },
              { path: ':id', element: <FavoriteDiagnosisViewPage /> },
              { path: ':id/edit', element: <FavoriteDiagnosisEditPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/video-call/:id',
    element: (
      <AuthGuard>
        <VideoCallPage />
      </AuthGuard>
    ),
  },
];
