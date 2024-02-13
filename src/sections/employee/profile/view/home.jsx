import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetEmployee } from 'src/api';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../profile-general';
// import AccountNotifications from '../profile-notifications';
import AccountChangePassword from '../profile-change-password';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const [currentTab, setCurrentTab] = useState('general');

  const { user } = useAuthContext();

  const { data, loading, refetch } = useGetEmployee(user?.employee?._id);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const TABS = [
    {
      value: 'general',
      label: t('general'),
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    // {
    //   value: 'notifications',
    //   label: 'Notifications',
    //   icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
    // },
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
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
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
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>
      {currentTab === 'general' &&
        data &&
        ACLGuard({ category: 'employee', subcategory: 'info', acl: 'update' }) && (
          <AccountGeneral employeeData={data} refetch={refetch} />
        )}
      {/* {currentTab === 'notifications' && <AccountNotifications />} */}
      {currentTab === 'security' && <AccountChangePassword />}
    </Container>
  );
}
