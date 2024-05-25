import { useMemo } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useGetEmployeeEngagement } from 'src/api';

// ----------------------------------------------------------------------

export function useNavData() {
  const params = useParams();
  const router = useRouter();
  // const checkAcl = useAclGuard();

  const { t } = useTranslate();

  const { user } = useAuthContext();
  const { id } = params;
  const { data: employee } = useGetEmployeeEngagement(id);

  const currEngagement = user?.employee?.employee_engagements?.[user.employee.selected_engagement];
  console.log('currEngagement', currEngagement);

  const data = useMemo(() => {
    const employeeItems = [
      {
        // show: checkAcl({ category: 'department', subcategory: 'appointments', acl: 'read' }),
        title: t('unit of service level'),
        path: `${paths.unitservice.acl.employees}/${id}/us`,
        icon: <Iconify icon="teenyicons:appointments-solid" />,
      },
      {
        // show: checkAcl({ category: 'department', subcategory: 'accounting', acl: 'read' }),
        title: t('department level'),
        path: `${paths.unitservice.acl.employees}/${id}/departments/${employee?.department?._id}`,
        icon: <Iconify icon="fa6-solid:file-invoice-dollar" />,
      },
      {
        // show: true,
        title: t('work groups level'),
        path: `${paths.unitservice.acl.employees}/${id}/workgroups`,
        icon: <Iconify icon="healthicons:world-care" />,
      },
    ];
    const employeeSecDashboard = [
      // {
      //   items: [
      //     {
      //       title: curLangAr ? departmentData?.name_arabic : departmentData?.name_english,
      //       path: paths.superadmin.unitservices.departments.info(id, depid),
      //       icon: <Iconify icon="fluent:person-info-20-filled" />,
      //     },
      //   ],
      // },
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
  }, [t, user, router, id, employee]);

  return data;
}
