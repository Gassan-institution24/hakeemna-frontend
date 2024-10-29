import { useMemo, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import socket from 'src/socket';
import { useTranslate } from 'src/locales';
import { useGetUnreadMsgs } from 'src/api/chat';
import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import useUSTypeGuard from 'src/auth/guard/USType-guard';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// import { useSnackbar } from 'src/components/snackbar';
// import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function useNavData() {
  const router = useRouter();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const checkAcl = useAclGuard();
  const { isMedLab } = useUSTypeGuard();
  const { messages, refetch } = useGetUnreadMsgs(user?._id);

  useEffect(() => {
    socket.on('message', (message) => {
      if (messages.some((one) => one._id === message.user)) {
        refetch();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const employees_number =
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
      ?.employees_number || 10;

  const data = useMemo(() => {
    const superAdminItems = [
      {
        subheader: t('overview'),
        items: [
          {
            title: t('confirming'),
            path: paths.superadmin.confirming,
            icon: <Iconify icon="line-md:confirm-square-twotone" />,
          },
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
          {
            title: t('my blogs'),
            path: paths.superadmin.blogs.root,
            icon: <Iconify icon="ic:outline-library-books" />,
          },
        ],
      },
    ];
    const unitServiceManagementTables = [
      {
        show:
          checkAcl({ category: 'unit_service', subcategory: 'departments', acl: 'read' }) &&
          employees_number > 3 &&
          !isMedLab &&
          false,
        title: t('departments'),
        path: paths.unitservice.departments.root,
        'data-test': 'us-nav-item-departments'
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'employees', acl: 'read' }),
        title: t('employees'),
        path: paths.unitservice.employees.root,
        navItemId: 'USEmployeesNav',
        'data-test': 'us-nav-item-employees'
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
        'data-test': 'us-nav-item-workshifts'
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
        'data-test': 'us-nav-item-workgroups'
      },
      {
        show: checkAcl({
          category: 'unit_service',
          subcategory: 'management_tables',
          acl: 'read',
        }),
        title: t('services and pricing'),
        path: paths.unitservice.tables.services.root,
        navItemId: 'USServicesNav',
        'data-test': 'us-nav-item-services'
      },
      {
        show:
          checkAcl({
            category: 'unit_service',
            subcategory: 'management_tables',
            acl: 'read',
          }) && !isMedLab,
        title: t('rooms'),
        path: paths.unitservice.tables.rooms.root,
        navItemId: 'USRoomsNav',
        'data-test': 'us-nav-item-rooms'
      },
      {
        show:
          checkAcl({
            category: 'unit_service',
            subcategory: 'management_tables',
            acl: 'read',
          }) && !isMedLab,
        title: t('activities'),
        path: paths.unitservice.tables.activities.root,
        navItemId: 'USActivitiesNav',
        'data-test': 'us-nav-item-activities'
      },
      {
        show:
          checkAcl({ category: 'unit_service', subcategory: 'old_patient', acl: 'read' }) && false,
        title: t('old patient data'),
        path: paths.unitservice.oldPatient,
        // icon: <Iconify icon="entypo:upload" />,
        navItemId: 'USOldPatientsNav',
        'data-test': 'us-nav-item-oldpatient'
      },
    ];
    const unitServiceItems = [
      {
        show:
          (checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'appointment' }) ||
            checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'rooms' }) ||
            checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'finished' })) &&
          isMedLab,
        title: t('Appointments Today'),
        path: paths.employee.appointmentsToday,
        icon: <Iconify icon="material-symbols:work-history-rounded" />,
        'data-test': 'us-nav-item-appointmenttoday'
      },
      {
        show:
          checkAcl({ category: 'unit_service', subcategory: 'departments', acl: 'read' }) &&
          false &&
          employees_number > 3 &&
          !isMedLab,
        title: t('departments'),
        path: paths.unitservice.departments.root,
        icon: <Iconify icon="uis:web-section-alt" />,
        navItemId: 'USDepartmentNav',
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'read' }),
        title: t('appointments'),
        path: paths.unitservice.appointments.parent,
        icon: <Iconify icon="fluent-mdl2:date-time-mirrored" />,
        'data-test': 'us-nav-item-appointments',
        navItemId: 'USAppointmentsNav',
        children: [
          {
            show: checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'read' }),
            title: t('appointments'),
            path: paths.unitservice.appointments.root,
            navItemId: 'USAppointmentsNav',
            'data-test': 'us-nav-item-appointments-appointments',
          },
          {
            show: checkAcl({
              category: 'unit_service',
              subcategory: 'appointments',
              acl: 'update',
            }),
            title: t('book appointments'),
            path: paths.unitservice.appointments.book,
            'data-test': 'us-nav-item-appointments-book',
          },
        ].filter((one) => one.show),
      },
      {
        show:
          checkAcl({ category: 'unit_service', subcategory: 'appointment_configs', acl: 'read' }) &&
          isMedLab,
        title: t('appointment configuration'),
        path: paths.employee.appointmentconfiguration.root,
        icon: <Iconify icon="fluent:content-settings-16-regular" />,
        navItemId: 'EMAppointConfigNav',
        'data-test': 'us-nav-item-appointments-configuration',
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),
        title: t('accounting'),
        path: paths.unitservice.accounting.root,
        icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
        navItemId: 'USAccountingNav',
        'data-test': 'us-nav-item-accounting',
        children: [
          {
            show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),
            title: t('invoicing'),
            path: paths.unitservice.accounting.invoicing,
            'data-test': 'us-nav-item-accounting-invoicing',
          },
          {
            show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),
            title: t('economic movements'),
            path: paths.unitservice.accounting.economicmovements.root,
            'data-test': 'us-nav-item-accounting-economic',
          },
          {
            show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),
            title: t('payment control'),
            path: paths.unitservice.accounting.paymentcontrol.root,
            'data-test': 'us-nav-item-accounting-payment',
          },
          {
            show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),
            title: t('reciepts'),
            path: paths.unitservice.accounting.reciepts.root,
            'data-test': 'us-nav-item-accounting-reciepts',
          },
        ].filter((one) => one.show),
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'old_patient', acl: 'read' }),
        title: t("institution's patients"),
        path: paths.unitservice.patients.all,
        icon: <Iconify icon="streamline:health-care-2-solid" />,
        'data-test': 'us-nav-item-patients',
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'management_tables', acl: 'read' }),
        title: t('management tables'),
        path: paths.unitservice.tables.root,
        icon: <Iconify icon="icon-park-twotone:data" />,
        navItemId: 'USTablesNav',
        children: unitServiceManagementTables.filter((item) => item.show),
        'data-test': 'us-nav-item-tables',
      },
      {
        show:
          checkAcl({ category: 'unit_service', subcategory: 'permissions', acl: 'read' }) &&
          !isMedLab,
        title: t('permissions'),
        path: paths.unitservice.acl.root,
        icon: <Iconify icon="mdi:account-secure" />,
        'data-test': 'us-nav-item-permissions',
        children: [
          {
            title: t('unit of service level'), path: paths.unitservice.acl.unitservice,
            'data-test': 'us-nav-item-permissions-us',
          },
          {
            title: t('departments level'), path: paths.unitservice.acl.department,
            'data-test': 'us-nav-item-permissions-department',
          },
          {
            title: t('work groups level'), path: paths.unitservice.acl.workgroups,
            'data-test': 'us-nav-item-permissions-wg',
          },
          {
            title: t('employee permission'), path: paths.unitservice.acl.employees,
            'data-test': 'us-nav-item-permissions-ws',
          },
        ],
      },
      {
        show:
          checkAcl({ category: 'unit_service', subcategory: 'permissions', acl: 'read' }) &&
          isMedLab,
        title: t('permissions'),
        path: paths.unitservice.acl.root,
        'data-test': 'lab-nav-item-permissions',
        icon: <Iconify icon="mdi:account-secure" />,
        children: [
          { title: t('unit of service level'), path: paths.unitservice.acl.unitservice },
          // { title: t('departments level'), path: paths.unitservice.acl.department },
          { title: t('work groups level'), path: paths.unitservice.acl.workgroups },
          { title: t('employee permission'), path: paths.unitservice.acl.employees },
        ],
      },
      {
        show:
          // checkAcl({ category: 'unit_service', subcategory: 'hr', acl: 'read' }) &&
          true,
        title: t('human resource'),
        path: paths.unitservice.hr.root,
        icon: <Iconify icon="fluent-mdl2:recruitment-management" />,
        'data-test': 'us-nav-item-hr',
      },
      {
        show: checkAcl({ category: 'unit_service', subcategory: 'unit_service_info', acl: 'read' }),
        title: t('products and suppliers'),
        path: paths.unitservice.products.root,
        icon: <Iconify icon="material-symbols:shopping-cart-outline-rounded" />,
        navItemId: 'USProductsNav',
        'data-test': 'us-nav-item-products',
        children: [
          {
            show: checkAcl({
              category: 'unit_service',
              subcategory: 'unit_service_info',
              acl: 'read',
            }),
            title: t('all products'),
            path: paths.unitservice.products.all,
            'data-test': 'us-nav-item-products-all',
          },
          {
            show: checkAcl({
              category: 'unit_service',
              subcategory: 'unit_service_info',
              acl: 'read',
            }),
            title: t('suppliers'),
            path: paths.unitservice.products.stakeholder.root,
            'data-test': 'us-nav-item-products-suppliers',
          },
          {
            show: checkAcl({
              category: 'unit_service',
              subcategory: 'unit_service_info',
              acl: 'read',
            }),
            title: t('orders'),
            path: paths.unitservice.orders.root,
            navItemId: 'USInsuranceNav',
            'data-test': 'us-nav-item-products-orders',
          },
        ].filter((one) => one.show),
      },
      {
        show: checkAcl({
          category: 'unit_service',
          subcategory: 'unit_service_info',
          acl: 'update',
        }),
        title: t('unit of service info'),
        path: paths.unitservice.profile.parent,
        icon: <Iconify icon="fa-solid:clinic-medical" />,
        navItemId: 'USInfoNav',
        'data-test': 'us-nav-item-info',
        children: [
          {
            show: checkAcl({
              category: 'unit_service',
              subcategory: 'unit_service_info',
              acl: 'update',
            }),
            title: t('profile'),
            path: paths.unitservice.profile.root,
            navItemId: 'USInfoNav',
            'data-test': 'us-nav-item-info-profile',
          },
          {
            show: checkAcl({
              category: 'unit_service',
              subcategory: 'unit_service_info',
              acl: 'read',
            }),
            title: t('Insurance'),
            path: paths.unitservice.insurance.root,
            navItemId: 'USInsuranceNav',
            'data-test': 'us-nav-item-info-insurance',
          },
          {
            show:
              false &&
              checkAcl({ category: 'unit_service', subcategory: 'unit_service_info', acl: 'read' }),
            title: t('communication'),
            path: paths.unitservice.communication.root,
            navItemId: 'USCommunicationNav',
            'data-test': 'us-nav-item-info-communication',
          },
          {
            show: checkAcl({
              category: 'unit_service',
              subcategory: 'quality_control',
              acl: 'read',
            }),
            title: t('quality control'),
            path: paths.unitservice.qualityControl.root,
            navItemId: 'USQualityControlNav',
            'data-test': 'us-nav-item-info-qc',
          },
          {
            show: checkAcl({
              category: 'unit_service',
              subcategory: 'unit_service_info',
              acl: 'read',
            }),
            title: t('subscriptions'),
            path: paths.unitservice.subscriptions.root,
            navItemId: 'USSubscriptionsNav',
            'data-test': 'us-nav-item-info-subscriptions',
          },
        ].filter((one) => one.show),
      },
      {
        show: isMedLab,
        title: t('my profile'),
        path: paths.employee.profile.root,
        icon: <Iconify icon="iconamoon:profile-bold" />,
        navItemId: 'EMProfileNav',
        'data-test': 'us-nav-item-myprofile',
      },
    ];
    const unitServicesDashboars = [
      {
        subheader: t('institution control panel'),
        items: unitServiceItems.filter((item) => item.show),
      },
    ];
    const employeeItems = [
      // {
      //   show:
      //     checkAcl({
      //       category: 'work_group',
      //       subcategory: 'entrance_management',
      //       acl: 'read',
      //     }) && !isMedLab,
      //   title: t('entrance management'),
      //   path: paths.employee.entrancemanagement.root,
      //   icon: <Iconify icon="oi:timer" />,
      //   navItemId: 'EMEntranceNav',
      // },
      {
        show:
          (checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'appointment' }) ||
            checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'rooms' }) ||
            checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'finished' })) &&
          !isMedLab,
        title: t('Appointments Today'),
        path: paths.employee.appointmentsToday,
        icon: <Iconify icon="material-symbols:work-history-rounded" />,
        'data-test': 'employee-nav-item-appointmenttoday',
      },
      {
        show: checkAcl({ category: 'work_group', subcategory: 'appointments', acl: 'read' }),
        title: t('appointments'),
        path: paths.employee.appointments.parent,
        icon: <Iconify icon="fluent-mdl2:date-time-mirrored" />,
        navItemId: 'EMAppointmentsNav',
        'data-test': 'employee-nav-item-appointments',
        children: [
          {
            show: checkAcl({ category: 'work_group', subcategory: 'appointments', acl: 'read' }),
            title: t('my appointments'),
            path: paths.employee.appointments.root,
            navItemId: 'EMAppointmentsNav',
            'data-test': 'employee-nav-item-appointments-my',
          },
          {
            show:
              checkAcl({ category: 'work_group', subcategory: 'appointments', acl: 'update' }) &&
              !isMedLab,
            title: t('book appointments'),
            path: paths.employee.appointments.book,
            // icon: <Iconify icon="material-symbols:add-ad" />,
            navItemId: 'EMAppointmentsNav',
            'data-test': 'employee-nav-item-appointments-book',
          },
          {
            show: checkAcl({
              category: 'work_group',
              subcategory: 'appointment_configs',
              acl: 'read',
            }),
            title: t('my appointment configuration'),
            path: paths.employee.appointmentconfiguration.root,
            // icon: <Iconify icon="fluent:content-settings-16-regular" />,
            navItemId: 'EMAppointConfigNav',
            'data-test': 'employee-nav-item-appointments-config',
          },
        ],
      },

      {
        show: checkAcl({ category: 'work_group', subcategory: 'appointments', acl: 'read' }),
        title: t('my patients'),
        path: paths.employee.patients.all,
        icon: <Iconify icon="streamline:health-care-2-solid" />,
        'data-test': 'employee-nav-item-patients',
      },
      {
        show: false,
        title: t('my accounting'),
        path: paths.employee.accounting.root,
        icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
        navItemId: 'EMAccountingNav',
        'data-test': 'employee-nav-item-accounting',
      },
      {
        show: true,
        title: t('documents'),
        path: paths.employee.documents.parent,
        icon: <Iconify icon="ic:outline-folder" />,
        'data-test': 'employee-nav-item-documents',
        children: [
          {
            show:
              checkAcl({ category: 'work_group', subcategory: 'appointments', acl: 'read' }) &&
              !isMedLab,
            title: t('checklist'),
            path: paths.employee.checklist.root,
            navItemId: 'EMChecklistNav',
            'data-test': 'employee-nav-item-documents-checklist',
          },
          {
            show: true,
            title: t('adjustable documents'),
            path: paths.employee.documents.adjustable.root,
            'data-test': 'employee-nav-item-documents-adjustable',
          },
          {
            show: true,
            title: t('my blogs'),
            path: paths.employee.documents.blogs.root,
            'data-test': 'employee-nav-item-documents-blogs',
          },
        ].filter((one) => one.show),
      },
      {
        show: true,
        title: t('my profile'),
        path: paths.employee.profile.parent,
        icon: <Iconify icon="iconamoon:profile-bold" />,
        navItemId: 'EMProfileNav',
        'data-test': 'employee-nav-item-profile',
        children: [
          {
            show: true,
            title: t('settings'),
            path: paths.employee.profile.root,
            // icon: <Iconify icon="iconamoon:profile-bold" />,
            navItemId: 'EMProfileNav',
            'data-test': 'employee-nav-item-profile-settings',
          },
          {
            show: true,
            title: t('my work groups'),
            path: paths.employee.workGroups.root,
            // icon: <Iconify icon="heroicons:user-group-solid" />,
            navItemId: 'EMWorkGroupsNav',
            'data-test': 'employee-nav-item-profile-wg',
          },
          {
            show: false,
            title: t('my communication'),
            path: paths.employee.communication.root,
            // icon: <Iconify icon="solar:call-chat-bold" />,
            navItemId: 'EMCommunicationNav',
            'data-test': 'employee-nav-item-profile-communication',
          },
          {
            show: true,
            title: t('my quality control'),
            path: paths.employee.qualityControl.root,
            // icon: <Iconify icon="healthicons:world-care" />,
            navItemId: 'EMQualityControlNav',
            'data-test': 'employee-nav-item-profile-qc',
          },
        ].filter((one) => one.show),
      },
      {
        show: true,
        title: t('my calender'),
        path: paths.employee.calender,
        icon: <Iconify icon="simple-line-icons:calender" />,
        navItemId: 'EMCalenderNav',
        'data-test': 'employee-nav-item-calender',
      },
      {
        show: true,
        title: t('browse blogs'),
        path: paths.employee.blogs,
        icon: <Iconify icon="ic:outline-library-books" />,
        navItemId: 'EMBlogsNav',
        'data-test': 'employee-nav-item-browzeblogs',
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
        subheader: t('dashboard'),
        items: [
          // USER
          {
            title: t('book appointment'),
            path: paths.dashboard.user.specialities,
            icon: <Iconify icon="icon-park-outline:medicine-chest" />,
          },
          {
            title: t('wating room'),
            path: paths.dashboard.user.watingroom,
            icon: <Iconify icon="medical-icon:i-waiting-area" />,
          },
          {
            title: t('my appointments'),
            path: paths.dashboard.user.patientsappointments,
            icon: <Iconify icon="ph:calendar-duotone" />,
          },
          // {
          //   title: t('emergency'),
          //   path: paths.dashboard.user.emergency,
          //   icon: <Iconify icon="material-symbols:e911-emergency-outline" />,
          // },
          {
            title: t('my documents'),
            path: '/dashboard/user/documents',
            icon: <Iconify icon="tabler:report-medical" />,
            children: [
              {
                title: t('medical reports'),
                path: paths.dashboard.user.medicalreports,
                // icon: <Iconify icon="tabler:report-medical" />,
              },
              {
                title: t('sick Leave'),
                path: paths.dashboard.user.sickLeave,
                // icon: <Iconify icon="covid:graph-document-infected-report" />,
              },
              {
                title: t('prescriptions'),
                path: paths.dashboard.user.prescriptions,
                // icon: <Iconify icon="material-symbols:prescriptions-outline" />,
              },
            ],
          },
          {
            title: t('my health'),
            path: paths.dashboard.user.health,
            icon: <Iconify icon="solar:health-bold" sx={{ color: '#E73E7A' }} />,
          },

          {
            title: t('my family'),
            path: paths.dashboard.user.family,
            icon: <Iconify icon="icon-park-twotone:family" />,
          },
          {
            title: t('Financial'),
            path: '/dashboard/user/financial',
            icon: <Iconify icon="material-symbols:finance-rounded" />,
            children: [
              {
                title: t('Financial movements'),
                path: paths.dashboard.user.financilmovment,
                // icon: <Iconify icon="material-symbols:finance-rounded" />,
              },
              {
                title: t('my offers'),
                path: paths.dashboard.user.products.root,
                // icon: <Iconify icon="material-symbols:shopping-cart-outline-rounded" />,
              },
              {
                title: t('my orders'),
                path: paths.dashboard.user.orders.root,
                // icon: <Iconify icon="fluent-mdl2:product" />,
              },
            ],
          },
          {
            title: t('my profile'),
            path: '/dashboard/user/profile',
            icon: <Iconify icon="iconamoon:profile-bold" />,
            children: [
              {
                title: t('profile'),
                path: paths.dashboard.user.profile,
                // icon: <Iconify icon="iconamoon:profile-bold" />,
              },
              {
                title: t('settings'),
                path: paths.dashboard.user.account,
                // icon: <Iconify icon="solar:settings-bold-duotone" />,
              },
              {
                title: t('insurance'),
                path: paths.dashboard.user.insurance,
                // icon: <Iconify icon="streamline:insurance-hand" />,
              },
              {
                title: t('History'),
                path: paths.dashboard.user.history,
                // icon: <Iconify icon="material-symbols:history" />,
              },
            ],
          },
          // {
          //   title: t('contact us'),
          //   path: paths.dashboard.user.edit,
          //   icon: <Iconify icon="ic:round-contact-support" />,
          // },
          {
            title: t('browse blogs'),
            path: paths.dashboard.user.blogs,
            icon: <Iconify icon="ic:outline-library-books" />,
          },
          {
            title: t('share hakeemna'),
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
            title: t('customers'),
            path: paths.stakeholder.customers.root,
            icon: <Iconify icon="streamline:information-desk-customer-solid" />,
          },
          {
            show: checkAcl({ category: 'unit_service', subcategory: 'accounting', acl: 'read' }),
            title: t('accounting'),
            path: paths.stakeholder.accounting.root,
            icon: <Iconify icon="fa6-solid:money-bill-transfer" />,
            navItemId: 'USAccountingNav',
            children: [
              {
                show: checkAcl({
                  category: 'unit_service',
                  subcategory: 'accounting',
                  acl: 'read',
                }),
                title: t('economic movements'),
                path: paths.stakeholder.accounting.economicmovements.root,
              },
              {
                show: checkAcl({
                  category: 'unit_service',
                  subcategory: 'accounting',
                  acl: 'read',
                }),
                title: t('payment control'),
                path: paths.stakeholder.accounting.paymentcontrol.root,
              },
              {
                show: checkAcl({
                  category: 'unit_service',
                  subcategory: 'accounting',
                  acl: 'read',
                }),
                title: t('reciepts'),
                path: paths.stakeholder.accounting.reciepts.root,
              },
            ],
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
    if (user?.role === 'admin' && !isMedLab) {
      return [...employeeDashboard, ...unitServicesDashboars];
    }
    if (user?.role === 'employee' && !isMedLab) {
      return [...employeeDashboard, ...unitServicesDashboars];
    }
    if (user?.role === 'admin') {
      return [...unitServicesDashboars];
    }
    if (user?.role === 'employee') {
      return [...unitServicesDashboars];
    }
    if (user?.role === 'stakeholder') {
      return stakeholderItems;
    }
    return [...userItems];
  }, [t, user, router, checkAcl, employees_number, messages, isMedLab]);

  return data;
}
