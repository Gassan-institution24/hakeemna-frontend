import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import { LoadingScreen } from 'src/components/loading-screen';
import UserDashboardLayout from 'src/layouts/dashboard/indexUser';
// import TableCreatePage from 'src/pages/dashboard/tables/new';
// import TableEditPage from 'src/pages/dashboard/tables/edit';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
// const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
// const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
// const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
// const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
// const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
// const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
// const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
// const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// TABLES
const TablesListPage = lazy(() => import('src/pages/dashboard/tables/list'));
// const TableDetailsPage = lazy(() => import('src/pages/dashboard/tables/details'));
// INVOICE
// const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
// const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
// const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
// const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserAppointmentsPage = lazy(() => import('src/pages/dashboard/user/appointments'));
const Booking = lazy(() => import('src/pages/dashboard/user/booking'));
const Share = lazy(() => import('src/pages/dashboard/user/share'));
const FinancilMovment = lazy(() => import('src/pages/dashboard/user/FinancilMovment'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
const Medicalreports = lazy(() => import('src/pages/dashboard/user/Medicalreports'));
const Emergency = lazy(() => import('src/pages/dashboard/user/emergency'));
const Watingroom = lazy(() => import('src/pages/dashboard/user/watingroom'));
const BMI = lazy(() => import('src/sections/user/bmi'));
const Oldpatientsdata = lazy(() => import('src/sections/user/oldpatientsdata'));

// BLOG
// const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
// const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
// const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
// const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
// const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
// const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
// const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
// const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
// const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
// const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
// const MailPage = lazy(() => import('src/pages/dashboard/mail'));
// const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
// const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
// const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
// const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

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
      // { path: '', element: < /> },
      // { path: 'analytics', element: <OverviewAnalyticsPage /> },
      // { path: 'banking', element: <OverviewBankingPage /> },
      // { path: 'booking', element: <OverviewBookingPage /> },
      // { path: 'file', element: <OverviewFilePage /> },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'medicalreports', element: <Medicalreports /> },
          { path: 'emergency', element: <Emergency /> },
          { path: 'watingroom', element: <Watingroom /> },
          { path: 'prescriptions', element: <UserListPage /> },
          { path: 'bmi', element: <BMI /> },
          { path: 'oldpatientdata', element: <Oldpatientsdata /> },
          { path: 'appointments', element: <UserAppointmentsPage /> },
          { path: 'bookappointment', element: <Booking /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
          { path: 'share', element: <Share /> },
          { path: 'financilmovment', element: <FinancilMovment /> },
        ],
      },
      // {
      //   path: 'product',
      //   children: [
      //     { element: <ProductListPage />, index: true },
      //     { path: 'list', element: <ProductListPage /> },
      //     { path: ':id', element: <ProductDetailsPage /> },
      //     { path: 'new', element: <ProductCreatePage /> },
      //     { path: ':id/edit', element: <ProductEditPage /> },
      //   ],
      // },
      // {
      //   path: 'tables',
      //   children: [
      //     { element: <TablesListPage />, index: true },
      //     { path: 'list', element: <TablesListPage /> },
      //     { path: ':tablename/new', element: <TableCreatePage /> },
      //     { path: ':tablename/edit/:id', element: <TableEditPage /> },
      //     { path: ':tablename', element: <TableDetailsPage /> },
      //   ],
      // },
      // {
      //   path: 'invoice',
      //   children: [
      //     { element: <InvoiceListPage />, index: true },
      //     { path: 'list', element: <InvoiceListPage /> },
      //     { path: ':id', element: <InvoiceDetailsPage /> },
      //     { path: ':id/edit', element: <InvoiceEditPage /> },
      //     { path: 'new', element: <InvoiceCreatePage /> },
      //   ],
      // },
      // {
      //   path: 'post',
      //   children: [
      //     { element: <BlogPostsPage />, index: true },
      //     { path: 'list', element: <BlogPostsPage /> },
      //     { path: ':title', element: <BlogPostPage /> },
      //     { path: ':title/edit', element: <BlogEditPostPage /> },
      //     { path: 'new', element: <BlogNewPostPage /> },
      //   ],
      // },
      // {
      //   path: 'job',
      //   children: [
      //     { element: <JobListPage />, index: true },
      //     { path: 'list', element: <JobListPage /> },
      //     { path: ':id', element: <JobDetailsPage /> },
      //     { path: 'new', element: <JobCreatePage /> },
      //     { path: ':id/edit', element: <JobEditPage /> },
      //   ],
      // },
      // {
      //   path: 'tour',
      //   children: [
      //     { element: <TourListPage />, index: true },
      //     { path: 'list', element: <TourListPage /> },
      //     { path: ':id', element: <TourDetailsPage /> },
      //     { path: 'new', element: <TourCreatePage /> },
      //     { path: ':id/edit', element: <TourEditPage /> },
      //   ],
      // },
      // { path: 'file-manager', element: <FileManagerPage /> },
      // { path: 'mail', element: <MailPage /> },
      // { path: 'chat', element: <ChatPage /> },
      // { path: 'calendar', element: <CalendarPage /> },
      // { path: 'kanban', element: <KanbanPage /> },
      // { path: 'permission', element: <PermissionDeniedPage /> },
      // { path: 'blank', element: <BlankPage /> },
    ],
  },
];
