import { useMemo } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export function useNavData() {
  const params = useParams();
  const router = useRouter();

  const checkAcl = useAclGuard();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();
  const { id } = params;

  const departmentData = useGetDepartment(id).data;

  const data = useMemo(() => {
    const employeeItems = [
      {
        show: checkAcl({ category: 'department', subcategory: 'appointments', acl: 'read' }),
        title: t('appointments'),
        path: paths.unitservice.departments.appointments(id),
        icon: <Iconify icon="teenyicons:appointments-solid" />,
      },
      {
        show: checkAcl({ category: 'department', subcategory: 'accounting', acl: 'read' }),
        title: t('accounting'),
        path: paths.unitservice.departments.accounting(id),
        icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
      },
      {
        show: true,
        title: t('feedback'),
        path: paths.unitservice.departments.qualityControl(id),
        icon: <Iconify icon="healthicons:world-care" />,
      },
      {
        show: checkAcl({ category: 'department', subcategory: 'activities', acl: 'read' }),
        title: t('activities'),
        path: paths.unitservice.departments.activities.root(id),
        icon: <Iconify icon="fluent:shifts-activity-24-filled" />,
      },
      {
        show: checkAcl({ category: 'department', subcategory: 'employees', acl: 'read' }), //
        title: t('employees'),
        path: paths.unitservice.departments.employees.root(id),
        icon: <Iconify icon="ic:round-group" />,
      },
      {
        show: checkAcl({ category: 'department', subcategory: 'rooms', acl: 'read' }), //
        title: t('rooms'),
        path: paths.unitservice.departments.rooms.root(id),
        icon: <Iconify icon="ic:sharp-meeting-room" />,
      },
      {
        show: checkAcl({ category: 'department', subcategory: 'work_groups', acl: 'read' }),
        title: t('work groups'),
        path: paths.unitservice.departments.workGroups.root(id),
        icon: <Iconify icon="fa6-solid:people-group" />,
      },
    ];
    const employeeSecDashboard = [
      {
        items: [
          {
            title: curLangAr ? departmentData?.name_arabic : departmentData?.name_english,
            path: paths.unitservice.departments.info(id),
            icon: <Iconify icon="fluent:person-info-20-filled" />,
          },
        ],
      },
      {
        subheader: t('control panel'),
        items: employeeItems.filter((item) => item.show),
      },
    ];

    if (!user) {
      router.replace('/');
    }

    if (user?.role === 'admin') {
      return [...employeeSecDashboard];
    }
    return [...employeeSecDashboard];
  }, [t, user, router, id, departmentData, curLangAr, checkAcl]);

  return data;
}
