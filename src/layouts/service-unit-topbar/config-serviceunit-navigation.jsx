import { useMemo } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetUnitservice } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export function useNavData() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { id } = params;

  const unitServiceData = useGetUnitservice(id).data;

  const data = useMemo(() => {
    const employeeItems = [
      {
        title: t('appointments'),
        path: paths.superadmin.unitservices.appointments(id),
        icon: <Iconify icon="teenyicons:appointments-solid" />,
      },
      {
        title: t('departments'),
        path: paths.superadmin.unitservices.departments.root(id),
        icon: <Iconify icon="fluent:content-settings-16-regular" />,
      },
      {
        title: t('accounting'),
        path: paths.superadmin.unitservices.accounting(id),
        icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
      },
      {
        title: t('feedback'),
        path: paths.superadmin.unitservices.feedback(id),
        icon: <Iconify icon="healthicons:world-care" />,
      },
      {
        title: t('employees'),
        path: paths.superadmin.unitservices.employees(id),
        icon: <Iconify icon="fluent-mdl2:time-entry" />,
      },
      {
        title: t('Insurance'),
        path: paths.superadmin.unitservices.insurance(id),
        icon: <Iconify icon="eos-icons:activate-subscriptions" />,
      },
      // {
      //   title: t('management tables'),
      //   path: paths.unitservice.employees.acl(id),
      //   icon: <Iconify icon="mdi:account-secure" />,
      //   children: [
      //     {
      //       title: t('employee types'),
      //       path: paths.unitservice.employees.acl(id),
      //       icon: <Iconify icon="mdi:account-secure" />,
      //     },
      //     {
      //       title: t('work shifts'),
      //       path: paths.unitservice.employees.acl(id),
      //       icon: <Iconify icon="mdi:account-secure" />,
      //     },
      //     {
      //       title: t('work groups'),
      //       path: paths.unitservice.employees.acl(id),
      //       icon: <Iconify icon="mdi:account-secure" />,
      //     },
      //     {
      //       title: t('rooms'),
      //       path: paths.unitservice.employees.acl(id),
      //       icon: <Iconify icon="mdi:account-secure" />,
      //     },
      //   ],
      // },
    ];
    const employeeSecDashboard = [
      {
        items: [
          {
            title: unitServiceData?.name_english,
            path: paths.superadmin.unitservices.info(id),
            icon: <Iconify icon="fluent:person-info-20-filled" />,
          },
        ],
      },
      {
        subheader: t('control panel'),
        items: employeeItems,
      },
    ];

    if (!user) {
      router.replace('/');
    }

    if (user?.role === 'admin') {
      return [...employeeSecDashboard];
    }
    return [...employeeSecDashboard];
  }, [t, user, router, id, unitServiceData]);

  return data;
}
