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
          // { path: 'list', element: <ChecklistPage /> },
          // { path: 'new', element: <ChecklistNewPage /> },
          // { path: ':id/edit', element: <ChecklistEditPage /> },
        ],
      },
      {
        path: 'mycustomers',
        children: [
          { element: <ChecklistPage />, index: true },
          { path: 'list', element: <ChecklistPage /> },
          { path: 'new', element: <ChecklistNewPage /> },
          { path: ':id/edit', element: <ChecklistEditPage /> },
        ],
      },
      {
        path: 'myaccounting',
        children: [
          { element: <ChecklistPage />, index: true },
          { path: 'list', element: <ChecklistPage /> },
          { path: 'new', element: <ChecklistNewPage /> },
          { path: ':id/edit', element: <ChecklistEditPage /> },
        ],
      },
      {
        path: 'myorders',
        children: [{ element: <ChecklistPage />, index: true }],
      },
    ],
  },
];
