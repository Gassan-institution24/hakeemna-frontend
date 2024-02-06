import { useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';
import Iconify from 'src/components/iconify';
import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetUnitservice } from 'src/api/tables';
import { LoadingScreen } from 'src/components/loading-screen';
import AccountGeneral from '../profile-general';
import AccountNotifications from '../profile-notifications';
import AccountChangePassword from '../profile-change-password';

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
