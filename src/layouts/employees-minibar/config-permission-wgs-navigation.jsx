import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { useParams, useRouter } from 'src/routes/hooks';

import { useGetWorkGroup } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export function usePermissionWGNavData() {
  const router = useRouter();
  const location = useLocation();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();

  const { wgid } = useParams();
  const { data: wgData, loading } = useGetWorkGroup(wgid);

  const employeeItems = useMemo(() => {
    if (loading || !wgData?.employees) {
      return [];
    }
    return wgData?.employees?.map((info, idx) => {
      const currpath = location.pathname.split('/');
      currpath[6] = info?._id;
      const path = currpath.join('/');
      return {
        title: curLangAr ? info.employee.employee.name_arabic : info.employee.employee.name_english,
        path,
        icon: <Iconify icon="ion:person" />,
      };
    });
  }, [loading, wgData, curLangAr, location.pathname]);

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
