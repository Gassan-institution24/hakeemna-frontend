import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuthContext } from 'src/auth/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import OverviewAppView from 'src/sections/user/homePage/view/home';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const loading = useBoolean(true);

  useEffect(() => {
    if (user.role === 'superadmin') {
      router.push(paths.superadmin.users.root);
    } else if (user.role === 'admin') {
      router.push(paths.unitservice.employees.root);
    } else if (user.role === 'employee') {
      router.push(paths.employee.calender);
    }
    loading.onFalse();
  }, [user.role, router, loading]);
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
