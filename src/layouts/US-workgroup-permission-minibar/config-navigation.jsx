import { useMemo } from 'react';
import { useParams } from 'react-router';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetWorkGroup } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export function useNavData() {
  const router = useRouter();
  const { wgid } = useParams();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const { data, loading } = useGetWorkGroup(wgid);

  const employeeItems = useMemo(() => {
    if (loading || !data) {
      return [];
    }
    return data.employees.map((info, idx) => ({
      title: curLangAr ? info.employee.employee?.name_arabic : info.employee.employee?.name_english,
      path: paths.unitservice.tables.workgroups.permissions.employee(wgid, info._id),
      icon: <Iconify icon="ion:person" />,
    }));
  }, [loading, data, wgid, curLangAr]);

  const results = useMemo(() => {
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

  return results;
}
