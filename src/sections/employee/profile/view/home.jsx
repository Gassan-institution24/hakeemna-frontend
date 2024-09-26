import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetEmployee } from 'src/api';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
// import { useAclGuard } from 'src/auth/guard/acl-guard';

import { Button } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
// import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../profile-general';
// import AccountNotifications from '../profile-notifications';
import AccountChangePassword from '../profile-change-password';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountView() {
  // const settings = useSettingsContext();

  const { t } = useTranslate();

  const [currentTab, setCurrentTab] = useState('general');

  const { user } = useAuthContext();

  // const checkAcl = useAclGuard();

  const { data, loading, refetch } = useGetEmployee(user?.employee?._id);

  const employeeEng =
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id;

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
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('profile')}
        links={[{ name: t('dashboard'), href: paths.dashboard.root }, { name: t('profile') }]}
        action={
          <Button
            component={RouterLink}
            href={paths.pages.doctor(
              `${employeeEng}_${user?.employee?.[t('name_english')]?.replace(
                / /g,
                '-'
              )}_${user?.employee?.speciality?.[t('name_english')]?.replace(/ /g, '-')}`
            )}
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
