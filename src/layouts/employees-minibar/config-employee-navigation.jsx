import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { useGetUSActiveEmployeeEngs } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export function useNavData() {
  const router = useRouter();
  const location = useLocation();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const { employeesData, loading } = useGetUSActiveEmployeeEngs(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  const employeeItems = useMemo(() => {
    if (loading || !employeesData) {
      return [];
    }
    return employeesData.map((info, idx) => {
      const currpath = location.pathname.split('/');
      currpath[4] = info._id;
      const path = currpath.join('/');
      return {
        title: curLangAr
          ? info.employee.family_name
          : `${info.employee.first_name} ${info.employee.family_name}`,
        path,
        icon: <Iconify icon="ion:person" />,
      };
    });
  }, [loading, employeesData, curLangAr, location.pathname]);

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
