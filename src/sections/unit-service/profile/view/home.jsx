import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { useGetUnitservice } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../profile-general';

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const serviceUnitID =
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id;
  const { data, loading, refetch } = useGetUnitservice(serviceUnitID);

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
        action={
          <Button
            component={RouterLink}
            href={paths.pages.serviceUnit(serviceUnitID)}
            variant="contained"
            target="_blank"
            startIcon={<Iconify icon="icomoon-free:new-tab" />}
          >
            {t('show page')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <AccountGeneral unitServiceData={data} refetch={refetch} />}
    </Container>
  );
}
