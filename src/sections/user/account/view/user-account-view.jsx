import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetPatient } from 'src/api';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../account-general';
// import AccountNotifications from '../account-notifications';
import AccountChangePassword from '../account-change-password';

// ----------------------------------------------------------------------

export default function AccountView() {
  const { t } = useTranslate();

  const TABS = [
    {
      value: 'general',
      label: t('General'),
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    // {
    //   value: 'notifications',
    //   label:  t('Notifications'),
    //   icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
    // },
    {
      value: 'security',
      label: t('Security'),
      icon: <Iconify icon="ic:round-vpn-key" width={24} />,
    },
  ];

  const { user } = useAuthContext();
  const { data, refetch, loading } = useGetPatient(user?.patient?.[user.index_of]?._id);
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('Account')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('Account') },
        ]}
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
      {currentTab === 'general' && !loading && <AccountGeneral data={data} refetch={refetch} />}
      {/* {currentTab === 'notifications' && <AccountNotifications />} */}
      {currentTab === 'security' && <AccountChangePassword />}
    </Container>
  );
}
