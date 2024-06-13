import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useGetStakeholder } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../profile-general';
import AccountChangePassword from '../profile-change-password';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountView() {
  // const settings = useSettingsContext();

  const { t } = useTranslate();

  const [currentTab, setCurrentTab] = useState('general');

  const { user } = useAuthContext();

  // const checkAcl = useAclGuard();

  const { data, loading, refetch } = useGetStakeholder(user?.stakeholder?._id);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const TABS = [
    {
      value: 'general',
      label: t('general'),
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'security',
      label: t('security'),
      icon: <Iconify icon="ic:round-vpn-key" width={24} />,
    },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('profile')}
        links={[{ name: t('dashboard'), href: paths.dashboard.root }, { name: t('profile') }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab, idx) => (
          <Tab key={idx} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>
      {currentTab === 'general' && data && <AccountGeneral employeeData={data} refetch={refetch} />}
      {currentTab === 'security' && <AccountChangePassword />}
    </Container>
  );
}
