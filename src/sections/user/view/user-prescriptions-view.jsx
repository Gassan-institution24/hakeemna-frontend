import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetPatient } from 'src/api';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Pharmaces from '../pharmacies';
import Prescriptions from '../prescriptions';
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
      label: t('Prescriptions'),
      icon: <Iconify icon="material-symbols-light:prescriptions-outline" width={24} />,
    },
    {
      value: 'Pharmaces',
      label: t('Pharmacies Near Me'),
      icon: <Iconify icon="healthicons:pharmacy-outline" width={24} />,
    },
  ];

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('My Prescriptions')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('My Prescriptions') },
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
