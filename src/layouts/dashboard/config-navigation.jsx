import { useMemo, useCallback } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  profile: icon('iconamoon:profile-bold'),
};

// ----------------------------------------------------------------------

export function useNavData() {
 

  const { t } = useTranslate();
  const { user } = useAuthContext();

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
            icon: ICONS.ecommerce,
          },
          {
            title: t('Unit Services'),
            path: paths.superadmin.unitservices.root,
            icon: ICONS.analytics,
          },
          {
            title: t('patients'),
            path: paths.superadmin.patients.root,
            icon: ICONS.booking,
          },
          {
            title: t('stakeholders'),
            path: paths.superadmin.stakeholders.root,
            icon: ICONS.ecommerce,
          },
          {
            title: t('accounting'),
            path: paths.dashboard.general.file,
            icon: ICONS.file,
          },
          {
            title: t('statistics'),
            path: paths.dashboard.general.file,
            icon: ICONS.file,
          },
          {
            title: t('packages'),
            path: paths.dashboard.general.file,
            icon: ICONS.file,
          },
          {
            title: t('communications'),
            path: paths.dashboard.general.file,
            icon: ICONS.file,
          },
          {
            title: t('access control list'),
            path: paths.dashboard.general.file,
            icon: ICONS.file,
          },
          {
            title: t('customers training'),
            path: paths.dashboard.general.file,
            icon: ICONS.file,
          },
          {
            title: t('our team training'),
            path: paths.dashboard.general.file,
            icon: ICONS.file,
          },
          {
            title: t('Adjustable Services Control'),
            path: paths.dashboard.general.banking,
            icon: ICONS.banking,
          },
          {
            title: t('quality control'),
            path: paths.dashboard.post.root,
            icon: ICONS.blog,
            children: [
              { title: t('Doctorna online'), path: paths.dashboard.post.root },
              { title: t('unitservices'), path: paths.dashboard.post.demo.details },
              { title: t('stakeholders'), path: paths.dashboard.post.new },
              { title: t('other'), path: paths.dashboard.post.demo.edit },
            ],
          },
          {
            title: t('management tables'),
            path: paths.superadmin.tables.root,
            icon: ICONS.order,
            children: [
              { title: t('list'), path: paths.superadmin.tables.list },
              { title: t('cities'), path: paths.superadmin.tables.cities.root },
              { title: t('countries'), path: paths.superadmin.tables.countries.root },
              { title: t('currency'), path: paths.superadmin.tables.currency.root },
              { title: t('surgeries'), path: paths.superadmin.tables.surgeries.root },
              { title: t('medical categories'), path: paths.superadmin.tables.medcategories.root },
              { title: t('diseases'), path: paths.superadmin.tables.diseases.root },
              { title: t('medicines families'), path: paths.superadmin.tables.medfamilies.root },
              { title: t('medicines'), path: paths.superadmin.tables.medicines.root },
              { title: t('symptoms'), path: paths.superadmin.tables.symptoms.root },
              { title: t('diets'), path: paths.superadmin.tables.diets.root },
              { title: t('analyses'), path: paths.superadmin.tables.analysis.root },
              { title: t('insurance companies'), path: paths.superadmin.tables.insurancecomapnies.root },
              { title: t('unit services'), path: paths.superadmin.tables.unitservices.root },
              { title: t('departments'), path: paths.superadmin.tables.departments.root },
              { title: t('specialities'), path: paths.superadmin.tables.specialities.root },
              { title: t('subspecialities'), path: paths.superadmin.tables.subspecialities.root },
              { title: t('appointment types'), path: paths.superadmin.tables.appointypes.root },
              { title: t('free subscriptions'), path: paths.superadmin.tables.freesub.root },
              { title: t('added value taxes'), path: paths.superadmin.tables.taxes.root },
              { title: t('unit service types'), path: paths.superadmin.tables.unitservicetypes.root },
              { title: t('activities'), path: paths.superadmin.tables.activities.root },
              { title: t('employee types'), path: paths.superadmin.tables.employeetypes.root },
              { title: t('payment methods'), path: paths.superadmin.tables.paymentmethods.root },
              { title: t('stakeholder types'), path: paths.superadmin.tables.stakeholdertypes.root },
              { title: t('work shifts'), path: paths.superadmin.tables.workshifts.root },
              { title: t('service types'), path: paths.superadmin.tables.servicetypes.root },
              { title: t('measurement types'), path: paths.superadmin.tables.measurementtypes.root },
              { title: t('hospital list'), path: paths.superadmin.tables.hospitallist.root },
              { title: t('deduction config'), path: paths.superadmin.tables.deductionconfig.root },
              { title: t('rooms'), path: paths.superadmin.tables.rooms.root },
            ],
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
            path: paths.dashboard.user.root,
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
            title: t('my medicines'),
            path: paths.dashboard.user.list,
            icon: <Iconify icon="game-icons:medicines" />,
          },
          {
            title: t('Financial movements'),
            path: '#',
            icon: <Iconify icon="arcticons:gnucash" />,
          },
          {
            title: t('share doctorna'),
            path: paths.dashboard.user.share,
            icon: <Iconify icon="bxs:share-alt" />,
          },
          {
            title: t('logout'),
            path: '#',
            icon: <Iconify icon="tabler:logout" />,
          },
        ],
      },
    ];

    if (user.role === 'superadmin') {
      return superAdminItems;
    }
    if (user.role === 'admin') {
      return [...superAdminItems];
    }
    return [...userItems];
  }, [t, user]);

  return data;
}
