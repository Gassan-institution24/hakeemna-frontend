import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// TABLES
const TablesListPage = lazy(() => import('src/pages/dashboard/tables/list'));
// CITIES
const CitiesTablePage = lazy(() => import('src/pages/dashboard/tables/cities/table'));
const CityCreatePage = lazy(() => import('src/pages/dashboard/tables/cities/new'));
const CityEditPage = lazy(() => import('src/pages/dashboard/tables/cities/edit'));
// COUNTRIES
const CountriesTablePage = lazy(() => import('src/pages/dashboard/tables/countries/table'));
const CountryCreatePage = lazy(() => import('src/pages/dashboard/tables/countries/new'));
const CountryEditPage = lazy(() => import('src/pages/dashboard/tables/countries/edit'));
// COURENCY
const CurrencyTablePage = lazy(() => import('src/pages/dashboard/tables/currency/table'));
const CurrencyCreatePage = lazy(() => import('src/pages/dashboard/tables/currency/new'));
const CurrencyEditPage = lazy(() => import('src/pages/dashboard/tables/currency/edit'));
// SURGERIES
const SurgeriesTablePage = lazy(() => import('src/pages/dashboard/tables/surgeries/table'));
const SurgeryCreatePage = lazy(() => import('src/pages/dashboard/tables/surgeries/new'));
const SurgeryEditPage = lazy(() => import('src/pages/dashboard/tables/surgeries/edit'));
// MEDICAL CATEEGORIES
const MedCatTablePage = lazy(() => import('src/pages/dashboard/tables/medical-categories/table'));
const MedCatCreatePage = lazy(() => import('src/pages/dashboard/tables/medical-categories/new'));
const MedCatEditPage = lazy(() => import('src/pages/dashboard/tables/medical-categories/edit'));
// DISEASES
const DiseasesTablePage = lazy(() => import('src/pages/dashboard/tables/diseases/table'));
const DiseaseCreatePage = lazy(() => import('src/pages/dashboard/tables/diseases/new'));
const DiseaseEditPage = lazy(() => import('src/pages/dashboard/tables/diseases/edit'));
// MEDICINES FAMILIES
const MedFamiliesTablePage = lazy(() =>
  import('src/pages/dashboard/tables/medicines-families/table')
);
const MedFamilyCreatePage = lazy(() => import('src/pages/dashboard/tables/medicines-families/new'));
const MedFamilyEditPage = lazy(() => import('src/pages/dashboard/tables/medicines-families/edit'));
// MEDICINES
const MedicinesTablePage = lazy(() => import('src/pages/dashboard/tables/medicines/table'));
const MedicineCreatePage = lazy(() => import('src/pages/dashboard/tables/medicines/new'));
const MedicineEditPage = lazy(() => import('src/pages/dashboard/tables/medicines/edit'));
// SYMPTOMS
const SymptomsTablePage = lazy(() => import('src/pages/dashboard/tables/symptoms/table'));
const SymptomCreatePage = lazy(() => import('src/pages/dashboard/tables/symptoms/new'));
const SymptomEditPage = lazy(() => import('src/pages/dashboard/tables/symptoms/edit'));
// DIETS
const DietsTablePage = lazy(() => import('src/pages/dashboard/tables/diets/table'));
const DietCreatePage = lazy(() => import('src/pages/dashboard/tables/diets/new'));
const DietEditPage = lazy(() => import('src/pages/dashboard/tables/diets/edit'));
// ANALYSIS
const AnalysisTablePage = lazy(() => import('src/pages/dashboard/tables/analysis/table'));
const AnalysisCreatePage = lazy(() => import('src/pages/dashboard/tables/analysis/new'));
const AnalysisEditPage = lazy(() => import('src/pages/dashboard/tables/analysis/edit'));
// INSURANCE COMPANIES
const InsuranceCoTablePage = lazy(() =>
  import('src/pages/dashboard/tables/insurance-companies/table')
);
const InsuranceCoCreatePage = lazy(() =>
  import('src/pages/dashboard/tables/insurance-companies/new')
);
const InsuranceCoEditPage = lazy(() =>
  import('src/pages/dashboard/tables/insurance-companies/edit')
);
// UNIT SERVICES
const USsTablePage = lazy(() => import('src/pages/dashboard/tables/unit-services/table'));
const USCreatePage = lazy(() => import('src/pages/dashboard/tables/unit-services/new'));
const USEditPage = lazy(() => import('src/pages/dashboard/tables/unit-services/edit'));
// DEPARTMENTS
const DepartmentsTablePage = lazy(() => import('src/pages/dashboard/tables/departments/table'));
const DepartmentCreatePage = lazy(() => import('src/pages/dashboard/tables/departments/new'));
const DepartmentEditPage = lazy(() => import('src/pages/dashboard/tables/departments/edit'));
// SPECIALITIES
const SpecialitiesTablePage = lazy(() => import('src/pages/dashboard/tables/specialities/table'));
const SpecialityCreatePage = lazy(() => import('src/pages/dashboard/tables/specialities/new'));
const SpecialityEditPage = lazy(() => import('src/pages/dashboard/tables/specialities/edit'));
// SUBSPECIALITIES
const SubspecialitiesTablePage = lazy(() =>
  import('src/pages/dashboard/tables/subspecialities/table')
);
const SubspecialityCreatePage = lazy(() =>
  import('src/pages/dashboard/tables/subspecialities/new')
);
const SubspecialityEditPage = lazy(() => import('src/pages/dashboard/tables/subspecialities/edit'));
// APPOINTMENT TYPES
const AppoinTypesTablePage = lazy(() =>
  import('src/pages/dashboard/tables/appointment-types/table')
);
const AppoinTypeCreatePage = lazy(() => import('src/pages/dashboard/tables/appointment-types/new'));
const AppoinTypeEditPage = lazy(() => import('src/pages/dashboard/tables/appointment-types/edit'));
// FREE SUBSCRIPTIONS
const FreeSubTablePage = lazy(() => import('src/pages/dashboard/tables/free-subscriptions/table'));
const FreeSubCreatePage = lazy(() => import('src/pages/dashboard/tables/free-subscriptions/new'));
const FreeSubEditPage = lazy(() => import('src/pages/dashboard/tables/free-subscriptions/edit'));
// ADDED VALUE TAXES
const TaxesTablePage = lazy(() => import('src/pages/dashboard/tables/added-value-taxes/table'));
const TaxCreatePage = lazy(() => import('src/pages/dashboard/tables/added-value-taxes/new'));
const TaxEditPage = lazy(() => import('src/pages/dashboard/tables/added-value-taxes/edit'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'super',
    element: (
      // <AuthGuard>
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
      // </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      // { path: '', element: < /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      {
        path: 'tables',
        children: [
          { element: <TablesListPage />, index: true },
          { path: 'list', element: <TablesListPage /> },
          {
            path: 'cities',
            children: [
              { element: <CitiesTablePage />, index: true },
              { path: 'list', element: <CitiesTablePage /> },
              { path: 'new', element: <CityCreatePage /> },
              { path: 'edit/:id', element: <CityEditPage /> },
            ],
          },
          {
            path: 'countries',
            children: [
              { element: <CountriesTablePage />, index: true },
              { path: 'list', element: <CountriesTablePage /> },
              { path: 'new', element: <CountryCreatePage /> },
              { path: 'edit/:id', element: <CountryEditPage /> },
            ],
          },
          {
            path: 'taxes',
            children: [
              { element: <TaxesTablePage />, index: true },
              { path: 'list', element: <TaxesTablePage /> },
              { path: 'new', element: <TaxCreatePage /> },
              { path: 'edit/:id', element: <TaxEditPage /> },
            ],
          },
          {
            path: 'analysis',
            children: [
              { element: <AnalysisTablePage />, index: true },
              { path: 'list', element: <AnalysisTablePage /> },
              { path: 'new', element: <AnalysisCreatePage /> },
              { path: 'edit/:id', element: <AnalysisEditPage /> },
            ],
          },
          {
            path: 'appointypes',
            children: [
              { element: <AppoinTypesTablePage />, index: true },
              { path: 'list', element: <AppoinTypesTablePage /> },
              { path: 'new', element: <AppoinTypeCreatePage /> },
              { path: 'edit/:id', element: <AppoinTypeEditPage /> },
            ],
          },
          {
            path: 'currency',
            children: [
              { element: <CurrencyTablePage />, index: true },
              { path: 'list', element: <CurrencyTablePage /> },
              { path: 'new', element: <CurrencyCreatePage /> },
              { path: 'edit/:id', element: <CurrencyEditPage /> },
            ],
          },
          {
            path: 'departments',
            children: [
              { element: <DepartmentsTablePage />, index: true },
              { path: 'list', element: <DepartmentsTablePage /> },
              { path: 'new', element: <DepartmentCreatePage /> },
              { path: 'edit/:id', element: <DepartmentEditPage /> },
            ],
          },
          {
            path: 'diets',
            children: [
              { element: <DietsTablePage />, index: true },
              { path: 'list', element: <DietsTablePage /> },
              { path: 'new', element: <DietCreatePage /> },
              { path: 'edit/:id', element: <DietEditPage /> },
            ],
          },
          {
            path: 'diseases',
            children: [
              { element: <DiseasesTablePage />, index: true },
              { path: 'list', element: <DiseasesTablePage /> },
              { path: 'new', element: <DiseaseCreatePage /> },
              { path: 'edit/:id', element: <DiseaseEditPage /> },
            ],
          },
          {
            path: 'freesub',
            children: [
              { element: <FreeSubTablePage />, index: true },
              { path: 'list', element: <FreeSubTablePage /> },
              { path: 'new', element: <FreeSubCreatePage /> },
              { path: 'edit/:id', element: <FreeSubEditPage /> },
            ],
          },
          {
            path: 'insurance/comapnies',
            children: [
              { element: <InsuranceCoTablePage />, index: true },
              { path: 'list', element: <InsuranceCoTablePage /> },
              { path: 'new', element: <InsuranceCoCreatePage /> },
              { path: 'edit/:id', element: <InsuranceCoEditPage /> },
            ],
          },
          {
            path: 'medcategories',
            children: [
              { element: <MedCatTablePage />, index: true },
              { path: 'list', element: <MedCatTablePage /> },
              { path: 'new', element: <MedCatCreatePage /> },
              { path: 'edit/:id', element: <MedCatEditPage /> },
            ],
          },
          {
            path: 'medicines',
            children: [
              { element: <MedicinesTablePage />, index: true },
              { path: 'list', element: <MedicinesTablePage /> },
              { path: 'new', element: <MedicineCreatePage /> },
              { path: 'edit/:id', element: <MedicineEditPage /> },
            ],
          },
          {
            path: 'medfamilies',
            children: [
              { element: <MedFamiliesTablePage />, index: true },
              { path: 'list', element: <MedFamiliesTablePage /> },
              { path: 'new', element: <MedFamilyCreatePage /> },
              { path: 'edit/:id', element: <MedFamilyEditPage /> },
            ],
          },
          {
            path: 'specialities',
            children: [
              { element: <SpecialitiesTablePage />, index: true },
              { path: 'list', element: <SpecialitiesTablePage /> },
              { path: 'new', element: <SpecialityCreatePage /> },
              { path: 'edit/:id', element: <SpecialityEditPage /> },
            ],
          },
          {
            path: 'subspecialities',
            children: [
              { element: <SubspecialitiesTablePage />, index: true },
              { path: 'list', element: <SubspecialitiesTablePage /> },
              { path: 'new', element: <SubspecialityCreatePage /> },
              { path: 'edit/:id', element: <SubspecialityEditPage /> },
            ],
          },
          {
            path: 'surgeries',
            children: [
              { element: <SurgeriesTablePage />, index: true },
              { path: 'list', element: <SurgeriesTablePage /> },
              { path: 'new', element: <SurgeryCreatePage /> },
              { path: 'edit/:id', element: <SurgeryEditPage /> },
            ],
          },
          {
            path: 'symptoms',
            children: [
              { element: <SymptomsTablePage />, index: true },
              { path: 'list', element: <SymptomsTablePage /> },
              { path: 'new', element: <SymptomCreatePage /> },
              { path: 'edit/:id', element: <SymptomEditPage /> },
            ],
          },
          {
            path: 'unitservices',
            children: [
              { element: <USsTablePage />, index: true },
              { path: 'list', element: <USsTablePage /> },
              { path: 'new', element: <USCreatePage /> },
              { path: 'edit/:id', element: <USEditPage /> },
            ],
          },
        ],
      },
    ],
  },
];
