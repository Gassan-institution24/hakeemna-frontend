import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { useGetPatient } from 'src/api/tables';
import { paths } from 'src/routes/paths';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Prescriptions from '../prescriptions';
import Pharmaces from '../pharmacies';
// ----------------------------------------------------------------------

export default function UserCardList() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('Prescriptions');
  const { data } = useGetPatient(user?.patient._id);
  const TABS = [
    {
      value: 'Prescriptions',
      label: 'Prescriptions',
      icon: <Iconify icon="material-symbols-light:prescriptions-outline" width={24} />,
    },
    {
      value: 'Pharmaces',
      label: 'Pharmacies Near Me',
      icon: <Iconify icon="healthicons:pharmacy-outline" width={24} />,
    },
  ];

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  return (
    <Container>
      <CustomBreadcrumbs
        heading="My Prescriptions"
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: 'My Prescriptions' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
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

      {currentTab === 'Prescriptions' && (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(1, 1fr)',
          }}
          sx={{ width: '100%' }}
        >
          <Prescriptions user={user?.patient._id} />
        </Box>
      )}

      {currentTab === 'Pharmaces' && <Pharmaces patientData={data} />}
    </Container>
  );
}
