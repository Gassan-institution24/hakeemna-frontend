import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import SecondaryNavLayout from 'src/layouts/employee-topbar';
import DepartmentNavLayout from 'src/layouts/department-topbar';
import WorkGroupsNavLayout from 'src/layouts/workgroups-topbar';
import EmployeeMinBarLayout from 'src/layouts/employees-minibar';
import DepartmentsNavLayout from 'src/layouts/departments-topbar';
import PermissionsNavLayout from 'src/layouts/permissions-topbar';
import EmployeePermissionWGLayout from 'src/layouts/permissions-minibar';
import USWorkGroupPermissionsBarLayout from 'src/layouts/US-workgroup-permission-minibar';
import DepartmentWorkGroupPermissionsBarLayout from 'src/layouts/department-workgroup-permission-minibar';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
// DEPARTMENTS
const DepartmentsHomePage = lazy(() => import('src/pages/unit-service/departments/home'));
const DepartmentsNewPage = lazy(() => import('src/pages/unit-service/departments/new'));
const DepartmentsInfoPage = lazy(() => import('src/pages/unit-service/departments/info'));
const DepartmentsEmployeesPage = lazy(() =>
  import('src/pages/unit-service/departments/employees/home')
);
const DepartmentsEmployeesNewPage = lazy(() =>
  import('src/pages/unit-service/departments/employees/new')
);
const DepartmentsAccountingPage = lazy(() =>
  import('src/pages/unit-service/departments/accounting')
);
const DepartmentsActivitiesPage = lazy(() =>
  import('src/pages/unit-service/departments/activities/activities')
);
const DepartmentsNewActivitiesPage = lazy(() =>
  import('src/pages/unit-service/departments/activities/addActivitty')
);
const DepartmentsEditActivitiesPage = lazy(() =>
  import('src/pages/unit-service/departments/activities/editActivity')
);
const DepartmentsAppointmentsPage = lazy(() =>
  import('src/pages/unit-service/departments/appointments')
);
const DepartmentsAppointmentConfigPage = lazy(() =>
  import('src/pages/unit-service/departments/appointmentconfiguration')
);
const DepartmentsQualityControlPage = lazy(() =>
  import('src/pages/unit-service/departments/qualitycontrole')
);
const DepartmentsRoomsPage = lazy(() => import('src/pages/unit-service/departments/rooms/rooms'));
const DepartmentsNewRoomsPage = lazy(() => import('src/pages/unit-service/departments/rooms/add'));
const DepartmentsEditRoomsPage = lazy(() =>
  import('src/pages/unit-service/departments/rooms/edit')
);
const DepartmentsWorkGroupsPage = lazy(() =>
  import('src/pages/unit-service/departments/work-groups/home')
);
const DepartmentsNewWorkGroupsPage = lazy(() =>
  import('src/pages/unit-service/departments/work-groups/add')
);
const DepartmentsWorkGroupsPermissionPage = lazy(() =>
  import('src/pages/unit-service/departments/work-groups/permissions/home')
);
const DepartmentsWorkGroupsEmployeePermissionPage = lazy(() =>
  import('src/pages/unit-service/departments/work-groups/permissions/employee')
);
const DepartmentsEditWorkGroupsPage = lazy(() =>
  import('src/pages/unit-service/departments/work-groups/edit')
);
// const DepartmentsPermissionsPage = lazy(() =>
//   import('src/pages/unit-service/departments/permissions/home')
// );
// const DepartmentsEmployeePermissionsPage = lazy(() =>
//   import('src/pages/unit-service/departments/permissions/employee')
// );
const DepartmentsEditPage = lazy(() => import('src/pages/unit-service/departments/edit'));
// EMPLOYEES
const EmployeesHomePage = lazy(() => import('src/pages/unit-service/employees/home'));
const EmployeesInfoPage = lazy(() => import('src/pages/unit-service/employees/info'));
const EmployeesAppointmentsPage = lazy(() =>
  import('src/pages/unit-service/employees/appontiments')
);
const EmployeesAppointmentConfigPage = lazy(() =>
  import('src/pages/unit-service/employees/appoint-config')
);
const EmployeesAppointmentConfigDetailsPage = lazy(() =>
  import('src/pages/unit-service/employees/appoint-config-detail')
);
const EmployeesNewAppointmentConfigPage = lazy(() =>
  import('src/pages/unit-service/employees/new-appoint-config')
);
const EmployeesAccountingPage = lazy(() => import('src/pages/unit-service/employees/accounting'));
const EmployeesFeedbackPage = lazy(() => import('src/pages/unit-service/employees/feedback'));
const EmployeesAttendencePage = lazy(() => import('src/pages/unit-service/employees/attendence'));
const EmployeesOffersPage = lazy(() => import('src/pages/unit-service/employees/offers'));
const EmployeesEditPage = lazy(() => import('src/pages/unit-service/employees/edit'));
const EmployeesACLPage = lazy(() => import('src/pages/unit-service/employees/acl'));
const EmployeesNewPage = lazy(() => import('src/pages/unit-service/employees/new'));
// ACTIVITIES
const ActivitiesHomePage = lazy(() => import('src/pages/unit-service/activities/home'));
const ActivitiesEditPage = lazy(() => import('src/pages/unit-service/activities/edit'));
const ActivitiesNewPage = lazy(() => import('src/pages/unit-service/activities/new'));
// APPOINTMENTS
const AppointmentsHomePage = lazy(() => import('src/pages/unit-service/appointments/home'));
const AppointmentsEditPage = lazy(() => import('src/pages/unit-service/appointments/edit'));
const AppointmentsBookPage = lazy(() => import('src/pages/unit-service/appointments/book'));

// ACCOUNTING
// ECONOMIC MOVEMENTS
const EconomicHomePage = lazy(() =>
  import('src/pages/unit-service/accounting/economic-movements/home')
);
const EconomicInfoPage = lazy(() =>
  import('src/pages/unit-service/accounting/economic-movements/info')
);
const EconomicEditPage = lazy(() =>
  import('src/pages/unit-service/accounting/economic-movements/edit')
);
const EconomicNewPage = lazy(() =>
  import('src/pages/unit-service/accounting/economic-movements/new')
);
// PAYMENT CONTROL
const PaymentControlHomePage = lazy(() =>
  import('src/pages/unit-service/accounting/payment-control/home')
);
// RECEIPTS
const ReceiptsHomePage = lazy(() => import('src/pages/unit-service/accounting/reciepts/home'));
const ReceiptsInfoPage = lazy(() => import('src/pages/unit-service/accounting/reciepts/info'));
const InvoicingHomePage = lazy(() => import('src/pages/unit-service/accounting/invoicing/home'));
// INSURANCE
const InsuranceHomePage = lazy(() => import('src/pages/unit-service/insurance/home'));
// PRODUCTS
const ProductsHomePage = lazy(() => import('src/pages/unit-service/products/stakeholders'));
const OfferInfoPage = lazy(() => import('src/pages/unit-service/products/offer-info'));
// COMMUNICATION
const CommunicationHomePage = lazy(() => import('src/pages/unit-service/communication/home'));
// QUALITY CONTROL
const QCHomePage = lazy(() => import('src/pages/unit-service/qualitycontrol/home'));
// SUBSCRIPTIONS
const SubscriptionsHomePage = lazy(() => import('src/pages/unit-service/subscriptions/home'));
const SubscriptionsNewPage = lazy(() => import('src/pages/unit-service/subscriptions/new'));
const SubscriptionsInfoPage = lazy(() => import('src/pages/unit-service/subscriptions/info'));
// PROFILE
const ProfileHomePage = lazy(() => import('src/pages/unit-service/profile/home'));
const ProfileEditPage = lazy(() => import('src/pages/unit-service/profile/edit'));
// TABLES
// // APPOINTMENT TYPES
// const AppointmentTypesHomePage = lazy(() =>
//   import('src/pages/unit-service/tables/appointment-types/home')
// );
// const AppointmentTypesNewPage = lazy(() =>
//   import('src/pages/unit-service/tables/appointment-types/new')
// );
// const AppointmentTypesEditPage = lazy(() =>
//   import('src/pages/unit-service/tables/appointment-types/edit')
// );
// EMPLOYEE TYPES
// const EmployeeTypesHomePage = lazy(() =>
//   import('src/pages/unit-service/tables/employee-types/home')
// );
// const EmployeeTypesNewPage = lazy(() => import('src/pages/unit-service/tables/employee-types/new'));
// const EmployeeTypesEditPage = lazy(() =>
//   import('src/pages/unit-service/tables/employee-types/edit')
// );
// WORK SHIFTS
const WorkShiftsHomePage = lazy(() => import('src/pages/unit-service/tables/work-shifts/home'));
const WorkShiftsNewPage = lazy(() => import('src/pages/unit-service/tables/work-shifts/new'));
const WorkShiftsEditPage = lazy(() => import('src/pages/unit-service/tables/work-shifts/edit'));
// WORK GROUPS
const WorkGroupsHomePage = lazy(() => import('src/pages/unit-service/tables/work-groups/home'));
const WorkGroupsNewPage = lazy(() => import('src/pages/unit-service/tables/work-groups/new'));
const WorkGroupsEditPage = lazy(() => import('src/pages/unit-service/tables/work-groups/edit'));
const WorkGroupsPermissionPage = lazy(() =>
  import('src/pages/unit-service/tables/work-groups/permissions/home')
);
const WorkGroupsEmployeePermissionPage = lazy(() =>
  import('src/pages/unit-service/tables/work-groups/permissions/employee')
);
// ROOMS
const RoomsHomePage = lazy(() => import('src/pages/unit-service/tables/rooms/home'));
const RoomsNewPage = lazy(() => import('src/pages/unit-service/tables/rooms/new'));
const RoomsEditPage = lazy(() => import('src/pages/unit-service/tables/rooms/edit'));
// Services
const ServicesHomePage = lazy(() => import('src/pages/unit-service/tables/services/home'));
const ServicesNewPage = lazy(() => import('src/pages/unit-service/tables/services/new'));
const ServicesEditPage = lazy(() => import('src/pages/unit-service/tables/services/edit'));
const Processing = lazy(() => import('src/sections/employee/appointmentsToday/Processing'));
const Viewgpage = lazy(() => import('src/sections/employee/appointmentsToday/viewgpage'));
const Test = lazy(() => import('src/sections/employee/appointmentsToday/prescription'));

// OLD PATIENT
const OldPatientPage = lazy(() => import('src/pages/unit-service/old-patient/home'));

// ORDERS
const OrdersPage = lazy(() => import('src/pages/unit-service/orders/list'));
const OrdersDetailsPage = lazy(() => import('src/pages/unit-service/orders/details'));

// PATIENTS
const PatientsPage = lazy(() => import('src/pages/unit-service/patients/patients_table'));
const PatientInfoPage = lazy(() => import('src/pages/unit-service/patients/patient-profile'));
const PatientNewPage = lazy(() => import('src/pages/unit-service/patients/new-patient'));

// PRODUCTS
const AllProductsPage = lazy(() => import('src/pages/unit-service/products/all-products'));
const ProductsStakeholdersPage = lazy(() => import('src/pages/unit-service/products/stakeholders'));
const StakeholderProductsPage = lazy(() =>
  import('src/pages/unit-service/products/stakeholder-products')
);
const ProductCheckoutPage = lazy(() => import('src/pages/unit-service/products/checkout'));
// const PatientInfoPage = lazy(() => import('src/pages/unit-service/patients/patient-profile'));

// PERMISSIONS
const USPermissions = lazy(() =>
  import('src/pages/unit-service/permissions/unitservice-permission')
);
const DepartmentsPermissions = lazy(() =>
  import('src/pages/unit-service/permissions/departments-permission')
);
const WorkGroupsPermissions = lazy(() =>
  import('src/pages/unit-service/permissions/workgroup-permission')
);
const EmployeesList = lazy(() => import('src/pages/unit-service/permissions/employees-list'));
const EmployeeUSPermission = lazy(() =>
  import('src/pages/unit-service/permissions/employee-us-permissions')
);
const EmployeeDepartmentPermission = lazy(() =>
  import('src/pages/unit-service/permissions/employee-department-permissions')
);
const EmployeeWGPermission = lazy(() =>
  import('src/pages/unit-service/permissions/employee-workgroup-permissions')
);
// ----------------------------------------------------------------------

export const unitServiceDashboardRoutes = [
  {
    path: 'dashboard/us',
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
      {
        path: 'acl',
        children: [
          {
            path: 'employees',
            children: [
              { element: <EmployeesList />, index: true },
              {
                path: ':id',
                element: (
                  <PermissionsNavLayout>
                    <Outlet />
                  </PermissionsNavLayout>
                ),
                children: [
                  { path: 'us', element: <EmployeeUSPermission /> },
                  { path: 'departments/:depId', element: <EmployeeDepartmentPermission /> },
                  {
                    path: 'workgroups',
                    element: (
                      <EmployeePermissionWGLayout>
                        <Outlet />
                      </EmployeePermissionWGLayout>
                    ),
                    children: [
                      { element: <EmployeeWGPermission />, index: true },
                      { path: ':wgid', element: <EmployeeWGPermission /> },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: 'unitservice',
            element: (
              <EmployeeMinBarLayout>
                <USPermissions />
              </EmployeeMinBarLayout>
            ),
            children: [{ path: ':id', element: <USPermissions /> }],
          },
          {
            path: 'departments',
            element: (
              <EmployeeMinBarLayout>
                <DepartmentsNavLayout>
                  <DepartmentsPermissions />
                </DepartmentsNavLayout>
              </EmployeeMinBarLayout>
            ),
            children: [
              {
                path: ':depId',
                element: (
                  <EmployeeMinBarLayout>
                    <DepartmentsPermissions />
                  </EmployeeMinBarLayout>
                ),
                children: [
                  {
                    path: ':emid',
                    element: (
                      <EmployeeMinBarLayout>
                        <DepartmentsPermissions />
                      </EmployeeMinBarLayout>
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: 'workgroups',
            element: (
              <EmployeeMinBarLayout>
                <WorkGroupsNavLayout>
                  <WorkGroupsPermissions />
                </WorkGroupsNavLayout>
              </EmployeeMinBarLayout>
            ),
            children: [
              {
                path: ':wgid',
                element: (
                  <EmployeeMinBarLayout>
                    <WorkGroupsPermissions />
                  </EmployeeMinBarLayout>
                ),
                children: [
                  {
                    path: ':emid',
                    element: (
                      <EmployeeMinBarLayout>
                        <WorkGroupsPermissions />
                      </EmployeeMinBarLayout>
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: 'processingpage/:id', element: <Processing /> },
      { path: 'viewgpage/:id', element: <Viewgpage /> },
      { path: 'test', element: <Test /> },
      {
        path: 'appointments',
        children: [
          { element: <AppointmentsHomePage />, index: true },
          { path: 'list', element: <AppointmentsHomePage /> },
          { path: ':id/edit', element: <AppointmentsEditPage /> },
          { path: 'book', element: <AppointmentsBookPage /> },
        ],
      },
      {
        path: 'patients',
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
        path: 'offers',
        children: [
          { element: <ProductsHomePage />, index: true },
          { path: 'offer/:id', element: <OfferInfoPage /> },
        ],
      },
      {
        path: 'profile',
        children: [
          { element: <ProfileHomePage />, index: true },
          { path: 'settings', element: <ProfileHomePage /> },
          { path: 'edit', element: <ProfileEditPage /> },
          {
            path: 'insurance',
            children: [{ element: <InsuranceHomePage />, index: true }],
          },
          {
            path: 'communication',
            children: [{ element: <CommunicationHomePage />, index: true }],
          },
          {
            path: 'qc',
            children: [{ element: <QCHomePage />, index: true }],
          },
          {
            path: 'subscriptions',
            children: [
              { element: <SubscriptionsHomePage />, index: true },
              { path: 'new', element: <SubscriptionsNewPage /> },
              { path: ':id/info', element: <SubscriptionsInfoPage /> },
            ],
          },
        ],
      },
      {
        path: 'oldpatient',
        children: [
          { element: <OldPatientPage />, index: true },
          { path: 'new', element: <RoomsNewPage /> },
          { path: ':id/edit', element: <RoomsEditPage /> },
        ],
      },
      {
        path: 'products',
        children: [
          { element: <AllProductsPage />, index: true },
          { path: 'all', element: <AllProductsPage /> },
          { path: 'stakeholder', element: <ProductsStakeholdersPage /> },
          { path: 'stakeholder/:shid', element: <StakeholderProductsPage /> },
          { path: 'checkout', element: <ProductCheckoutPage /> },
          { path: 'offer/:id', element: <OfferInfoPage /> },
          { path: ':id/edit', element: <RoomsEditPage /> },
          {
            path: 'orders',
            children: [
              { element: <OrdersPage />, index: true },
              { path: ':id/details', element: <OrdersDetailsPage /> },
            ],
          },
        ],
      },
      {
        path: 'tables',
        children: [
          // {
          //   path: 'appointment_types',
          //   children: [
          //     { element: <AppointmentTypesHomePage />, index: true },
          //     { path: 'new', element: <AppointmentTypesNewPage /> },
          //     { path: ':id/edit', element: <AppointmentTypesEditPage /> },
          //   ],
          // },
          // {
          //   path: 'employee_types',
          //   children: [
          //     { element: <EmployeeTypesHomePage />, index: true },
          //     { path: 'new', element: <EmployeeTypesNewPage /> },
          //     { path: ':id/edit', element: <EmployeeTypesEditPage /> },
          //   ],
          // },
          {
            path: 'departments',
            children: [
              { element: <DepartmentsHomePage />, index: true },
              { path: 'new', element: <DepartmentsNewPage /> },
              { path: ':id/edit', element: <DepartmentsEditPage /> },
              {
                path: ':id',
                element: (
                  <DepartmentNavLayout>
                    <Outlet />
                  </DepartmentNavLayout>
                ),
                children: [
                  { path: 'info', element: <DepartmentsInfoPage /> },
                  {
                    path: 'employees',
                    children: [
                      { element: <DepartmentsEmployeesPage />, index: true },
                      { path: 'new', element: <DepartmentsEmployeesNewPage /> },
                    ],
                  },
                  { path: 'accounting', element: <DepartmentsAccountingPage /> },
                  {
                    path: 'activities',
                    children: [
                      { element: <DepartmentsActivitiesPage />, index: true },
                      { path: 'new', element: <DepartmentsNewActivitiesPage /> },
                      { path: ':acid/edit', element: <DepartmentsEditActivitiesPage /> },
                    ],
                  },
                  {
                    path: 'rooms',
                    children: [
                      { element: <DepartmentsRoomsPage />, index: true },
                      { path: 'new', element: <DepartmentsNewRoomsPage /> },
                      { path: ':acid/edit', element: <DepartmentsEditRoomsPage /> },
                    ],
                  },
                  {
                    path: 'wgroups',
                    children: [
                      { element: <DepartmentsWorkGroupsPage />, index: true },
                      { path: 'new', element: <DepartmentsNewWorkGroupsPage /> },
                      {
                        path: ':wgid',
                        element: (
                          <DepartmentWorkGroupPermissionsBarLayout>
                            <Outlet />
                          </DepartmentWorkGroupPermissionsBarLayout>
                        ),
                        children: [
                          { element: <DepartmentsWorkGroupsPermissionPage />, index: true },
                          {
                            path: 'employee/:emid',
                            element: <DepartmentsWorkGroupsEmployeePermissionPage />,
                          },
                        ],
                      },
                      { path: ':acid/edit', element: <DepartmentsEditWorkGroupsPage /> },
                    ],
                  },
                  { path: 'appointments', element: <DepartmentsAppointmentsPage /> },
                  {
                    path: 'appointmentconfiguration',
                    element: <DepartmentsAppointmentConfigPage />,
                  },
                  { path: 'qc', element: <DepartmentsQualityControlPage /> },
                ],
              },
            ],
          },
          {
            path: 'employees',
            children: [
              { element: <EmployeesHomePage />, index: true },
              { path: 'new', element: <EmployeesNewPage /> },
              {
                path: ':id',
                element: (
                  <SecondaryNavLayout>
                    <EmployeeMinBarLayout>
                      <Outlet />
                    </EmployeeMinBarLayout>
                  </SecondaryNavLayout>
                ),
                children: [
                  { path: 'info', element: <EmployeesInfoPage /> },
                  { path: 'appointments', element: <EmployeesAppointmentsPage /> },
                  { path: 'appointmentconfig', element: <EmployeesAppointmentConfigPage /> },
                  { path: 'appointmentconfig/new', element: <EmployeesNewAppointmentConfigPage /> },
                  {
                    path: 'appointmentconfig/:coid',
                    element: <EmployeesAppointmentConfigDetailsPage />,
                  },
                  { path: 'accounting', element: <EmployeesAccountingPage /> },
                  { path: 'feedback', element: <EmployeesFeedbackPage /> },
                  { path: 'attendence', element: <EmployeesAttendencePage /> },
                  { path: 'offers', element: <EmployeesOffersPage /> },
                  { path: 'acl', element: <EmployeesACLPage /> },
                  { path: 'edit', element: <EmployeesEditPage /> },
                ],
              },
            ],
          },
          {
            path: 'activities',
            children: [
              { element: <ActivitiesHomePage />, index: true },
              { path: 'new', element: <ActivitiesNewPage /> },
              { path: ':id/edit', element: <ActivitiesEditPage /> },
            ],
          },
          {
            path: 'work_shifts',
            children: [
              { element: <WorkShiftsHomePage />, index: true },
              { path: 'new', element: <WorkShiftsNewPage /> },
              { path: ':id/edit', element: <WorkShiftsEditPage /> },
            ],
          },
          {
            path: 'work_groups',
            children: [
              { element: <WorkGroupsHomePage />, index: true },
              { path: 'new', element: <WorkGroupsNewPage /> },
              { path: ':id/edit', element: <WorkGroupsEditPage /> },
              {
                path: ':wgid',
                element: (
                  <USWorkGroupPermissionsBarLayout>
                    <Outlet />
                  </USWorkGroupPermissionsBarLayout>
                ),
                children: [
                  { element: <WorkGroupsPermissionPage />, index: true },
                  { path: 'employee/:emid', element: <WorkGroupsEmployeePermissionPage /> },
                ],
              },
            ],
          },
          {
            path: 'rooms',
            children: [
              { element: <RoomsHomePage />, index: true },
              { path: 'new', element: <RoomsNewPage /> },
              { path: ':id/edit', element: <RoomsEditPage /> },
            ],
          },
          {
            path: 'services',
            children: [
              { element: <ServicesHomePage />, index: true },
              { path: 'new', element: <ServicesNewPage /> },
              { path: ':id/edit', element: <ServicesEditPage /> },
            ],
          },
        ],
      },
    ],
  },
];
