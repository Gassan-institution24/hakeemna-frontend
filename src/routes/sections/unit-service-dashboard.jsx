import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
// const IndexPage = lazy(() => import('src/pages/app'));
// const OverviewEcommercePage = lazy(() => import('src/pages/ecommerce'));
// const OverviewAnalyticsPage = lazy(() => import('src/pages/analytics'));
// const OverviewBankingPage = lazy(() => import('src/pages/banking'));
// const OverviewBookingPage = lazy(() => import('src/pages/booking'));
// const OverviewFilePage = lazy(() => import('src/pages/file'));

// TABLES
const TablesListPage = lazy(() => import('src/pages/super-admin/tables/list'));
// CITIES
const CitiesTablePage = lazy(() => import('src/pages/super-admin/tables/cities/table'));
const CityCreatePage = lazy(() => import('src/pages/super-admin/tables/cities/new'));
const CityEditPage = lazy(() => import('src/pages/super-admin/tables/cities/edit'));
// COUNTRIES
const CountriesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/countries/table')
);
const CountryCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/countries/new')
);
const CountryEditPage = lazy(() => import('src/pages/super-admin/tables/countries/edit'));
// COURENCY
const CurrencyTablePage = lazy(() =>
  import('src/pages/super-admin/tables/currency/table')
);
const CurrencyCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/currency/new')
);
const CurrencyEditPage = lazy(() => import('src/pages/super-admin/tables/currency/edit'));
// SURGERIES
const SurgeriesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/surgeries/table')
);
const SurgeryCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/surgeries/new')
);
const SurgeryEditPage = lazy(() => import('src/pages/super-admin/tables/surgeries/edit'));
// MEDICAL CATEEGORIES
const MedCatTablePage = lazy(() =>
  import('src/pages/super-admin/tables/medical-categories/table')
);
const MedCatCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/medical-categories/new')
);
const MedCatEditPage = lazy(() =>
  import('src/pages/super-admin/tables/medical-categories/edit')
);
// DISEASES
const DiseasesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/diseases/table')
);
const DiseaseCreatePage = lazy(() => import('src/pages/super-admin/tables/diseases/new'));
const DiseaseEditPage = lazy(() => import('src/pages/super-admin/tables/diseases/edit'));
// MEDICINES FAMILIES
const MedFamiliesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/medicines-families/table')
);
const MedFamilyCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/medicines-families/new')
);
const MedFamilyEditPage = lazy(() =>
  import('src/pages/super-admin/tables/medicines-families/edit')
);
// MEDICINES
const MedicinesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/medicines/table')
);
const MedicineCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/medicines/new')
);
const MedicineEditPage = lazy(() =>
  import('src/pages/super-admin/tables/medicines/edit')
);
// SYMPTOMS
const SymptomsTablePage = lazy(() =>
  import('src/pages/super-admin/tables/symptoms/table')
);
const SymptomCreatePage = lazy(() => import('src/pages/super-admin/tables/symptoms/new'));
const SymptomEditPage = lazy(() => import('src/pages/super-admin/tables/symptoms/edit'));
// DIETS
const DietsTablePage = lazy(() => import('src/pages/super-admin/tables/diets/table'));
const DietCreatePage = lazy(() => import('src/pages/super-admin/tables/diets/new'));
const DietEditPage = lazy(() => import('src/pages/super-admin/tables/diets/edit'));
// ANALYSIS
const AnalysisTablePage = lazy(() =>
  import('src/pages/super-admin/tables/analysis/table')
);
const AnalysisCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/analysis/new')
);
const AnalysisEditPage = lazy(() => import('src/pages/super-admin/tables/analysis/edit'));
// INSURANCE COMPANIES
const InsuranceCoTablePage = lazy(() =>
  import('src/pages/super-admin/tables/insurance-companies/table')
);
const InsuranceCoCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/insurance-companies/new')
);
const InsuranceCoEditPage = lazy(() =>
  import('src/pages/super-admin/tables/insurance-companies/edit')
);
// UNIT SERVICES
const USsTablePage = lazy(() =>
  import('src/pages/super-admin/tables/unit-services/table')
);
const USCreatePage = lazy(() => import('src/pages/super-admin/tables/unit-services/new'));
const USEditPage = lazy(() => import('src/pages/super-admin/tables/unit-services/edit'));
// DEPARTMENTS
const DepartmentsTablePage = lazy(() =>
  import('src/pages/super-admin/tables/departments/table')
);
const DepartmentCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/departments/new')
);
const DepartmentEditPage = lazy(() =>
  import('src/pages/super-admin/tables/departments/edit')
);
// SPECIALITIES
const SpecialitiesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/specialities/table')
);
const SpecialityCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/specialities/new')
);
const SpecialityEditPage = lazy(() =>
  import('src/pages/super-admin/tables/specialities/edit')
);
// SUBSPECIALITIES
const SubspecialitiesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/subspecialities/table')
);
const SubspecialityCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/subspecialities/new')
);
const SubspecialityEditPage = lazy(() =>
  import('src/pages/super-admin/tables/subspecialities/edit')
);
// APPOINTMENT TYPES
const AppoinTypesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/appointment-types/table')
);
const AppoinTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/appointment-types/new')
);
const AppoinTypeEditPage = lazy(() =>
  import('src/pages/super-admin/tables/appointment-types/edit')
);
// FREE SUBSCRIPTIONS
const FreeSubTablePage = lazy(() =>
  import('src/pages/super-admin/tables/free-subscriptions/table')
);
const FreeSubCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/free-subscriptions/new')
);
const FreeSubEditPage = lazy(() =>
  import('src/pages/super-admin/tables/free-subscriptions/edit')
);
// ADDED VALUE TAXES
const TaxesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/added-value-taxes/table')
);
const TaxCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/added-value-taxes/new')
);
const TaxEditPage = lazy(() =>
  import('src/pages/super-admin/tables/added-value-taxes/edit')
);
// UNIT SERVICE TYPES
const USTypesTablePage = lazy(() => import('src/pages/super-admin/tables/ustypes/table'));
const USTypeCreatePage = lazy(() => import('src/pages/super-admin/tables/ustypes/new'));
const USTypeEditPage = lazy(() => import('src/pages/super-admin/tables/ustypes/edit'));
// ACTIVITIES
const ActivitiesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/activities/table')
);
const ActivityCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/activities/new')
);
const ActivityEditPage = lazy(() =>
  import('src/pages/super-admin/tables/activities/edit')
);
// EMPLOYEE TYPES
const EmployeeTypesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/employee_types/table')
);
const EmployeeTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/employee_types/new')
);
const EmployeeTypeEditPage = lazy(() =>
  import('src/pages/super-admin/tables/employee_types/edit')
);
// PAYMENT METHODS
const PaymentMethodsTablePage = lazy(() =>
  import('src/pages/super-admin/tables/payment_methods/table')
);
const PaymentMethodCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/payment_methods/new')
);
const PaymentMethodEditPage = lazy(() =>
  import('src/pages/super-admin/tables/payment_methods/edit')
);
// STAKEHOLDER TYPES
const StakeholderTypesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/stakeholder_types/table')
);
const StackholderTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/stakeholder_types/new')
);
const StackholderTypeEditPage = lazy(() =>
  import('src/pages/super-admin/tables/stakeholder_types/edit')
);
// WORK SHIFTS
const WorkShiftsTablePage = lazy(() =>
  import('src/pages/super-admin/tables/work_shifts/table')
);
const WorkShiftCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/work_shifts/new')
);
const WorkShiftEditPage = lazy(() =>
  import('src/pages/super-admin/tables/work_shifts/edit')
);
// SERVICE TYPES
const ServiceTypesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/service_types/table')
);
const ServiceTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/service_types/new')
);
const ServiceTypeEditPage = lazy(() =>
  import('src/pages/super-admin/tables/service_types/edit')
);
// MEASURMENT TYPES
const MeasurmentTypesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/measurement_types/table')
);
const MeasurmentTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/measurement_types/new')
);
const MeasurmentTypeEditPage = lazy(() =>
  import('src/pages/super-admin/tables/measurement_types/edit')
);
// HOSPITAL LIST
const HospitalListTablePage = lazy(() =>
  import('src/pages/super-admin/tables/hospital_list/table')
);
const HospitalListCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/hospital_list/new')
);
const HospitalListEditPage = lazy(() =>
  import('src/pages/super-admin/tables/hospital_list/edit')
);
// DEDUTION CONFIG
const DeductionConfigTablePage = lazy(() =>
  import('src/pages/super-admin/tables/deduction_config/table')
);
const DeductionConfigCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/deduction_config/new')
);
const DeductionConfigEditPage = lazy(() =>
  import('src/pages/super-admin/tables/deduction_config/edit')
);
// ROOMS
// const RoomsTablePage = lazy(() => import('src/pages/super-admin/tables/rooms/table'));
// const RoomCreatePage = lazy(() => import('src/pages/super-admin/tables/rooms/new'));
// const RoomEditPage = lazy(() => import('src/pages/super-admin/tables/rooms/edit'));
// UNITSERVICES SIDEBAR OPTIONS
const UnitservicesPage = lazy(() => import('src/pages/super-admin/unitservices/home'));
// UNITSERVICES ACCOUNTING
const UnitserviceAccountingPage = lazy(() =>
  import('src/pages/super-admin/unitservices/accounting/accounting')
);
const UnitserviceAddAccountingPage = lazy(() =>
  import('src/pages/super-admin/unitservices/accounting/addAccounting')
);
const UnitserviceEditAccountingPage = lazy(() =>
  import('src/pages/super-admin/unitservices/accounting/editAccounting')
);
// UNITSERVICES COMMUNICATIONS
const UnitserviceCommunicationsPage = lazy(() =>
  import('src/pages/super-admin/unitservices/communications/communications')
);
// UNITSERVICES FEEDBACK
const UnitserviceFeedbackPage = lazy(() =>
  import('src/pages/super-admin/unitservices/feedback/feedback')
);
// UNITSERVICES INSURANCE
const UnitserviceInsurancePage = lazy(() =>
  import('src/pages/super-admin/unitservices/insurance/insurance')
);
const UnitServiceInfoPage = lazy(() => import('src/pages/super-admin/unitservices/info'));

// PATIENTS
const PatientsHomePage = lazy(() => import('src/pages/super-admin/patients/home'));
const PatientsAddPage = lazy(() => import('src/pages/super-admin/patients/add'));
const PatientsEditPage = lazy(() => import('src/pages/super-admin/patients/edit'));
const PatientsInfoPage = lazy(() => import('src/pages/super-admin/patients/info'));
const PatientsHistoryPage = lazy(() =>
  import('src/pages/super-admin/patients/history/history')
);
const PatientsBookAppointmentPage = lazy(() =>
  import('src/pages/super-admin/patients/history/bookAppointment')
);
const PatientsInsurancePage = lazy(() =>
  import('src/pages/super-admin/patients/insurance/insurance')
);
const PatientsCommunicationsPage = lazy(() =>
  import('src/pages/super-admin/patients/communications/communications')
);
const PatientsFeedbackPage = lazy(() =>
  import('src/pages/super-admin/patients/feedback/feedback')
);
// ECONOMIC MOVEMENTS
const PatientInvoiceInfoPage = lazy(() =>
  import('src/pages/super-admin/patients/history/invoives/view-invoice')
);
const PatientPaymentInfoPage = lazy(() =>
  import('src/pages/super-admin/patients/history/payment/view-payment')
);

// STAKEHOLDERS
const StakeholdersHomePage = lazy(() =>
  import('src/pages/super-admin/stakeholders/home')
);
const StakeholdersAddPage = lazy(() => import('src/pages/super-admin/stakeholders/add'));
const StakeholdersEditPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/edit')
);
const StakeholdersInfoPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/info')
);
const StakeholdersHistoryPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/history/history')
);
const StakeholdersOffersPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/offers/offers')
);
const StakeholdersViewOfferPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/offers/viewOffer')
);
const StakeholdersBookAppointmentPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/history/bookAppointment')
);
const StakeholdersInsurancePage = lazy(() =>
  import('src/pages/super-admin/stakeholders/insurance/insurance')
);
const StakeholdersCommunicationsPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/communications/communications')
);
const StakeholdersFeedbackPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/feedback/feedback')
);
// ECONOMIC MOVEMENTS
const StakeholdersInvoiceInfoPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/history/invoices/view-invoice')
);
const StakeholdersPaymentInfoPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/history/payment/view-payment')
);

// ACCOUNTING
const AccountingHomePage = lazy(() => import('src/pages/super-admin/accounting/home'));
const AccountingUnitServicePage = lazy(() =>
  import('src/pages/super-admin/accounting/unitService')
);
const AddAccountingUnitServicePage = lazy(() =>
  import('src/pages/super-admin/accounting/addUSAcoounting')
);
const EditAccountingUnitServicePage = lazy(() =>
  import('src/pages/super-admin/accounting/editUSAccounting')
);
const AccountingStakeholderPage = lazy(() =>
  import('src/pages/super-admin/accounting/stakeholder')
);
const AddAccountingStakeholderPage = lazy(() =>
  import('src/pages/super-admin/accounting/addStakeholderAcoounting')
);
const EditAccountingStakeholderPage = lazy(() =>
  import('src/pages/super-admin/accounting/editStakeholderAccounting')
);

// STATISTICS
const StatisticsHomePage = lazy(() => import('src/pages/super-admin/statistics/home'));

// SUBSCRIPTIONS
const SubscriptionsHomePage = lazy(() => import('src/pages/super-admin/subscriptions/home'));
const SubscriptionsNewPage = lazy(() => import('src/pages/super-admin/subscriptions/add'));
const SubscriptionsEditPage = lazy(() => import('src/pages/super-admin/subscriptions/edit'));

// COMMUNICATION
const CommunicationHomePage = lazy(() =>
  import('src/pages/super-admin/communications/home')
);

// ACCESS CONTROL LIST
const AccessControleListHomePage = lazy(() =>
  import('src/pages/super-admin/accessControlList/home')
);

// CUSTOMER TRAINING
const CustomerTrainingHomePage = lazy(() =>
  import('src/pages/super-admin/customerTraining/home')
);

// DOCTORNA TEAM TRAINING
const DoctornaTeamTrainingHomePage = lazy(() =>
  import('src/pages/super-admin/doctornaTeamTraining/home')
);

// ADJUSTABLE SERVICES CONTROL
const AdjustableServicesControlHomePage = lazy(() =>
  import('src/pages/super-admin/adjustableServiceControl/home')
);

// QUALITY CONTROL
const QualityControlHomePage = lazy(() =>
  import('src/pages/super-admin/qualityControl/doctornaHome')
);
const QualityControlUnitServicesPage = lazy(() =>
  import('src/pages/super-admin/qualityControl/unit-services-QC')
);
const QualityControlStakeholdersPage = lazy(() =>
  import('src/pages/super-admin/qualityControl/stakeholders-QC')
);

// ----------------------------------------------------------------------

export const unitServiceDashboardRoutes = [
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
        path: 'appointments',
        children: [
          { element: <UnitservicesPage />, index: true },
          { path: ':id/info', element: <UnitServiceInfoPage /> },
          { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
          { path: 'new', element: <UnitserviceFeedbackPage /> },
        ],
      },
      // {
      //   path: 'statistics',
      //   children: [
      //     { element: <StatisticsHomePage />, index: true },
      //     { path: ':id/info', element: <UnitserviceInsurancePage /> },
      //     { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
      //     { path: 'new', element: <UnitserviceFeedbackPage /> },
      //   ],
      // },
      {
        path: 'employees',
        children: [
          { element: <AccessControleListHomePage />, index: true },
          { path: ':id/info', element: <UnitserviceInsurancePage /> },
          { path: ':id/appointments', element: <UnitserviceInsurancePage /> },
          { path: 'attendence', element: <UnitserviceInsurancePage /> },
          { path: ':id/edit', element: <UnitserviceFeedbackPage /> },
          { path: ':id/acl', element: <UnitserviceFeedbackPage /> },
          { path: 'new', element: <UnitserviceFeedbackPage /> },
        ],
      },
      {
        path: 'accounting',
        children: [
          { element: <AccountingHomePage />, index: true },
          {
            path: 'economicmovements',
            children: [
              { element: <CustomerTrainingHomePage />, index: true },
              { path: ':id/info', element: <UnitserviceInsurancePage /> },
              { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
              { path: 'new', element: <UnitserviceFeedbackPage /> },
            ],
          },
          {
            path: 'paymentcontrol',
            children: [
              { element: <CustomerTrainingHomePage />, index: true },
              { path: ':id/info', element: <UnitserviceInsurancePage /> },
              { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
              { path: 'new', element: <UnitserviceFeedbackPage /> },
            ],
          },
          {
            path: 'reciepts',
            children: [
              { element: <CustomerTrainingHomePage />, index: true },
              { path: ':id/info', element: <UnitserviceInsurancePage /> },
              { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
              { path: 'new', element: <UnitserviceFeedbackPage /> },
            ],
          },

        ],
      },
      {
        path: 'insurance',
        children: [
          { element: <CustomerTrainingHomePage />, index: true },
          { path: ':id/info', element: <UnitserviceInsurancePage /> },
          { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
          { path: 'new', element: <UnitserviceFeedbackPage /> },
        ],
      },
      {
        path: 'offers',
        children: [
          { element: <DoctornaTeamTrainingHomePage />, index: true },
          { path: ':id/info', element: <UnitserviceInsurancePage /> },
          { path: 'new', element: <UnitserviceFeedbackPage /> },
        ],
      },
      {
        path: 'communication',
        children: [
          { element: <CommunicationHomePage />, index: true },
        ],
      },
      {
        path: 'qc',
        children: [
          { element: <DoctornaTeamTrainingHomePage />, index: true },
        ],
      },
      {
        path: 'subscriptions',
        children: [
          { element: <SubscriptionsHomePage />, index: true },
          { path: 'new', element: <UnitserviceInsurancePage /> },
          { path: ':id/info', element: <UnitserviceInsurancePage /> },
        ],
      },
      {
        path: 'profile',
        children: [
          { element: <DoctornaTeamTrainingHomePage />, index: true },
          { path: 'edit', element: <UnitserviceCommunicationsPage /> },
        ],
      },
      {
        path: 'tables',
        children: [
          {
            path: 'appointment_types',
            children: [
              { element: <AppoinTypesTablePage />, index: true },
              { path: 'new', element: <AppoinTypeCreatePage /> },
              { path: ':id/edit', element: <AppoinTypeEditPage /> },
            ],
          },
          {
            path: 'activities',
            children: [
              { element: <ActivitiesTablePage />, index: true },
              { path: 'new', element: <ActivityCreatePage /> },
              { path: ':id/edit', element: <ActivityEditPage /> },
            ],
          },
          {
            path: 'employee_types',
            children: [
              { element: <EmployeeTypesTablePage />, index: true },
              { path: 'new', element: <EmployeeTypeCreatePage /> },
              { path: ':id/edit', element: <EmployeeTypeEditPage /> },
            ],
          },
          {
            path: 'work_shifts',
            children: [
              { element: <WorkShiftsTablePage />, index: true },
              { path: 'new', element: <WorkShiftCreatePage /> },
              { path: ':id/edit', element: <WorkShiftEditPage /> },
            ],
          },
          {
            path: 'work_groups',
            children: [
              { element: <WorkShiftsTablePage />, index: true },
              { path: 'new', element: <WorkShiftCreatePage /> },
              { path: ':id/edit', element: <WorkShiftEditPage /> },
            ],
          },
          {
            path: 'rooms',
            children: [
              { element: <WorkShiftsTablePage />, index: true },
              { path: 'new', element: <WorkShiftCreatePage /> },
              { path: ':id/edit', element: <WorkShiftEditPage /> },
            ],
          },
          {
            path: 'departments',
            children: [
              { element: <WorkShiftsTablePage />, index: true },
              { path: 'new', element: <WorkShiftCreatePage /> },
              { path: ':id/edit', element: <WorkShiftEditPage /> },
            ],
          },
        ],
      },
    ],
  },
];
