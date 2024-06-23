import { useMemo, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import socket from 'src/socket';
import { useTranslate } from 'src/locales';
import { useGetUnreadMsgs } from 'src/api/chat';
import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// import { useSnackbar } from 'src/components/snackbar';
// import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function useNavData() {
  const router = useRouter();
  // const { logout } = useAuthContext();
  // const popover = usePopover();
  // const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const checkAcl = useAclGuard();
  const { messages, refetch } = useGetUnreadMsgs(user._id);

  useEffect(() => {
    socket.on('message', (id) => {
      if (messages.some((one) => one._id === id)) {
        refetch();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const employees_number =
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
      ?.employees_number || 10;

  // const handleLogout = useCallback(async () => {
  //   try {
  //     popover.onClose();
  //     logout();
  //     router.replace('/login');
  //   } catch (error) {
  //     console.error(error);
  //     enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
  //   }
  // }, [logout, popover, enqueueSnackbar, router]);

  const data = useMemo(() => {
    const superAdminItems = [
      {
        subheader: t('overview'),
        items: [
          // {
          //   title: t('app'),
          //   path: paths.dashboard.root,
          //   icon: ICONS.dashboard,
          // },
          {
            title: t('calender'),
            path: paths.superadmin.ourCalendar,
            icon: <Iconify icon="simple-line-icons:calender" />,
          },
          {
            title: t('units of service'),
            path: paths.superadmin.unitservices.root,
            icon: <Iconify icon="fa-solid:clinic-medical" />,
          },
          {
            title: t('patients'),
            path: paths.superadmin.patients.root,
            icon: <Iconify icon="iconamoon:profile-bold" />,
          },
          {
            title: t('stakeholders'),
            path: paths.superadmin.stakeholders.root,
            icon: <Iconify icon="material-symbols:sell-sharp" />,
          },
          {
            title: t('users'),
            path: paths.superadmin.users.root,
            icon: <Iconify icon="mdi:people-group-outline" />,
          },
          {
            title: t('employees'),
            path: paths.superadmin.employees.root,
            icon: <Iconify icon="fluent:people-20-filled" />,
          },
          {
            title: t('accounting'),
            path: paths.superadmin.accounting.root,
            icon: <Iconify icon="streamline:subscription-cashflow-solid" />,
          },
          {
            title: t('subscriptions'),
            path: paths.superadmin.subscriptions.root,
            icon: <Iconify icon="eos-icons:activate-subscriptions" />,
          },
          // {
          //   title: t('mail'),
          //   path: paths.superadmin.mail,
          //   icon: <Iconify icon="eos-icons:activate-subscriptions" />,
          // },
          {
            title: t('quality control'),
            path: paths.superadmin.qualityControl.root,
            icon: <Iconify icon="healthicons:world-care" />,
            children: [
              { title: t('Doctorna online'), path: paths.superadmin.qualityControl.doctorna },
              { title: t('units of service'), path: paths.superadmin.qualityControl.unitservices },
              { title: t('Stakeholders'), path: paths.superadmin.qualityControl.stakeholders },
            ],
          },
          {
            title: t('communications'),
            path: paths.superadmin.communication.root,
            icon: <Iconify icon="solar:call-chat-bold" />,
            info: (
              <Label color="info" startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}>
                {messages?.reduce((acc, chat) => acc + chat.messages.length, 0)}
              </Label>
            ),
          },
          {
            title: t('management tables'),
            path: paths.superadmin.tables.root,
            icon: <Iconify icon="icon-park-twotone:data" />,
          },
          {
            title: t('statistics'),
            path: paths.superadmin.statistics.root,
            icon: <Iconify icon="akar-icons:statistic-up" />,
          },
          {
            title: t('access control list'),
            path: paths.superadmin.accessControlList.root,
            icon: <Iconify icon="mdi:user-access-control" />,
          },
          {
            title: t('customers training'),
            path: paths.superadmin.customersTraining.root,
            icon: <Iconify icon="mdi:teach" />,
          },
          {
            title: t('our team training'),
            path: paths.superadmin.doctornaTeamTraining.root,
            icon: <Iconify icon="healthicons:i-training-class" />,
          },
          {
            title: t('Adjustable Services Control'),
            path: paths.superadmin.adjustableServices.root,
            icon: <Iconify icon="ic:sharp-published-with-changes" />,
          },
          // {
          //   title: t('management tables'),
          //   path: paths.superadmin.tables.root,
          //   icon: <Iconify icon="iconamoon:profile-bold" />,
          //   children: [
          //     { title: t('list'), path: paths.superadmin.tables.list },
          //     { title: t('cities'), path: paths.superadmin.tables.cities.root },
          //     { title: t('countries'), path: paths.superadmin.tables.countries.root },
          //     { title: t('currency'), path: paths.superadmin.tables.currency.root },
          //     { title: t('surgeries'), path: paths.superadmin.tables.surgeries.root },
          //     { title: t('medical categories'), path: paths.superadmin.tables.medcategories.root },
          //     { title: t('diseases'), path: paths.superadmin.tables.diseases.root },
          //     { title: t('medicines families'), path: paths.superadmin.tables.medfamilies.root },
          //     { title: t('medicines'), path: paths.superadmin.tables.medicines.root },
          //     { title: t('symptoms'), path: paths.superadmin.tables.symptoms.root },
          //     { title: t('diets'), path: paths.superadmin.tables.diets.root },
          //     { title: t('analyses'), path: paths.superadmin.tables.analysis.root },
          //     { title: t('insurance companies'), path: paths.superadmin.tables.insurancecomapnies.root },
          //     { title: t('units of service'), path: paths.superadmin.tables.unitservices.root },
          //     { title: t('departments'), path: paths.superadmin.tables.departments.root },
          //     { title: t('specialities'), path: paths.superadmin.tables.specialities.root },
          //     { title: t('subspecialities'), path: paths.superadmin.tables.subspecialities.root },
          //     { title: t('appointment types'), path: paths.superadmin.tables.appointypes.root },
          //     { title: t('free subscriptions'), path: paths.superadmin.tables.freesub.root },
          //     { title: t('added value taxes'), path: paths.superadmin.tables.taxes.root },
          //     { title: t('unit of service types'), path: paths.superadmin.tables.unitservicetypes.root },
          //     { title: t('activities'), path: paths.superadmin.tables.activities.root },
          //     { title: t('employee types'), path: paths.superadmin.tables.employeetypes.root },
          //     { title: t('payment methods'), path: paths.superadmin.tables.paymentmethods.root },
          //     { title: t('stakeholder types'), path: paths.superadmin.tables.stakeholdertypes.root },
          //     { title: t('work shifts'), path: paths.superadmin.tables.workshifts.root },
          //     { title: t('service types'), path: paths.superadmin.tables.servicetypes.root },
          //     { title: t('measurement types'), path: paths.superadmin.tables.measurementtypes.root },
          //     { title: t('hospital list'), path: paths.superadmin.tables.hospitallist.root },
          //     { title: t('deduction config'), path: paths.superadmin.tables.deductionconfig.root },
          //     { title: t('rooms'), path: paths.superadmin.tables.rooms.root },
          //   ],
          // },
        ],
      },
    ];
    const unitServiceManagementTables = [
      // show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }), {
      //   title: t('appointment types'), path: paths.unitservice.tables.appointypes.root },
      // {
      //   show: checkAcl({
      //     category: 'unit_service',
      //     subcategory: 'management_tables',
      //     acl: 'read',
      //   }),
      //   title: t('employee types'),
      //   path: paths.unitservice.tables.employeetypes.root,
      // },
      {
        show:
          checkAcl({ category: 'unit_service', subcategory: 'departments', acl: 'read' }) &&
          employees_number > 3,
        title: t('departments'),
        path: paths.unitservice.departments.root,
        // icon: <Iconify icon="uis:web-section-alt" />,
      },
      {
        show: checkAcl({
          category: 'unit_service',
          subcategory: 'management_tables',
          acl: 'read',
        }),
        title: t('work shifts'),
        path: paths.unitservice.tables.workshifts.root,
        navItemId: 'USWorkShiftNav',
      },
      {
        show: checkAcl({
          category: 'unit_service',
          subcategory: 'management_tables',
          acl: 'read',
        }),
        title: t('work groups'),
        path: paths.unitservice.tables.workgroups.root,
        navItemId: 'USWorkGroupNav',
      },
      {
        show: checkAcl({
          category: 'unit_service',
          subcategory: 'management_tables',
          acl: 'read',
        }),
        title: t('services'),
        path: paths.unitservice.tables.services.root,
        navItemId: 'USServicesNav',
      },
      {
        show: checkAcl({
          category: 'unit_service',
          subcategory: 'management_tables',
          acl: 'read',
        }),
        title: t('rooms'),
        path: paths.unitservice.tables.rooms.root,
        navItemId: 'USRoomsNav',
      },
      {
        show: checkAcl({
          category: 'unit_service',
          subcategory: 'management_tables',
          acl: 'read',
        }),
        title: t('activities'),
        path: paths.unitservice.tables.activities.root,
        navItemId: 'USActivitiesNav',
        // icon: <Iconify icon="material-symbols:volunteer-activism" />,
      },
    ];
    const unitServiceItems = [
      {
        show:
          checkAcl({ category: 'unit_service', subcategory: 'departments', acl: 'read' }) &&
          employees_number > 3,
        title: t('departments'),
        path: paths.unitservice.departments.root,
        icon: <Iconify icon="uis:web-section-alt" />,
        navItemId: 'USDepartmentNav',
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'management_tables', acl: 'read' }),
        title: t('management tables'),
        path: paths.unitservice.tables.root,
        icon: <Iconify icon="icon-park-twotone:data" />,
        navItemId: 'USTablesNav',
        children: unitServiceManagementTables.filter((item) => item.show),
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'employees', acl: 'read' }),
        title: t('employees'),
        path: paths.unitservice.employees.root,
        icon: <Iconify icon="fluent:people-20-filled" />,
        navItemId: 'USEmployeesNav',
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'permissions', acl: 'read' }),
        title: t('permissions'),
        path: paths.unitservice.acl.root,
        icon: <Iconify icon="mdi:account-secure" />,
        children: [
          { title: t('unit of service level'), path: paths.unitservice.acl.unitservice },
          { title: t('departments level'), path: paths.unitservice.acl.department },
          { title: t('work groups level'), path: paths.unitservice.acl.workgroups },
          { title: t('employee permission'), path: paths.unitservice.acl.employees },
        ],
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'read' }),
        title: t('appointments'),
        path: paths.unitservice.appointments.root,
        icon: <Iconify icon="fluent-mdl2:date-time-mirrored" />,
        navItemId: 'USAppointmentsNav',
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'update' }),
        title: t('book appointments'),
        path: paths.unitservice.appointments.book,
        icon: <Iconify icon="material-symbols:add-ad" />,
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'old_patient', acl: 'read' }),
        title: t('institution patients'),
        path: paths.unitservice.patients.all,
        icon: <Iconify icon="streamline:health-care-2-solid" />,
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'unit_service_info', acl: 'read' }),
        title: t('products and suppliers'),
        path: paths.unitservice.products.root,
        icon: <Iconify icon="fluent-mdl2:product" />,
        navItemId: 'USProductsNav',
        children: [
          {
            show: checkAcl({ category: 'unit_service', subcategory: 'unit_service_info', acl: 'read' }),
            title: t('all products'),
            path: paths.unitservice.products.all,
          },
          {
            show: checkAcl({ category: 'unit_service', subcategory: 'unit_service_info', acl: 'read' }),
            title: t('suppliers'),
            path: paths.unitservice.products.stakeholder.root,
          },
        ],
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'unit_service_info', acl: 'read' }),
        title: t('orders'),
        path: paths.unitservice.orders.root,
        icon: <Iconify icon="material-symbols:shopping-cart-outline-rounded" />,
        navItemId: 'USInsuranceNav',
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),
        title: t('accounting'),
        path: paths.unitservice.accounting.root,
        icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
        navItemId: 'USAccountingNav',
        children: [
          {
            show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),
            title: t('economic movements'),
            path: paths.unitservice.accounting.economicmovements.root,
          },
          {
            show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),
            title: t('payment control'),
            path: paths.unitservice.accounting.paymentcontrol.root,
          },
          {
            show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),
            title: t('reciepts'),
            path: paths.unitservice.accounting.reciepts.root,
          },
        ],
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'unit_service_info', acl: 'read' }),
        title: t('insurance'),
        path: paths.unitservice.insurance.root,
        icon: <Iconify icon="ic:baseline-security" />,
        navItemId: 'USInsuranceNav',
      },
      {
        show:
          false &&
          checkAcl({ category: 'unit_service', subcategory: 'unit_service_info', acl: 'read' }),
        title: t('communication'),
        path: paths.unitservice.communication.root,
        icon: <Iconify icon="solar:call-chat-bold" />,
        navItemId: 'USCommunicationNav',
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'quality_control', acl: 'read' }),
        title: t('quality control'),
        path: paths.unitservice.qualityControl.root,
        icon: <Iconify icon="healthicons:world-care" />,
        navItemId: 'USQualityControlNav',
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'unit_service_info', acl: 'read' }),
        title: t('subscriptions'),
        path: paths.unitservice.subscriptions.root,
        icon: <Iconify icon="streamline:subscription-cashflow-solid" />,
        navItemId: 'USSubscriptionsNav',
      },
      {
        show: checkAcl({
          category: 'unit_service',
          subcategory: 'unit_service_info',
          acl: 'update',
        }),
        title: t('unit of service info'),
        path: paths.unitservice.profile.root,
        icon: <Iconify icon="fa-solid:clinic-medical" />,
        navItemId: 'USInfoNav',
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'old_patient', acl: 'read' }),
        title: t('old patient data'),
        path: paths.unitservice.oldPatient,
        icon: <Iconify icon="entypo:upload" />,
        navItemId: 'USOldPatientsNav',
      },
    ];
    const unitServicesDashboars = [
      {
        subheader: t('institution control panel'),
        items: unitServiceItems.filter((item) => item.show),
      },
    ];
    const employeeItems = [
      {
        show:
          // false &&
          checkAcl({
            category: 'work_group',
            subcategory: 'entrance_management',
            acl: 'read',
          }),
        title: t('entrance management'),
        path: paths.employee.entrancemanagement.root,
        icon: <Iconify icon="oi:timer" />,
        navItemId: 'EMEntranceNav',
      },
      {
        show: checkAcl({ category: 'work_group', subcategory: 'appointments', acl: 'read' }),
        title: t('my appointments'),
        path: paths.employee.appointments.root,
        icon: <Iconify icon="fluent-mdl2:date-time-mirrored" />,
        navItemId: 'EMAppointmentsNav',
      },
      {
        show: checkAcl({ category: 'work_group', subcategory: 'appointments', acl: 'update' }),
        title: t('book appointments'),
        path: paths.employee.appointments.book,
        icon: <Iconify icon="material-symbols:add-ad" />,
        navItemId: 'EMAppointmentsNav',
      },
      {
        show: checkAcl({ category: 'work_group', subcategory: 'appointment_configs', acl: 'read' }),
        title: t('my appointment configuration'),
        path: paths.employee.appointmentconfiguration.root,
        icon: <Iconify icon="fluent:content-settings-16-regular" />,
        navItemId: 'EMAppointConfigNav',
      },
      {
        show: checkAcl({ category: 'work_group', subcategory: 'appointments', acl: 'read' }),
        title: t('my patients'),
        path: paths.employee.patients.all,
        icon: <Iconify icon="streamline:health-care-2-solid" />,
      },
      {
        show: checkAcl({ category: 'work_group', subcategory: 'appointments', acl: 'read' }),
        title: t('my checklist'),
        path: paths.employee.checklist.root,
        icon: <Iconify icon="solar:checklist-outline" />,
        navItemId: 'EMChecklistNav',
      },
      {
        show: true,
        title: t('my work groups'),
        path: paths.employee.workGroups.root,
        icon: <Iconify icon="heroicons:user-group-solid" />,
        navItemId: 'EMWorkGroupsNav',
      },
      {
        show: true,
        title: t('my accounting'),
        path: paths.employee.accounting.root,
        icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
        navItemId: 'EMAccountingNav',
      },
      {
        show: false,
        title: t('my communication'),
        path: paths.employee.communication.root,
        icon: <Iconify icon="solar:call-chat-bold" />,
        navItemId: 'EMCommunicationNav',
      },
      {
        show: true,
        title: t('my quality control'),
        path: paths.employee.qualityControl.root,
        icon: <Iconify icon="healthicons:world-care" />,
        navItemId: 'EMQualityControlNav',
      },
      {
        show: true,
        title: t('my profile'),
        path: paths.employee.profile.root,
        icon: <Iconify icon="iconamoon:profile-bold" />,
        navItemId: 'EMProfileNav',
      },
      {
        show: true,
        title: t('my calender'),
        path: paths.employee.calender,
        icon: <Iconify icon="simple-line-icons:calender" />,
        navItemId: 'EMCalenderNav',
      },
      {
        show: true,
        title: t('Appointments Today'),
        path: paths.employee.appointmentsToday,
        icon: <Iconify icon="material-symbols:work-history-rounded" />,
      },
    ];
    const employeeDashboard = [
      {
        subheader: t('employee dashboard'),
        items: employeeItems.filter((item) => item.show),
      },
    ];

    const userItems = [
      {
        subheader: t('user'),
        items: [
          // USER
          {
            title: t('my profile'),
            path: paths.dashboard.user.profile,
            icon: <Iconify icon="iconamoon:profile-bold" />,
          },
          {
            title: t('settings'),
            path: paths.dashboard.user.account,
            icon: <Iconify icon="solar:settings-bold-duotone" />,
          },
          {
            title: t('my appointments'),
            path: paths.dashboard.user.patientsappointments,
            icon: <Iconify icon="ph:calendar-duotone" />,
          },
          {
            title: t('book appointment'),
            path: paths.dashboard.user.specialities,
            icon: <Iconify icon="icon-park-outline:medicine-chest" />,
          },
          {
            title: t('my health'),
            path: paths.dashboard.user.health,
            icon: <Iconify icon="solar:health-bold" sx={{ color: '#E73E7A' }} />,
          },
          {
            title: t('wating room'),
            path: paths.dashboard.user.watingroom,
            icon: <Iconify icon="medical-icon:i-waiting-area" />,
          },
          {
            title: t('emergency'),
            path: paths.dashboard.user.emergency,
            icon: <Iconify icon="material-symbols:e911-emergency-outline" />,
          },
          {
            title: t('my medical reports'),
            path: paths.dashboard.user.medicalreports,
            icon: <Iconify icon="tabler:report-medical" />,
          },
          {
            title: t('sick Leave'),
            path: paths.dashboard.user.sickLeave,
            icon: <Iconify icon="covid:graph-document-infected-report" />,
          },
          {
            title: t('my prescriptions'),
            path: paths.dashboard.user.prescriptions,
            icon: <Iconify icon="material-symbols:prescriptions-outline" />,
          },
          {
            title: t('my family'),
            path: paths.dashboard.user.family,
            icon: <Iconify icon="icon-park-twotone:family" />,
          },
          {
            title: t('my insurance'),
            path: paths.dashboard.user.insurance,
            icon: <Iconify icon="streamline:insurance-hand" />,
          },
          {
            title: t('my History'),
            path: paths.dashboard.user.history,
            icon: <Iconify icon="material-symbols:history" />,
          },
          {
            title: t('Financial movements'),
            path: paths.dashboard.user.financilmovment,
            icon: <Iconify icon="material-symbols:finance-rounded" />,
          },
          {
            title: t('my offers'),
            path: paths.dashboard.user.products.root,
            icon: <Iconify icon="ic:round-contact-support" />,
          },
          {
            title: t('contact us'),
            path: paths.dashboard.user.edit,
            icon: <Iconify icon="ic:round-contact-support" />,
          },
          {
            title: t('share doctorna'),
            path: paths.dashboard.user.share,
            icon: <Iconify icon="bxs:share-alt" sx={{ color: 'success.main' }} />,
          },
          // {
          //   title: t('logout'),
          //   onClick: handleLogout,
          //   path: paths.auth.login,
          //   icon: <Iconify icon="tabler:logout" />,
          // },
        ],
      },
    ];
    const stakeholderItems = [
      {
        subheader: t('Dashboard'),
        items: [
          {
            title: t('products'),
            path: paths.stakeholder.products.root,
            icon: <Iconify icon="fluent-mdl2:product" />,
          },
          {
            title: t('offers'),
            path: paths.stakeholder.offers.root,
            icon: <Iconify icon="foundation:pricetag-multiple" />,
          },
          {
            title: t('orders'),
            path: paths.stakeholder.orders.root,
            icon: <Iconify icon="material-symbols:shopping-cart-outline-rounded" />,
          },
          {
            title: t('custumers'),
            path: paths.stakeholder.customers.root,
            icon: <Iconify icon="streamline:information-desk-customer-solid" />,
          },
          {
            title: t('accounting'),
            path: paths.stakeholder.accounting.root,
            icon: <Iconify icon="fa6-solid:money-bill-transfer" />,
          },
          {
            title: t('profile'),
            path: paths.stakeholder.profile,
            icon: <Iconify icon="iconamoon:profile-bold" />,
          },
        ],
      },
    ];

    if (!user || !user?.role) {
      router.replace('/');
    }
    if (user?.role === 'superadmin') {
      return superAdminItems;
    }
    if (user?.role === 'admin') {
      return [...employeeDashboard, ...unitServicesDashboars];
    }
    if (user?.role === 'employee') {
      return [...employeeDashboard, ...unitServicesDashboars];
    }
    if (user?.role === 'stakeholder') {
      return stakeholderItems;
    }
    return [...userItems];
  }, [t, user, router, checkAcl, employees_number, messages]);

  return data;
}
