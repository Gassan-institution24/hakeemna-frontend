import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { useRouter } from 'src/routes/hooks';

import { useGetUSDepartments } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
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
  const { departmentsData, loading } = useGetUSDepartments(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  const employeeItems = useMemo(() => {
    if (loading || !departmentsData) {
      return [];
    }
    return departmentsData.map((info, idx) => {
      const currpath = location.pathname.split('/');
      currpath[5] = info._id;
      currpath[6] = '';

      const path = currpath.join('/');
      return {
        title: curLangAr ? info.name_arabic : info.name_english,
        path,
        icon: <Iconify icon="ion:person" />,
      };
    });
  }, [loading, departmentsData, curLangAr, location.pathname]);

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
