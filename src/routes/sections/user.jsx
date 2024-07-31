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
const Sidebar = lazy(() => import('src/sections/user/view/siedBarmd'));
const OldmedicalrepotView = lazy(() => import('src/sections/user/oldmedicalrepotView'));
const UserAppointmentsPage = lazy(() => import('src/pages/dashboard/user/appointments'));
const Booking = lazy(() => import('src/pages/dashboard/user/appointmentsbooking'));
const Exist = lazy(() => import('src/pages/dashboard/user/existmember'));
const Create = lazy(() => import('src/pages/dashboard/user/newmember'));
const Doctorpage = lazy(() => import('src/pages/dashboard/user/doctorpage'));
const Insurance = lazy(() => import('src/pages/dashboard/user/insurance'));
const History = lazy(() => import('src/pages/dashboard/user/history'));
const HistoryInfo = lazy(() => import('src/pages/dashboard/user/historyinfo'));
const Share = lazy(() => import('src/pages/dashboard/user/share'));
const FinancilMovment = lazy(() => import('src/pages/dashboard/user/FinancilMovment'));
const FinancilMovmentInfo = lazy(() => import('src/pages/dashboard/user/FinancilMovmentInfo'));
const Family = lazy(() => import('src/pages/dashboard/user/Family'));
const Specialities = lazy(() => import('src/pages/dashboard/user/specialities'));
const PatientPrescriptions = lazy(() => import('src/pages/dashboard/user/prescriptions'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const ContactUS = lazy(() => import('src/pages/dashboard/user/contaactus'));
const Medicalreports = lazy(() => import('src/pages/dashboard/user/Medicalreports'));
const Emergency = lazy(() => import('src/pages/dashboard/user/emergency'));
const Watingroom = lazy(() => import('src/pages/dashboard/user/waitingroom'));
const BMI = lazy(() => import('src/sections/user/bmi'));
const Myhealth = lazy(() => import('src/sections/user/view/user-myHealth-view'));
const Oldpatientsdata = lazy(() => import('src/sections/user/oldpatientsdata'));
const ProfileQr = lazy(() => import('src/sections/user/profile-qr'));
const SickLeave = lazy(() => import('src/sections/user/view/user-sickLeave-view'));

// ORDERS
const OrdersPage = lazy(() => import('src/pages/dashboard/user/orders/list'));
const OrdersDetailsPage = lazy(() => import('src/pages/dashboard/user/orders/details'));

// PRODUCTS
const AllProductsPage = lazy(() => import('src/pages/dashboard/user/products/all-products'));
const ProductsStakeholdersPage = lazy(() =>
  import('src/pages/dashboard/user/products/stakeholders')
);
const StakeholderProductsPage = lazy(() =>
  import('src/pages/dashboard/user/products/stakeholder-products')
);
const ProductCheckoutPage = lazy(() => import('src/pages/dashboard/user/products/checkout'));
const OfferInfoPage = lazy(() => import('src/pages/dashboard/user/products/offer-info'));

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
          { path: 'Sidebar', element: <Sidebar /> },
          { path: 'oldmedicalreportsview/:id', element: <OldmedicalrepotView /> },
          { path: 'myprofile/:id', element: <ProfileQr /> },
          { path: 'medicalreports', element: <Medicalreports /> },
          { path: 'emergency', element: <Emergency /> },
          { path: 'watingroom', element: <Watingroom /> },
          { path: 'prescriptions', element: <PatientPrescriptions /> },
          { path: 'bmi', element: <BMI /> },
          { path: 'myhealth', element: <Myhealth /> },
          { path: 'oldpatientdata', element: <Oldpatientsdata /> },
          { path: 'appointments', element: <UserAppointmentsPage /> },
          { path: 'bookappointment/:id', element: <Booking /> },
          { path: 'doctorpage/:id', element: <Doctorpage /> },
          { path: 'insurance', element: <Insurance /> },
          { path: 'specialities', element: <Specialities /> },
          { path: 'exist', element: <Exist /> },
          { path: 'create', element: <Create /> },
          { path: 'contactus', element: <ContactUS /> },
          { path: 'account', element: <UserAccountPage /> },
          { path: 'share', element: <Share /> },
          { path: 'history', element: <History /> },
          { path: 'historyinfo/:id', element: <HistoryInfo /> },
          { path: 'financilmovment', element: <FinancilMovment /> },
          { path: 'financilmovment/:id', element: <FinancilMovmentInfo /> },
          { path: 'family', element: <Family /> },
          { path: 'sickLeave', element: <SickLeave /> },
          {
            path: 'products',
            children: [
              { element: <AllProductsPage />, index: true },
              { path: 'all', element: <AllProductsPage /> },
              { path: 'stakeholder', element: <ProductsStakeholdersPage /> },
              { path: 'stakeholder/:shid', element: <StakeholderProductsPage /> },
              { path: 'checkout', element: <ProductCheckoutPage /> },
              { path: 'offer/:id', element: <OfferInfoPage /> },
            ],
          },
          {
            path: 'orders',
            children: [
              { element: <OrdersPage />, index: true },
              { path: ':id/details', element: <OrdersDetailsPage /> },
            ],
          },
        ],
      },
    ],
  },
];
