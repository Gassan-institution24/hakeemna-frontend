import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import useSpecialityGuard from 'src/auth/guard/speciality-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import OverviewAppView from 'src/sections/user/profile-home';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  const { user } = useAuthContext();
  // Dentists start in the dental product; everyone else lands where they always did.
  const { isDentist } = useSpecialityGuard();
  const router = useRouter();
  const loading = useBoolean(true);

  useEffect(() => {
    if (user.role === 'superadmin') {
      if (user.superadmin_level === 1) {
      router.replace(paths.superadmin.users.root);
    } else if (user.superadmin_level === 2) {
      router.replace(paths.superadmin.communication.root);
    }else{
      router.replace(paths.superadmin.users.root);
    }
    } else if (user.role === 'admin') {
      router.push(isDentist ? paths.dental.dashboard : paths.employee.calender);
    } else if (user.role === 'employee') {
      router.push(isDentist ? paths.dental.dashboard : paths.employee.calender);
    }
    loading.onFalse();
  }, [user.role, router, loading, user.superadmin_level, isDentist]);
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading.value && <LoadingScreen />}
      {!loading.value && <OverviewAppView />}
    </>
  );
}
