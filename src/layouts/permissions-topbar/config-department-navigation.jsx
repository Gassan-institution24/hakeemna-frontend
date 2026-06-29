import { useMemo } from 'react';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function useNavData() {
  const router = useRouter();

  const { t } = useTranslate();

  const { user } = useAuthContext();

  const data = useMemo(() => {
    const employeeSecDashboard = [
      {
        subheader: t('control panel'),
        items: [],
      },
    ];

    if (!user) {
      router.replace('/');
    }

    return [...employeeSecDashboard];
  }, [t, user, router]);

  return data;
}
