import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

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
          // {
          //   title: t('file'),
          //   path: paths.dashboard.general.file,
          //   icon: ICONS.file,
          // },
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
            // children: [
            //   { title: t('create'), path: paths.dashboard.user.new },
            // ],
          },
          {
            title: t('account'),
            path: paths.dashboard.user.account,
            // icon: <Iconify icon="bxs:share-alt" />,
          },
          // { title: t('profile'), path: paths.dashboard.user.root },
          { title: t('cards'), path: paths.dashboard.user.cards },
          { title: t('edit'), path: paths.dashboard.user.demo.edit },
          {
            title: t('share doctorna'),
            path: paths.dashboard.user.list,
            icon: <Iconify icon="bxs:share-alt" />,
          },
          // { title: t('share doctorna'), path: paths.dashboard.user.new },
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
