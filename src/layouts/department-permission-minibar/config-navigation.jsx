import { useMemo } from 'react';
import { useParams } from 'react-router';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetDepartmentEmployeeEngs } from 'src/api';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export function useNavData() {
  const router = useRouter();
  const { id } = useParams();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const { employeesData, loading } = useGetDepartmentEmployeeEngs(id);

  const employeeItems = useMemo(() => {
    if (loading || !employeesData) {
      return [];
    }
    return employeesData.map((info, idx) => ({
      title: curLangAr
        ? info.employee.family_name
        : `${info.employee.first_name} ${info.employee.family_name}`,
      path: paths.unitservice.departments.permissions.employee(id, info._id),
      icon: <Iconify icon="ion:person" />,
    }));
  }, [loading, employeesData, id, curLangAr]);

  const data = useMemo(() => {
    if (!user) {
      router.replace('/');
      return [];
    }

    if (user.role === 'admin') {
      return [
        {
          subheader: t('control panel'),
          items: employeeItems,
        },
      ];
    }

    return [
      {
        subheader: t('control panel'),
        items: employeeItems,
      },
    ];
  }, [t, user, router, employeeItems]);

  return data;
}
