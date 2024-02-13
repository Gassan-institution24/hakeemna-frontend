import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useGetUnitservice } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../profile-general';

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  // console.log('user', user);

  const { data, loading, refetch } = useGetUnitservice(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id
  );

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('unit service info')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('unit service info') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <AccountGeneral unitServiceData={data} refetch={refetch} />}
    </Container>
  );
}
