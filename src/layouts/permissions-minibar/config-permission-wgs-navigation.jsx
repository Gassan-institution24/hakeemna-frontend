import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { useParams, useRouter } from 'src/routes/hooks';

import { useGetEmployeeWorkGroups, useGetWorkGroup } from 'src/api';
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

  const { id } = useParams();

  const { workGroupsData, loading } = useGetEmployeeWorkGroups(id);

  console.log('workGroupsData', workGroupsData);

  const employeeItems = useMemo(() => {
    if (loading || !workGroupsData) {
      return [];
    }
    return workGroupsData?.map((info, idx) => {
      const currpath = location.pathname.split('/');
      currpath[7] = info?._id;
      const path = currpath.join('/');
      return {
        title: curLangAr ? info.name_arabic : info.name_english,
        path,
        icon: <Iconify icon="ion:person" />,
      };
    });
  }, [loading, workGroupsData, curLangAr, location.pathname]);

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
