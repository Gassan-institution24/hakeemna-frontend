import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import UnitServiceNav from 'src/layouts/service-unit-topbar';
import UnitServiceDepartmentNavLayout from 'src/layouts/unitService-department-topbar';

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
const TablesListPage = lazy(() => import('src/pages/super-admin/tables/list'));
// CITIES
const CitiesTablePage = lazy(() => import('src/pages/super-admin/tables/cities/table'));
const CityCreatePage = lazy(() => import('src/pages/super-admin/tables/cities/new'));
const CityEditPage = lazy(() => import('src/pages/super-admin/tables/cities/edit'));
// COUNTRIES
const CountriesTablePage = lazy(() => import('src/pages/super-admin/tables/countries/table'));
const CountryCreatePage = lazy(() => import('src/pages/super-admin/tables/countries/new'));
const CountryEditPage = lazy(() => import('src/pages/super-admin/tables/countries/edit'));
// COURENCY
const CurrencyTablePage = lazy(() => import('src/pages/super-admin/tables/currency/table'));
const CurrencyCreatePage = lazy(() => import('src/pages/super-admin/tables/currency/new'));
const CurrencyEditPage = lazy(() => import('src/pages/super-admin/tables/currency/edit'));
// SURGERIES
const SurgeriesTablePage = lazy(() => import('src/pages/super-admin/tables/surgeries/table'));
const SurgeryCreatePage = lazy(() => import('src/pages/super-admin/tables/surgeries/new'));
const SurgeryEditPage = lazy(() => import('src/pages/super-admin/tables/surgeries/edit'));
// MEDICAL CATEEGORIES
const MedCatTablePage = lazy(() => import('src/pages/super-admin/tables/medical-categories/table'));
const MedCatCreatePage = lazy(() => import('src/pages/super-admin/tables/medical-categories/new'));
const MedCatEditPage = lazy(() => import('src/pages/super-admin/tables/medical-categories/edit'));
// DISEASES
const DiseasesTablePage = lazy(() => import('src/pages/super-admin/tables/diseases/table'));
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
const MedicinesTablePage = lazy(() => import('src/pages/super-admin/tables/medicines/table'));
const MedicineCreatePage = lazy(() => import('src/pages/super-admin/tables/medicines/new'));
const MedicineEditPage = lazy(() => import('src/pages/super-admin/tables/medicines/edit'));
// SYMPTOMS
const SymptomsTablePage = lazy(() => import('src/pages/super-admin/tables/symptoms/table'));
const SymptomCreatePage = lazy(() => import('src/pages/super-admin/tables/symptoms/new'));
const SymptomEditPage = lazy(() => import('src/pages/super-admin/tables/symptoms/edit'));
// DIETS
const DietsTablePage = lazy(() => import('src/pages/super-admin/tables/diets/table'));
const DietCreatePage = lazy(() => import('src/pages/super-admin/tables/diets/new'));
const DietEditPage = lazy(() => import('src/pages/super-admin/tables/diets/edit'));
// COMPANIES
const CompaniesTablePage = lazy(() => import('src/pages/super-admin/tables/companies_list/table'));
const CompanyCreatePage = lazy(() => import('src/pages/super-admin/tables/companies_list/new'));
const CompanyEditPage = lazy(() => import('src/pages/super-admin/tables/companies_list/edit'));
// ANALYSIS
const AnalysisTablePage = lazy(() => import('src/pages/super-admin/tables/analysis/table'));
const AnalysisCreatePage = lazy(() => import('src/pages/super-admin/tables/analysis/new'));
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
// unit of serviceS
const USsTablePage = lazy(() => import('src/pages/super-admin/tables/unit-services/table'));
const USCreatePage = lazy(() => import('src/pages/super-admin/tables/unit-services/new'));
const USEditPage = lazy(() => import('src/pages/super-admin/tables/unit-services/edit'));
// DEPARTMENTS
const DepartmentsTablePage = lazy(() => import('src/pages/super-admin/tables/departments/table'));
const DepartmentCreatePage = lazy(() => import('src/pages/super-admin/tables/departments/new'));
const DepartmentEditPage = lazy(() => import('src/pages/super-admin/tables/departments/edit'));
// SPECIALITIES
const SpecialitiesTablePage = lazy(() => import('src/pages/super-admin/tables/specialities/table'));
const SpecialityCreatePage = lazy(() => import('src/pages/super-admin/tables/specialities/new'));
const SpecialityEditPage = lazy(() => import('src/pages/super-admin/tables/specialities/edit'));
// TICKET CATEGORIES
const TicketCategoriesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/ticket_categories/table')
);
const TicketCategoryCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/ticket_categories/new')
);
const TicketCategoryEditPage = lazy(() =>
  import('src/pages/super-admin/tables/ticket_categories/edit')
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
const FreeSubCreatePage = lazy(() => import('src/pages/super-admin/tables/free-subscriptions/new'));
const FreeSubEditPage = lazy(() => import('src/pages/super-admin/tables/free-subscriptions/edit'));
// ADDED VALUE TAXES
const TaxesTablePage = lazy(() => import('src/pages/super-admin/tables/added-value-taxes/table'));
const TaxCreatePage = lazy(() => import('src/pages/super-admin/tables/added-value-taxes/new'));
const TaxEditPage = lazy(() => import('src/pages/super-admin/tables/added-value-taxes/edit'));
// unit of service TYPES
const USTypesTablePage = lazy(() => import('src/pages/super-admin/tables/ustypes/table'));
const USTypeCreatePage = lazy(() => import('src/pages/super-admin/tables/ustypes/new'));
const USTypeEditPage = lazy(() => import('src/pages/super-admin/tables/ustypes/edit'));
// ACTIVITIES
const ActivitiesTablePage = lazy(() => import('src/pages/super-admin/tables/activities/table'));
const ActivityCreatePage = lazy(() => import('src/pages/super-admin/tables/activities/new'));
const ActivityEditPage = lazy(() => import('src/pages/super-admin/tables/activities/edit'));
// EMPLOYEE TYPES
const EmployeeTypesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/employee_types/table')
);
const EmployeeTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/employee_types/new')
);
const EmployeeTypeEditPage = lazy(() => import('src/pages/super-admin/tables/employee_types/edit'));
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
const WorkShiftsTablePage = lazy(() => import('src/pages/super-admin/tables/work_shifts/table'));
const WorkShiftCreatePage = lazy(() => import('src/pages/super-admin/tables/work_shifts/new'));
const WorkShiftEditPage = lazy(() => import('src/pages/super-admin/tables/work_shifts/edit'));
// SERVICE TYPES
const ServiceTypesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/service_types/table')
);
const ServiceTypeCreatePage = lazy(() => import('src/pages/super-admin/tables/service_types/new'));
const ServiceTypeEditPage = lazy(() => import('src/pages/super-admin/tables/service_types/edit'));
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
const HospitalListCreatePage = lazy(() => import('src/pages/super-admin/tables/hospital_list/new'));
const HospitalListEditPage = lazy(() => import('src/pages/super-admin/tables/hospital_list/edit'));
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
// INSURANCE TYPES
const InsuranceTypesTablePage = lazy(() =>
  import('src/pages/super-admin/tables/insurance-types/table')
);
const InsuranceTypeCreatePage = lazy(() =>
  import('src/pages/super-admin/tables/insurance-types/new')
);
const InsuranceTypeEditPage = lazy(() =>
  import('src/pages/super-admin/tables/insurance-types/edit')
);
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

// UNITSERVICE DEPARTMENTS
const UnitServiceDepartmentsPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/home')
);
const UnitServiceDepartmentsNewPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/new')
);
const UnitServiceDepartmentsInfoPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/info')
);
const UnitServiceDepartmentsEmployeesPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/employees/home')
);
const UnitServiceDepartmentsEmployeesNewPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/employees/new')
);
const UnitServiceDepartmentsAccountingPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/accounting')
);
const UnitServiceDepartmentsActivitiesPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/activities/activities')
);
const UnitServiceDepartmentsNewActivitiesPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/activities/addActivitty')
);
const UnitServiceDepartmentsEditActivitiesPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/activities/editActivity')
);
const UnitServiceDepartmentsAppointmentsPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/appointments')
);
const UnitServiceDepartmentsAppointmentConfigPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/appointmentconfiguration')
);
const UnitServiceDepartmentsQualityControlPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/qualitycontrole')
);
const UnitServiceDepartmentsRoomsPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/rooms/rooms')
);
const UnitServiceDepartmentsNewRoomsPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/rooms/add')
);
const UnitServiceDepartmentsEditRoomsPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/rooms/edit')
);
const UnitServiceDepartmentsWorkGroupsPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/work-groups/home')
);
const UnitServiceDepartmentsNewWorkGroupsPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/work-groups/add')
);
const UnitServiceDepartmentsEditWorkGroupsPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/work-groups/edit')
);
const UnitServiceDepartmentsEditPage = lazy(() =>
  import('src/pages/super-admin/unitservices/departments/edit')
);

// UNITSERVICE APPOINTMENTS
const UnitServiceAppointmentsPage = lazy(() =>
  import('src/pages/super-admin/unitservices/appointments/index')
);

// UNITSERVICE EMPLOYEES
const UnitServiceEmployeesPage = lazy(() =>
  import('src/pages/super-admin/unitservices/employees/index')
);

// PATIENTS
const PatientsHomePage = lazy(() => import('src/pages/super-admin/patients/home'));
const PatientsAddPage = lazy(() => import('src/pages/super-admin/patients/add'));
const PatientsEditPage = lazy(() => import('src/pages/super-admin/patients/edit'));
const PatientsInfoPage = lazy(() => import('src/pages/super-admin/patients/info'));
const PatientsHistoryPage = lazy(() => import('src/pages/super-admin/patients/history/history'));
const PatientsBookAppointmentPage = lazy(() =>
  import('src/pages/super-admin/patients/history/bookAppointment')
);
const PatientsInsurancePage = lazy(() =>
  import('src/pages/super-admin/patients/insurance/insurance')
);
const PatientsCommunicationsPage = lazy(() =>
  import('src/pages/super-admin/patients/communications/communications')
);
const PatientsFeedbackPage = lazy(() => import('src/pages/super-admin/patients/feedback/feedback'));
// ECONOMIC MOVEMENTS
const PatientInvoiceInfoPage = lazy(() =>
  import('src/pages/super-admin/patients/history/invoives/view-invoice')
);
const PatientPaymentInfoPage = lazy(() =>
  import('src/pages/super-admin/patients/history/payment/view-payment')
);

// STAKEHOLDERS
const StakeholdersHomePage = lazy(() => import('src/pages/super-admin/stakeholders/home'));
const StakeholdersAddPage = lazy(() => import('src/pages/super-admin/stakeholders/add'));
const StakeholdersEditPage = lazy(() => import('src/pages/super-admin/stakeholders/edit'));
const StakeholdersInfoPage = lazy(() => import('src/pages/super-admin/stakeholders/info'));
const StakeholdersHistoryPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/history/history')
);
const StakeholdersOffersPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/offers/offers')
);
const StakeholdersViewOfferPage = lazy(() =>
  import('src/pages/super-admin/stakeholders/offers/viewOffer')
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
const CommunicationHomePage = lazy(() => import('src/pages/super-admin/communications/home'));
const CommunicationInfoPage = lazy(() =>
  import('src/pages/super-admin/communications/ticket-info')
);

// ACCESS CONTROL LIST
const AccessControleListHomePage = lazy(() =>
  import('src/pages/super-admin/accessControlList/home')
);

// CUSTOMER TRAINING
const CustomerTrainingHomePage = lazy(() => import('src/pages/super-admin/customerTraining/home'));

// DOCTORNA TEAM TRAINING
const DoctornaTeamTrainingHomePage = lazy(() =>
  import('src/pages/super-admin/doctornaTeamTraining/home')
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

// ADJUSTABLE SERVICE CONTROL
const AdjustableServicePage = lazy(() =>
  import('src/pages/super-admin/adjustableServiceControl/home')
);

// USERS
const UsersPage = lazy(() => import('src/pages/super-admin/users/index'));
const EditUserPage = lazy(() => import('src/pages/super-admin/users/edit'));
const AddUserPage = lazy(() => import('src/pages/super-admin/users/new'));

// EMPLOYEES
const EmployeesPage = lazy(() => import('src/pages/super-admin/employees/index'));
const EditEmployeePage = lazy(() => import('src/pages/super-admin/employees/edit'));
const AddEmployeePage = lazy(() => import('src/pages/super-admin/employees/new'));

// CALENDER
const CalenderPage = lazy(() => import('src/pages/super-admin/calender/calender'));

// MAIL
const MailPage = lazy(() => import('src/pages/super-admin/mail'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <RoleBasedGuard hasContent roles={['superadmin']}>
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
        path: 'ourcalender',
        element: <CalenderPage />,
      },
      {
        path: 'mail',
        element: <MailPage />,
      },
      {
        path: 'unitservices',
        children: [
          { element: <UnitservicesPage />, index: true },
          { path: 'new', element: <UnitserviceAddAccountingPage /> },
          {
            path: ':id',
            element: (
              <UnitServiceNav>
                <Outlet />
              </UnitServiceNav>
            ),
            children: [
              {
                path: 'accounting',
                children: [
                  { element: <UnitserviceAccountingPage />, index: true },
                  { path: 'edit', element: <UnitserviceEditAccountingPage /> },
                ],
              },
              { path: 'appointments', element: <UnitServiceAppointmentsPage /> },
              {
                path: 'departments',
                children: [
                  { element: <UnitServiceDepartmentsPage />, index: true },
                  { path: 'new', element: <UnitServiceDepartmentsNewPage /> },
                  { path: ':depid/edit', element: <UnitServiceDepartmentsEditPage /> },
                  {
                    path: ':depid',
                    element: (
                      <UnitServiceDepartmentNavLayout>
                        <Outlet />
                      </UnitServiceDepartmentNavLayout>
                    ),
                    children: [
                      { path: 'info', element: <UnitServiceDepartmentsInfoPage /> },
                      {
                        path: 'employees',
                        children: [
                          { element: <UnitServiceDepartmentsEmployeesPage />, index: true },
                          { path: 'new', element: <UnitServiceDepartmentsEmployeesNewPage /> },
                        ],
                      },
                      { path: 'accounting', element: <UnitServiceDepartmentsAccountingPage /> },
                      {
                        path: 'activities',
                        children: [
                          { element: <UnitServiceDepartmentsActivitiesPage />, index: true },
                          { path: 'new', element: <UnitServiceDepartmentsNewActivitiesPage /> },
                          {
                            path: ':acid/edit',
                            element: <UnitServiceDepartmentsEditActivitiesPage />,
                          },
                        ],
                      },
                      {
                        path: 'rooms',
                        children: [
                          { element: <UnitServiceDepartmentsRoomsPage />, index: true },
                          { path: 'new', element: <UnitServiceDepartmentsNewRoomsPage /> },
                          { path: ':acid/edit', element: <UnitServiceDepartmentsEditRoomsPage /> },
                        ],
                      },
                      {
                        path: 'wgroups',
                        children: [
                          { element: <UnitServiceDepartmentsWorkGroupsPage />, index: true },
                          { path: 'new', element: <UnitServiceDepartmentsNewWorkGroupsPage /> },
                          {
                            path: ':acid/edit',
                            element: <UnitServiceDepartmentsEditWorkGroupsPage />,
                          },
                        ],
                      },
                      { path: 'appointments', element: <UnitServiceDepartmentsAppointmentsPage /> },
                      {
                        path: 'appointmentconfiguration',
                        element: <UnitServiceDepartmentsAppointmentConfigPage />,
                      },
                      { path: 'qc', element: <UnitServiceDepartmentsQualityControlPage /> },
                    ],
                  },
                ],
              },
              { path: 'employees', element: <UnitServiceEmployeesPage /> },
              { path: 'info', element: <UnitServiceInfoPage /> },
              { path: 'insurance', element: <UnitserviceInsurancePage /> },
              { path: 'communications', element: <UnitserviceCommunicationsPage /> },
              { path: 'feedback', element: <UnitserviceFeedbackPage /> },
            ],
          },
          // { path: 'list', element: <UnitservicesPage /> },
        ],
      },
      {
        path: 'accounting',
        children: [
          { element: <AccountingHomePage />, index: true },
          { path: 'unitservice/:id', element: <AccountingUnitServicePage /> },
          { path: 'stakeholder/:id', element: <AccountingStakeholderPage /> },
          { path: 'unitservice/:id/new', element: <AddAccountingUnitServicePage /> },
          { path: 'unitservice/:id/edit/:acid', element: <EditAccountingUnitServicePage /> },
          { path: 'stakeholder/:id/new', element: <AddAccountingStakeholderPage /> },
          { path: 'stakeholder/:id/edit/:acid', element: <EditAccountingStakeholderPage /> },
          // { path: ':id/info', element: <UnitserviceInsurancePage /> },
        ],
      },
      {
        path: 'statistics',
        children: [
          { element: <StatisticsHomePage />, index: true },
          { path: ':id/info', element: <UnitserviceInsurancePage /> },
          { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
          { path: 'add', element: <UnitserviceFeedbackPage /> },
        ],
      },
      {
        path: 'subscriptions',
        children: [
          { element: <SubscriptionsHomePage />, index: true },
          { path: ':id/info', element: <UnitserviceInsurancePage /> },
          { path: ':id/edit', element: <SubscriptionsEditPage /> },
          { path: 'new', element: <SubscriptionsNewPage /> },
        ],
      },
      {
        path: 'communication',
        children: [
          { element: <CommunicationHomePage />, index: true },
          { path: ':id', element: <CommunicationInfoPage /> },
          // { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
          // { path: 'add', element: <UnitserviceFeedbackPage /> },
        ],
      },
      {
        path: 'acl',
        children: [
          { element: <AccessControleListHomePage />, index: true },
          { path: ':id/info', element: <UnitserviceInsurancePage /> },
          { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
          { path: 'add', element: <UnitserviceFeedbackPage /> },
        ],
      },
      {
        path: 'training',
        children: [
          { element: <CustomerTrainingHomePage />, index: true },
          { path: ':id/info', element: <UnitserviceInsurancePage /> },
          { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
          { path: 'add', element: <UnitserviceFeedbackPage /> },
        ],
      },
      {
        path: 'traineeship',
        children: [
          { element: <DoctornaTeamTrainingHomePage />, index: true },
          { path: ':id/info', element: <UnitserviceInsurancePage /> },
          { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
          { path: 'add', element: <UnitserviceFeedbackPage /> },
        ],
      },
      {
        path: 'asc',
        children: [
          { element: <AdjustableServicePage />, index: true },
          { path: ':id/info', element: <UnitserviceInsurancePage /> },
          { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
          { path: 'add', element: <UnitserviceFeedbackPage /> },
        ],
      },
      {
        path: 'users',
        children: [
          { element: <UsersPage />, index: true },
          { path: 'new', element: <AddUserPage /> },
          // { path: ':id/user', element: <UnitserviceInsurancePage /> },
          { path: ':id/edit', element: <EditUserPage /> },
        ],
      },
      {
        path: 'employees',
        children: [
          { element: <EmployeesPage />, index: true },
          { path: 'new', element: <AddEmployeePage /> },
          // { path: ':id/user', element: <UnitserviceInsurancePage /> },
          { path: ':id/edit', element: <EditEmployeePage /> },
        ],
      },
      {
        path: 'qc',
        children: [
          { path: 'doctorna', element: <QualityControlHomePage /> },
          { path: 'unitservices', element: <QualityControlUnitServicesPage /> },
          { path: 'stakeholders', element: <QualityControlStakeholdersPage /> },
          { path: ':id/edit', element: <UnitserviceCommunicationsPage /> },
          { path: 'add', element: <UnitserviceFeedbackPage /> },
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
          {
            path: ':id/invoices',
            children: [{ path: ':inid/info', element: <PatientInvoiceInfoPage /> }],
          },
          {
            path: ':id/payment',
            children: [{ path: ':inid/info', element: <PatientPaymentInfoPage /> }],
          },
        ],
      },
      {
        path: 'stakeholders',
        children: [
          { element: <StakeholdersHomePage />, index: true },
          { path: ':id/info', element: <StakeholdersInfoPage /> },
          { path: 'add', element: <StakeholdersAddPage /> },
          { path: ':id/edit', element: <StakeholdersEditPage /> },
          { path: ':id/history', element: <StakeholdersHistoryPage /> },
          { path: ':id/offers', element: <StakeholdersOffersPage /> },
          { path: ':id/offers/:ofid', element: <StakeholdersViewOfferPage /> },
          { path: ':id/insurance', element: <StakeholdersInsurancePage /> },
          { path: ':id/communications', element: <StakeholdersCommunicationsPage /> },
          { path: ':id/feedback', element: <StakeholdersFeedbackPage /> },
          {
            path: ':id/invoices',
            children: [{ path: ':inid/info', element: <StakeholdersInvoiceInfoPage /> }],
          },
          {
            path: ':id/payment',
            children: [{ path: ':inid/info', element: <StakeholdersPaymentInfoPage /> }],
          },
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
            path: 'companies',
            children: [
              { element: <CompaniesTablePage />, index: true },
              { path: 'list', element: <CompaniesTablePage /> },
              { path: 'new', element: <CompanyCreatePage /> },
              { path: ':id/edit', element: <CompanyEditPage /> },
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
            path: 'ticket_categories',
            children: [
              { element: <TicketCategoriesTablePage />, index: true },
              { path: 'list', element: <TicketCategoriesTablePage /> },
              { path: 'new', element: <TicketCategoryCreatePage /> },
              { path: ':id/edit', element: <TicketCategoryEditPage /> },
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
            path: 'insurance_types',
            children: [
              { element: <InsuranceTypesTablePage />, index: true },
              { path: 'list', element: <InsuranceTypesTablePage /> },
              { path: 'new', element: <InsuranceTypeCreatePage /> },
              { path: ':id/edit', element: <InsuranceTypeEditPage /> },
            ],
          },
        ],
      },
    ],
  },
];
