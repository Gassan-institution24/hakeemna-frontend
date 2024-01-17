import { useMemo, useCallback, useState } from 'react';

import { paths } from 'src/routes/paths';
import { HOST_API } from 'src/config-global';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function useNavData() {
  const router = useRouter();
  const { logout } = useAuthContext();
  const popover = usePopover();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      popover.onClose();
      // router, router.replace('/');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  }, [logout, popover, enqueueSnackbar]);

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
            title: t('management tables'),
            path: paths.superadmin.tables.root,
            icon: <Iconify icon="icon-park-twotone:data" />,
          },
          {
            title: t('Unit Services'),
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
            title: t('accounting'),
            path: paths.superadmin.accounting.root,
            icon: <Iconify icon="streamline:subscription-cashflow-solid" />,
          },
          {
            title: t('statistics'),
            path: paths.superadmin.statistics.root,
            icon: <Iconify icon="akar-icons:statistic-up" />,
          },
          {
            title: t('subscriptions'),
            path: paths.superadmin.subscriptions.root,
            icon: <Iconify icon="eos-icons:activate-subscriptions" />,
          },
          {
            title: t('communications'),
            path: paths.superadmin.communication.root,
            icon: <Iconify icon="solar:call-chat-bold" />,
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
            title: t('quality control'),
            path: paths.superadmin.qualityControl.root,
            icon: <Iconify icon="healthicons:world-care" />,
            children: [
              { title: t('Doctorna online'), path: paths.superadmin.qualityControl.doctorna },
              { title: t('Unit Services'), path: paths.superadmin.qualityControl.unitservices },
              { title: t('Stakeholders'), path: paths.superadmin.qualityControl.stakeholders },
            ],
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
          //     { title: t('unit services'), path: paths.superadmin.tables.unitservices.root },
          //     { title: t('departments'), path: paths.superadmin.tables.departments.root },
          //     { title: t('specialities'), path: paths.superadmin.tables.specialities.root },
          //     { title: t('subspecialities'), path: paths.superadmin.tables.subspecialities.root },
          //     { title: t('appointment types'), path: paths.superadmin.tables.appointypes.root },
          //     { title: t('free subscriptions'), path: paths.superadmin.tables.freesub.root },
          //     { title: t('added value taxes'), path: paths.superadmin.tables.taxes.root },
          //     { title: t('unit service types'), path: paths.superadmin.tables.unitservicetypes.root },
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
    const unitServicesItems = [
      {
        subheader: t('control panel'),
        items: [
          {
            title: t('departments'),
            path: paths.unitservice.departments.root,
            icon: <Iconify icon="uis:web-section-alt" />,
          },
          {
            title: t('employees'),
            path: paths.unitservice.employees.root,
            icon: <Iconify icon="fluent:people-20-filled" />,
          },
          {
            title: t('activities'),
            path: paths.unitservice.activities.root,
            icon: <Iconify icon="material-symbols:volunteer-activism" />,
          },
          {
            title: t('Appointments'),
            path: paths.unitservice.appointments.root,
            icon: <Iconify icon="fluent-mdl2:date-time-mirrored" />,
          },
          {
            title: t('Accounting'),
            path: paths.unitservice.accounting.root,
            icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
            children: [
              {
                title: t('economic movements'),
                path: paths.unitservice.accounting.economicmovements.root,
              },
              {
                title: t('payment control'),
                path: paths.unitservice.accounting.paymentcontrol.root,
              },
              { title: t('reciepts'), path: paths.unitservice.accounting.reciepts.root },
            ],
          },
          // {
          //   title: t('management tables'),
          //   path: paths.unitservice.tables.root,
          //   icon: <Iconify icon="icon-park-twotone:data" />,
          //   children: [
          //     // { title: t('appointment types'), path: paths.unitservice.tables.appointypes.root },
          //     { title: t('employee types'), path: paths.unitservice.tables.employeetypes.root },
          //     { title: t('work shifts'), path: paths.unitservice.tables.workshifts.root },
          //     { title: t('work groups'), path: paths.unitservice.tables.workgroups.root },
          //     { title: t('rooms'), path: paths.unitservice.tables.rooms.root },
          //   ],
          // },
          {
            title: t('Insurance'),
            path: paths.unitservice.insurance.root,
            icon: <Iconify icon="ic:baseline-security" />,
          },
          {
            title: t('suppliers offers'),
            path: paths.unitservice.offers.root,
            icon: <Iconify icon="eos-icons:activate-subscriptions" />,
          },
          {
            title: t('communication'),
            path: paths.unitservice.communication.root,
            icon: <Iconify icon="solar:call-chat-bold" />,
          },
          {
            title: t('quality control'),
            path: paths.unitservice.qualityControl.root,
            icon: <Iconify icon="healthicons:world-care" />,
          },
          {
            title: t('Subscriptions'),
            path: paths.unitservice.subscriptions.root,
            icon: <Iconify icon="streamline:subscription-cashflow-solid" />,
          },
          {
            title: t('Service Unit Info'),
            path: paths.unitservice.profile.root,
            icon: <Iconify icon="fa-solid:clinic-medical" />,
          },
        ],
      },
    ];
    const employeeItems = [
      {
        subheader: t('Employee dashboard'),
        items: [
          {
            title: t('entrance management'),
            path: paths.employee.entrancemanagement.root,
            icon: <Iconify icon="oi:timer" />,
          },
          {
            title: t('appointments'),
            path: paths.employee.appointments.root,
            icon: <Iconify icon="fluent-mdl2:date-time-mirrored" />,
          },
          {
            title: t('appointment configuration'),
            path: paths.employee.appointmentconfiguration.root,
            icon: <Iconify icon="fluent:content-settings-16-regular" />,
          },
          {
            title: t('accounting'),
            path: paths.employee.accounting.root,
            icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
          },
          {
            title: t('communications'),
            path: paths.employee.communication.root,
            icon: <Iconify icon="solar:call-chat-bold" />,
          },
          {
            title: t('quality control'),
            path: paths.employee.qualityControl.root,
            icon: <Iconify icon="healthicons:world-care" />,
          },
          {
            title: t('profile'),
            path: paths.employee.profile.root,
            icon: <Iconify icon="iconamoon:profile-bold" />,
          },
        ],
      },
    ];

    const userItems = [
      {
        subheader: t('user'),
        items: [
          // USER
          {
            title: t('profile'),
            path: paths.dashboard.user.profile,
            icon: <Iconify icon="iconamoon:profile-bold" />,
          },
          {
            title: t('settings'),
            path: paths.dashboard.user.account,
            icon: <Iconify icon="solar:settings-bold-duotone" />,
          },
          {
            title: t('my appointents'),
            path: paths.dashboard.user.cards,
            icon: <Iconify icon="ph:calendar-duotone" />,
          },
          {
            title: t('book appointents'),
            path: paths.dashboard.user.bookappointment,
            icon: <Iconify icon="icon-park-outline:medicine-chest" />,
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
            title: t('medical report'),
            path: paths.dashboard.user.medicalreports,
            icon: <Iconify icon="tabler:report-medical" />,
          },
          {
            title: t('prescriptions'),
            path: paths.dashboard.user.prescriptions,
            icon: <Iconify icon="material-symbols-light:prescriptions-outline" />,
          },
          {
            title: t('Financial movements'),
            path: paths.dashboard.user.financilmovment,
            icon: <Iconify icon="arcticons:gnucash" />,
          },
          {
            title: t('contact us'),
            path: paths.dashboard.user.demo.edit,
            icon: <Iconify icon="ic:round-contact-support" />,
          },
          {
            title: t('share doctorna'),
            path: paths.dashboard.user.share,
            icon: <Iconify icon="bxs:share-alt" sx={{ color: 'success.main' }} />,
          },
          {
            title: t('logout'),
            onClick: handleLogout,
            path: paths.auth.login,
            icon: <Iconify icon="tabler:logout" />,
          },
        ],
      },
    ];

    if (!user) {
      router.replace('/');
    }
    if (user?.role === 'superadmin') {
      return superAdminItems;
    }
    if (user?.role === 'admin') {
      return [...unitServicesItems, ...employeeItems];
    }
    if (user?.role === 'employee') {
      return [...unitServicesItems, ...employeeItems];
    }
    return [...userItems];
  }, [t, user, handleLogout, router]);

  return data;
}
