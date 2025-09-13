import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { useParams, useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { useGetDepartmentEmployeeEngs } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export function usePermissionDepNavData() {
  const router = useRouter();
  const location = useLocation();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();

  const { depId } = useParams();
  const { employeesData, loading } = useGetDepartmentEmployeeEngs(depId);

  const employeeItems = useMemo(() => {
    if (loading || !employeesData) {
      return [];
    }
    return employeesData.map((info, idx) => {
      const currpath = location.pathname.split('/');
      currpath[6] = info?._id;
      const path = currpath.join('/');
      return {
        title: curLangAr ? info.employee?.name_arabic : info.employee?.name_english,
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

    if (user?.role === 'admin') {
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
