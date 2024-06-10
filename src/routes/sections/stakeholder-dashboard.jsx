import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import WorkGroupPermissionsBarLayout from 'src/layouts/workgroup-permission-minibar';

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
        children: [
          { element: <ChecklistPage />, index: true },
          { path: 'list', element: <ChecklistPage /> },
          { path: 'new', element: <ChecklistNewPage /> },
          { path: ':id/edit', element: <ChecklistEditPage /> },
        ],
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
          { element: <ChecklistPage />, index: true },
          { path: 'list', element: <ChecklistPage /> },
          { path: 'new', element: <ChecklistNewPage /> },
          { path: ':id/edit', element: <ChecklistEditPage /> },
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

    ],
  },
];
