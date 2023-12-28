import { useMemo, useCallback } from 'react';

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
        subheader: t('overview'),
        items: [
          // {
          //   title: t('app'),
          //   path: paths.dashboard.root,
          //   icon: ICONS.dashboard,
          // },
          {
            title: t('management tables/rooms/appotypes'),
            path: paths.superadmin.tables.root,
            icon: <Iconify icon="icon-park-twotone:data" />,
          },
          {
            title: t('Subscriptions'),
            path: paths.superadmin.tables.root,
            icon: <Iconify icon="icon-park-twotone:data" />,
          },
          {
            title: t('Accounting'),
            path: paths.superadmin.unitservices.root,
            icon: <Iconify icon="fa-solid:clinic-medical" />,
          },
          {
            title: t('Appointments'),
            path: paths.superadmin.patients.root,
            icon: <Iconify icon="iconamoon:profile-bold" />,
          },
          {
            title: t('Profile'),
            path: paths.superadmin.stakeholders.root,
            icon: <Iconify icon="material-symbols:sell-sharp" />,
          },
          {
            title: t('Insurance'),
            path: paths.superadmin.accounting.root,
            icon: <Iconify icon="streamline:subscription-cashflow-solid" />,
          },
          {
            title: t('Feedback'),
            path: paths.superadmin.statistics.root,
            icon: <Iconify icon="akar-icons:statistic-up" />,
          },
          {
            title: t('suppliers offers'),
            path: paths.superadmin.subscriptions.root,
            icon: <Iconify icon="eos-icons:activate-subscriptions" />,
          },
          {
            title: t('communications'),
            path: paths.superadmin.communication.root,
            icon: <Iconify icon="solar:call-chat-bold" />,
          },
          {
            title: t('employees'),
            path: paths.superadmin.accessControlList.root,
            icon: <Iconify icon="mdi:user-access-control" />,
          },
          {
            title: t('appointments'),
            path: paths.superadmin.customersTraining.root,
            icon: <Iconify icon="mdi:teach" />,
          },
          {
            title: t('quality control'),
            path: paths.superadmin.qualityControl.root,
            icon: <Iconify icon="healthicons:world-care" />,
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
            icon: <Iconify icon="teenyicons:appointments-solid" />,
          },
          {
            title: t('medical report'),
            path: '#',
            icon: <Iconify icon="tabler:report-medical" />,
          },
          {
            title: t('contact us'),
            path: paths.dashboard.user.demo.edit,
            icon: <Iconify icon="ic:round-contact-support" />,
          },
          {
            title: t('prescriptions'),
            path: paths.dashboard.user.medicins,
            icon: <Iconify icon="material-symbols-light:prescriptions-outline" />,
          },
          {
            title: t('Financial movements'),
            path: paths.dashboard.user.financilmovment,
            icon: <Iconify icon="arcticons:gnucash" />,
          },
          {
            title: t('share doctorna'),
            path: paths.dashboard.user.share,
            icon: <Iconify icon="bxs:share-alt" />,
          },
          {
            title: t('logout'),
            icon: <Iconify icon="tabler:logout" />,
            onClick: handleLogout,
            path: '/',
          },
        ],
      },
    ];

    if(!user){
      router.replace('/');
    }
    if (user?.role === 'superadmin') {
      return superAdminItems;
    }
    if (user?.role === 'admin') {
      return unitServicesItems;
    }
    return [...userItems];
  }, [t, user, handleLogout,router]);

  return data;
}
