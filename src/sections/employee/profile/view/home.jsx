import { useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetEmployee } from 'src/api/tables';
import AccountGeneral from '../profile-general';
// import AccountNotifications from '../profile-notifications';
import AccountChangePassword from '../profile-change-password';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  // {
  //   value: 'notifications',
  //   label: 'Notifications',
  //   icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  // },
  {
    value: 'security',
    label: 'Security',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('general');

  const { user } = useAuthContext();

  const { data, refetch } = useGetEmployee(user?.employee?._id);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Profile' }]}
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
      {currentTab === 'general' && data && (
        <AccountGeneral employeeData={data} refetch={refetch} />
      )}
      {/* {currentTab === 'notifications' && <AccountNotifications />} */}
      {currentTab === 'security' && <AccountChangePassword />}
    </Container>
  );
}
