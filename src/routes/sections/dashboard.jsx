import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
// const IndexPage = lazy(() => import('src/pages/dashboard/app'));
// const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
// const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
// const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
// const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));

// TABLES
const TablesListPage = lazy(() => import('src/pages/super-admin/dashboard/tables/list'));
// CITIES
const CitiesTablePage = lazy(() => import('src/pages/super-admin/dashboard/tables/cities/table'));
const CityCreatePage = lazy(() => import('src/pages/super-admin/dashboard/tables/cities/new'));
const CityEditPage = lazy(() => import('src/pages/super-admin/dashboard/tables/cities/edit'));
// COUNTRIES
const CountriesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/countries/table')
);
const CountryCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/countries/new')
);
const CountryEditPage = lazy(() => import('src/pages/super-admin/dashboard/tables/countries/edit'));
// COURENCY
const CurrencyTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/currency/table')
);
const CurrencyCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/currency/new')
);
const CurrencyEditPage = lazy(() => import('src/pages/super-admin/dashboard/tables/currency/edit'));
// SURGERIES
const SurgeriesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/surgeries/table')
);
const SurgeryCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/surgeries/new')
);
const SurgeryEditPage = lazy(() => import('src/pages/super-admin/dashboard/tables/surgeries/edit'));
// MEDICAL CATEEGORIES
const MedCatTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/medical-categories/table')
);
const MedCatCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/medical-categories/new')
);
const MedCatEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/medical-categories/edit')
);
// DISEASES
const DiseasesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/diseases/table')
);
const DiseaseCreatePage = lazy(() => import('src/pages/super-admin/dashboard/tables/diseases/new'));
const DiseaseEditPage = lazy(() => import('src/pages/super-admin/dashboard/tables/diseases/edit'));
// MEDICINES FAMILIES
const MedFamiliesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/medicines-families/table')
);
const MedFamilyCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/medicines-families/new')
);
const MedFamilyEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/medicines-families/edit')
);
// MEDICINES
const MedicinesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/medicines/table')
);
const MedicineCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/medicines/new')
);
const MedicineEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/medicines/edit')
);
// SYMPTOMS
const SymptomsTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/symptoms/table')
);
const SymptomCreatePage = lazy(() => import('src/pages/super-admin/dashboard/tables/symptoms/new'));
const SymptomEditPage = lazy(() => import('src/pages/super-admin/dashboard/tables/symptoms/edit'));
// DIETS
const DietsTablePage = lazy(() => import('src/pages/super-admin/dashboard/tables/diets/table'));
const DietCreatePage = lazy(() => import('src/pages/super-admin/dashboard/tables/diets/new'));
const DietEditPage = lazy(() => import('src/pages/super-admin/dashboard/tables/diets/edit'));
// ANALYSIS
const AnalysisTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/analysis/table')
);
const AnalysisCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/analysis/new')
);
const AnalysisEditPage = lazy(() => import('src/pages/super-admin/dashboard/tables/analysis/edit'));
// INSURANCE COMPANIES
const InsuranceCoTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/insurance-companies/table')
);
const InsuranceCoCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/insurance-companies/new')
);
const InsuranceCoEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/insurance-companies/edit')
);
// UNIT SERVICES
const USsTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/unit-services/table')
);
const USCreatePage = lazy(() => import('src/pages/super-admin/dashboard/tables/unit-services/new'));
const USEditPage = lazy(() => import('src/pages/super-admin/dashboard/tables/unit-services/edit'));
// DEPARTMENTS
const DepartmentsTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/departments/table')
);
const DepartmentCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/departments/new')
);
const DepartmentEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/departments/edit')
);
// SPECIALITIES
const SpecialitiesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/specialities/table')
);
const SpecialityCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/specialities/new')
);
const SpecialityEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/specialities/edit')
);
// SUBSPECIALITIES
const SubspecialitiesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/subspecialities/table')
);
const SubspecialityCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/subspecialities/new')
);
const SubspecialityEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/subspecialities/edit')
);
// APPOINTMENT TYPES
const AppoinTypesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/appointment-types/table')
);
const AppoinTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/appointment-types/new')
);
const AppoinTypeEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/appointment-types/edit')
);
// FREE SUBSCRIPTIONS
const FreeSubTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/free-subscriptions/table')
);
const FreeSubCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/free-subscriptions/new')
);
const FreeSubEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/free-subscriptions/edit')
);
// ADDED VALUE TAXES
const TaxesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/added-value-taxes/table')
);
const TaxCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/added-value-taxes/new')
);
const TaxEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/added-value-taxes/edit')
);
// UNIT SERVICE TYPES
const USTypesTablePage = lazy(() => import('src/pages/super-admin/dashboard/tables/ustypes/table'));
const USTypeCreatePage = lazy(() => import('src/pages/super-admin/dashboard/tables/ustypes/new'));
const USTypeEditPage = lazy(() => import('src/pages/super-admin/dashboard/tables/ustypes/edit'));
// ACTIVITIES
const ActivitiesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/activities/table')
);
const ActivityCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/activities/new')
);
const ActivityEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/activities/edit')
);
// EMPLOYEE TYPES
const EmployeeTypesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/employee_types/table')
);
const EmployeeTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/employee_types/new')
);
const EmployeeTypeEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/employee_types/edit')
);
// PAYMENT METHODS
const PaymentMethodsTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/payment_methods/table')
);
const PaymentMethodCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/payment_methods/new')
);
const PaymentMethodEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/payment_methods/edit')
);
// STAKEHOLDER TYPES
const StakeholderTypesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/stakeholder_types/table')
);
const StackholderTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/stakeholder_types/new')
);
const StackholderTypeEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/stakeholder_types/edit')
);
// WORK SHIFTS
const WorkShiftsTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/work_shifts/table')
);
const WorkShiftCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/work_shifts/new')
);
const WorkShiftEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/work_shifts/edit')
);
// SERVICE TYPES
const ServiceTypesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/service_types/table')
);
const ServiceTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/service_types/new')
);
const ServiceTypeEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/service_types/edit')
);
// MEASURMENT TYPES
const MeasurmentTypesTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/measurement_types/table')
);
const MeasurmentTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/measurement_types/new')
);
const MeasurmentTypeEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/measurement_types/edit')
);
// HOSPITAL LIST
const HospitalListTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/hospital_list/table')
);
const HospitalListCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/hospital_list/new')
);
const HospitalListEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/hospital_list/edit')
);
// DEDUTION CONFIG
const DeductionConfigTablePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/deduction_config/table')
);
const DeductionConfigCreatePage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/deduction_config/new')
);
const DeductionConfigEditPage = lazy(() =>
  import('src/pages/super-admin/dashboard/tables/deduction_config/edit')
);
// ROOMS
const RoomsTablePage = lazy(() => import('src/pages/super-admin/dashboard/tables/rooms/table'));
const RoomCreatePage = lazy(() => import('src/pages/super-admin/dashboard/tables/rooms/new'));
const RoomEditPage = lazy(() => import('src/pages/super-admin/dashboard/tables/rooms/edit'));
// UNITSERVICES SIDEBAR OPTIONS
const UnitservicesPage = lazy(() => import('src/pages/super-admin/dashboard/unitservices/home'));
// UNITSERVICES ACCOUNTING
const UnitserviceAccountingPage = lazy(() =>
  import('src/pages/super-admin/dashboard/unitservices/accounting/accounting')
);
const UnitserviceAddAccountingPage = lazy(() =>
  import('src/pages/super-admin/dashboard/unitservices/accounting/addAccounting')
);
const UnitserviceEditAccountingPage = lazy(() =>
  import('src/pages/super-admin/dashboard/unitservices/accounting/editAccounting')
);
// UNITSERVICES COMMUNICATIONS
const UnitserviceCommunicationsPage = lazy(() =>
  import('src/pages/super-admin/dashboard/unitservices/communications/communications')
);
// UNITSERVICES FEEDBACK
const UnitserviceFeedbackPage = lazy(() =>
  import('src/pages/super-admin/dashboard/unitservices/feedback/feedback')
);
// UNITSERVICES INSURANCE
const UnitserviceInsurancePage = lazy(() =>
  import('src/pages/super-admin/dashboard/unitservices/insurance/insurance')
);

// PATIENTS
const PatientsHomePage = lazy(() => import('src/pages/super-admin/dashboard/patients/home'));
const PatientsAddPage = lazy(() => import('src/pages/super-admin/dashboard/patients/add'));
const PatientsEditPage = lazy(() => import('src/pages/super-admin/dashboard/patients/edit'));
const PatientsInfoPage = lazy(() => import('src/pages/super-admin/dashboard/patients/info'));
const PatientsHistoryPage = lazy(() =>
import('src/pages/super-admin/dashboard/patients/history/history')
);
const PatientsBookAppointmentPage = lazy(() =>
import('src/pages/super-admin/dashboard/patients/history/bookAppointment')
);
const PatientsInsurancePage = lazy(() =>
import('src/pages/super-admin/dashboard/patients/insurance/insurance')
);
const PatientsCommunicationsPage = lazy(() =>
  import('src/pages/super-admin/dashboard/patients/communications/communications')
);
const PatientsFeedbackPage = lazy(() =>
import('src/pages/super-admin/dashboard/patients/feedback/feedback')
);

// ECONOMIC MOVEMENTS
const EconomicMovementInfoPage = lazy(() => import('src/pages/super-admin/dashboard/economic-movement/view-economic-movement'));


// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      // { element: <IndexPage />, index: true },
      // { path: '', element: < /> },
      {
        path: 'unitservices',
        children: [
          { element: <UnitservicesPage />, index: true },
          // { path: 'list', element: <UnitservicesPage /> },
          {
            path: ':id/accounting',
            children: [
              { element: <UnitserviceAccountingPage />, index: true },
              { path: 'new', element: <UnitserviceAddAccountingPage /> },
              { path: ':acid/edit', element: <UnitserviceEditAccountingPage /> },
            ],
          },
          { path: ':id/insurance', element: <UnitserviceInsurancePage /> },
          { path: ':id/communications', element: <UnitserviceCommunicationsPage /> },
          { path: ':id/feedback', element: <UnitserviceFeedbackPage /> },
        ],
      },
      {
        path: 'patients',
        children: [
          { element: <PatientsHomePage />, index: true },
          { path: ':id/info', element: <PatientsInfoPage /> },
          { path: 'add', element: <PatientsAddPage /> },
          { path: ':id/edit', element: <PatientsEditPage /> },
          { path: ':id/history', element: <PatientsHistoryPage /> },
          { path: ':id/bookappoint', element: <PatientsBookAppointmentPage /> },
          { path: ':id/insurance', element: <PatientsInsurancePage /> },
          { path: ':id/communications', element: <PatientsCommunicationsPage /> },
          { path: ':id/feedback', element: <PatientsFeedbackPage /> },
        ],
      },
      {
        path: 'economicmovement',
        children: [
          { element: <PatientsHomePage />, index: true },
          { path: ':id/info', element: <EconomicMovementInfoPage /> },
          { path: 'add', element: <PatientsAddPage /> },
          { path: ':id/edit', element: <PatientsEditPage /> },
          { path: ':id/history', element: <PatientsHistoryPage /> },
          { path: ':id/bookappoint', element: <PatientsBookAppointmentPage /> },
          { path: ':id/insurance', element: <PatientsInsurancePage /> },
          { path: ':id/communications', element: <PatientsCommunicationsPage /> },
          { path: ':id/feedback', element: <PatientsFeedbackPage /> },
        ],
      },
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
              { path: ':id/edit', element: <CityEditPage /> },
            ],
          },
          {
            path: 'countries',
            children: [
              { element: <CountriesTablePage />, index: true },
              { path: 'list', element: <CountriesTablePage /> },
              { path: 'new', element: <CountryCreatePage /> },
              { path: ':id/edit', element: <CountryEditPage /> },
            ],
          },
          {
            path: 'added_value_tax_GD',
            children: [
              { element: <TaxesTablePage />, index: true },
              { path: 'list', element: <TaxesTablePage /> },
              { path: 'new', element: <TaxCreatePage /> },
              { path: ':id/edit', element: <TaxEditPage /> },
            ],
          },
          {
            path: 'analyses',
            children: [
              { element: <AnalysisTablePage />, index: true },
              { path: 'list', element: <AnalysisTablePage /> },
              { path: 'new', element: <AnalysisCreatePage /> },
              { path: ':id/edit', element: <AnalysisEditPage /> },
            ],
          },
          {
            path: 'appointment_types',
            children: [
              { element: <AppoinTypesTablePage />, index: true },
              { path: 'list', element: <AppoinTypesTablePage /> },
              { path: 'new', element: <AppoinTypeCreatePage /> },
              { path: ':id/edit', element: <AppoinTypeEditPage /> },
            ],
          },
          {
            path: 'currencies',
            children: [
              { element: <CurrencyTablePage />, index: true },
              { path: 'list', element: <CurrencyTablePage /> },
              { path: 'new', element: <CurrencyCreatePage /> },
              { path: ':id/edit', element: <CurrencyEditPage /> },
            ],
          },
          {
            path: 'departments',
            children: [
              { element: <DepartmentsTablePage />, index: true },
              { path: 'list', element: <DepartmentsTablePage /> },
              { path: 'new', element: <DepartmentCreatePage /> },
              { path: ':id/edit', element: <DepartmentEditPage /> },
            ],
          },
          {
            path: 'diets',
            children: [
              { element: <DietsTablePage />, index: true },
              { path: 'list', element: <DietsTablePage /> },
              { path: 'new', element: <DietCreatePage /> },
              { path: ':id/edit', element: <DietEditPage /> },
            ],
          },
          {
            path: 'diseases',
            children: [
              { element: <DiseasesTablePage />, index: true },
              { path: 'list', element: <DiseasesTablePage /> },
              { path: 'new', element: <DiseaseCreatePage /> },
              { path: ':id/edit', element: <DiseaseEditPage /> },
            ],
          },
          {
            path: 'free_subscriptions',
            children: [
              { element: <FreeSubTablePage />, index: true },
              { path: 'list', element: <FreeSubTablePage /> },
              { path: 'new', element: <FreeSubCreatePage /> },
              { path: ':id/edit', element: <FreeSubEditPage /> },
            ],
          },
          {
            path: 'insurance_companies',
            children: [
              { element: <InsuranceCoTablePage />, index: true },
              { path: 'list', element: <InsuranceCoTablePage /> },
              { path: 'new', element: <InsuranceCoCreatePage /> },
              { path: ':id/edit', element: <InsuranceCoEditPage /> },
            ],
          },
          {
            path: 'medical_categories',
            children: [
              { element: <MedCatTablePage />, index: true },
              { path: 'list', element: <MedCatTablePage /> },
              { path: 'new', element: <MedCatCreatePage /> },
              { path: ':id/edit', element: <MedCatEditPage /> },
            ],
          },
          {
            path: 'medicines',
            children: [
              { element: <MedicinesTablePage />, index: true },
              { path: 'list', element: <MedicinesTablePage /> },
              { path: 'new', element: <MedicineCreatePage /> },
              { path: ':id/edit', element: <MedicineEditPage /> },
            ],
          },
          {
            path: 'medicines_families',
            children: [
              { element: <MedFamiliesTablePage />, index: true },
              { path: 'list', element: <MedFamiliesTablePage /> },
              { path: 'new', element: <MedFamilyCreatePage /> },
              { path: ':id/edit', element: <MedFamilyEditPage /> },
            ],
          },
          {
            path: 'specialities',
            children: [
              { element: <SpecialitiesTablePage />, index: true },
              { path: 'list', element: <SpecialitiesTablePage /> },
              { path: 'new', element: <SpecialityCreatePage /> },
              { path: ':id/edit', element: <SpecialityEditPage /> },
            ],
          },
          {
            path: 'sub_specialities',
            children: [
              { element: <SubspecialitiesTablePage />, index: true },
              { path: 'list', element: <SubspecialitiesTablePage /> },
              { path: 'new', element: <SubspecialityCreatePage /> },
              { path: ':id/edit', element: <SubspecialityEditPage /> },
            ],
          },
          {
            path: 'surgeries',
            children: [
              { element: <SurgeriesTablePage />, index: true },
              { path: 'list', element: <SurgeriesTablePage /> },
              { path: 'new', element: <SurgeryCreatePage /> },
              { path: ':id/edit', element: <SurgeryEditPage /> },
            ],
          },
          {
            path: 'symptoms',
            children: [
              { element: <SymptomsTablePage />, index: true },
              { path: 'list', element: <SymptomsTablePage /> },
              { path: 'new', element: <SymptomCreatePage /> },
              { path: ':id/edit', element: <SymptomEditPage /> },
            ],
          },
          {
            path: 'unit_services',
            children: [
              { element: <USsTablePage />, index: true },
              { path: 'list', element: <USsTablePage /> },
              { path: 'new', element: <USCreatePage /> },
              { path: ':id/edit', element: <USEditPage /> },
            ],
          },
          {
            path: 'unit_service_types',
            children: [
              { element: <USTypesTablePage />, index: true },
              { path: 'list', element: <USTypesTablePage /> },
              { path: 'new', element: <USTypeCreatePage /> },
              { path: ':id/edit', element: <USTypeEditPage /> },
            ],
          },
          {
            path: 'activities',
            children: [
              { element: <ActivitiesTablePage />, index: true },
              { path: 'list', element: <ActivitiesTablePage /> },
              { path: 'new', element: <ActivityCreatePage /> },
              { path: ':id/edit', element: <ActivityEditPage /> },
            ],
          },
          {
            path: 'employee_types',
            children: [
              { element: <EmployeeTypesTablePage />, index: true },
              { path: 'list', element: <EmployeeTypesTablePage /> },
              { path: 'new', element: <EmployeeTypeCreatePage /> },
              { path: ':id/edit', element: <EmployeeTypeEditPage /> },
            ],
          },
          {
            path: 'payment_methods',
            children: [
              { element: <PaymentMethodsTablePage />, index: true },
              { path: 'list', element: <PaymentMethodsTablePage /> },
              { path: 'new', element: <PaymentMethodCreatePage /> },
              { path: ':id/edit', element: <PaymentMethodEditPage /> },
            ],
          },
          {
            path: 'stakeholder_types',
            children: [
              { element: <StakeholderTypesTablePage />, index: true },
              { path: 'list', element: <StakeholderTypesTablePage /> },
              { path: 'new', element: <StackholderTypeCreatePage /> },
              { path: ':id/edit', element: <StackholderTypeEditPage /> },
            ],
          },
          {
            path: 'work_shifts',
            children: [
              { element: <WorkShiftsTablePage />, index: true },
              { path: 'list', element: <WorkShiftsTablePage /> },
              { path: 'new', element: <WorkShiftCreatePage /> },
              { path: ':id/edit', element: <WorkShiftEditPage /> },
            ],
          },
          {
            path: 'service_types',
            children: [
              { element: <ServiceTypesTablePage />, index: true },
              { path: 'list', element: <ServiceTypesTablePage /> },
              { path: 'new', element: <ServiceTypeCreatePage /> },
              { path: ':id/edit', element: <ServiceTypeEditPage /> },
            ],
          },
          {
            path: 'measurement_types',
            children: [
              { element: <MeasurmentTypesTablePage />, index: true },
              { path: 'list', element: <MeasurmentTypesTablePage /> },
              { path: 'new', element: <MeasurmentTypeCreatePage /> },
              { path: ':id/edit', element: <MeasurmentTypeEditPage /> },
            ],
          },
          {
            path: 'hospital_list',
            children: [
              { element: <HospitalListTablePage />, index: true },
              { path: 'list', element: <HospitalListTablePage /> },
              { path: 'new', element: <HospitalListCreatePage /> },
              { path: ':id/edit', element: <HospitalListEditPage /> },
            ],
          },
          {
            path: 'deduction_config',
            children: [
              { element: <DeductionConfigTablePage />, index: true },
              { path: 'list', element: <DeductionConfigTablePage /> },
              { path: 'new', element: <DeductionConfigCreatePage /> },
              { path: ':id/edit', element: <DeductionConfigEditPage /> },
            ],
          },
          {
            path: 'rooms',
            children: [
              { element: <RoomsTablePage />, index: true },
              { path: 'list', element: <RoomsTablePage /> },
              { path: 'new', element: <RoomCreatePage /> },
              { path: ':id/edit', element: <RoomEditPage /> },
            ],
          },
        ],
      },
    ],
  },
];
