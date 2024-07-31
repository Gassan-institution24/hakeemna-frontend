import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// CHECKLIST
const ChecklistPage = lazy(() => import('src/pages/employee/checklist/table'));
const ChecklistNewPage = lazy(() => import('src/pages/employee/checklist/new'));
const ChecklistEditPage = lazy(() => import('src/pages/employee/checklist/edit'));

// PRODUCTS
const ProductsPage = lazy(() => import('src/pages/stakeholder/products/list'));
const ProductsNewPage = lazy(() => import('src/pages/stakeholder/products/new'));
const ProductsEditPage = lazy(() => import('src/pages/stakeholder/products/edit'));

// PRODUCTS
const OffersPage = lazy(() => import('src/pages/stakeholder/offers/list'));
const OffersNewPage = lazy(() => import('src/pages/stakeholder/offers/new'));
const OffersEditPage = lazy(() => import('src/pages/stakeholder/offers/edit'));

// PROFILE
const ProfilePage = lazy(() => import('src/pages/stakeholder/profile/home'));

// ORDERS
const OrdersPage = lazy(() => import('src/pages/stakeholder/orders/list'));
const OrderDetailsPage = lazy(() => import('src/pages/stakeholder/orders/details'));

// CUSTOMERS
const CustomersPage = lazy(() => import('src/pages/stakeholder/customers/home'));
const CustomerDetailsPage = lazy(() => import('src/pages/stakeholder/orders/details'));

// ACCOUNTING
// ECONOMIC MOVEMENTS
const EconomicHomePage = lazy(() =>
  import('src/pages/stakeholder/accounting/economic-movements/home')
);
const EconomicInfoPage = lazy(() =>
  import('src/pages/stakeholder/accounting/economic-movements/info')
);
const EconomicEditPage = lazy(() =>
  import('src/pages/stakeholder/accounting/economic-movements/edit')
);
const EconomicNewPage = lazy(() =>
  import('src/pages/stakeholder/accounting/economic-movements/new')
);
// PAYMENT CONTROL
const PaymentControlHomePage = lazy(() =>
  import('src/pages/stakeholder/accounting/payment-control/home')
);
// RECEIPTS
const ReceiptsHomePage = lazy(() => import('src/pages/stakeholder/accounting/reciepts/home'));
const ReceiptsInfoPage = lazy(() => import('src/pages/stakeholder/accounting/reciepts/info'));
const InvoicingHomePage = lazy(() => import('src/pages/stakeholder/accounting/invoicing/home'));

// ----------------------------------------------------------------------

export const stakeholderDashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <RoleBasedGuard hasContent roles={['stakeholder']}>
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
        path: 'myprofile',
        children: [{ element: <ProfilePage />, index: true }],
      },
      {
        path: 'myproducts',
        children: [
          { element: <ProductsPage />, index: true },
          { path: 'list', element: <ProductsPage /> },
          { path: 'new', element: <ProductsNewPage /> },
          { path: ':id/edit', element: <ProductsEditPage /> },
        ],
      },
      {
        path: 'myoffers',
        children: [
          { element: <OffersPage />, index: true },
          { path: 'list', element: <OffersPage /> },
          { path: 'new', element: <OffersNewPage /> },
          { path: ':id/edit', element: <OffersEditPage /> },
        ],
      },
      {
        path: 'myorders',
        children: [
          { element: <OrdersPage />, index: true },
          { path: ':id/details', element: <OrderDetailsPage /> },
          // { path: 'new', element: <ChecklistNewPage /> },
          // { path: ':id/edit', element: <ChecklistEditPage /> },
        ],
      },
      {
        path: 'mycustomers',
        children: [
          { element: <CustomersPage />, index: true },
          { path: ':id/details', element: <CustomerDetailsPage /> },
        ],
      },
      {
        path: 'sh/accounting',
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
            children: [{ element: <PaymentControlHomePage />, index: true }],
          },
          {
            path: 'reciepts',
            children: [
              { element: <ReceiptsHomePage />, index: true },
              { path: ':id/info', element: <ReceiptsInfoPage /> },
            ],
          },
          {
            path: 'invoicing',
            element: <InvoicingHomePage />,
          },
        ],
      },
      {
        path: 'myorders',
        children: [{ element: <ChecklistPage />, index: true }],
      },
    ],
  },
];
