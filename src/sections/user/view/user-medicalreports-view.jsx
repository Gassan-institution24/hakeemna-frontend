import { useAuthContext } from 'src/auth/hooks';
import { useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import { paths } from 'src/routes/paths';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { useGetPatient } from 'src/api/tables';
import Medicalreports from '../medicalreports';
import OldMedicalReports from '../oldmedicalrepots';
import Bmi from '../bmi';
// ----------------------------------------------------------------------

export default function UserCardList() {
  const { user } = useAuthContext();
  const [currentTab, setCurrentTab] = useState('Medicalreports');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const TABS = [
    {
      value: 'Medicalreports',
      label: 'Medical Reports',
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'oldmedicaloeports',
      label: 'Old Medical Reports',
      icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
    },
    {
      value: 'bmi',
      label: 'BMI',
      icon: <Iconify icon="fluent:calculator-24-filled" width={24} />,
    },
  ];
  return (
    <Container>
      <CustomBreadcrumbs
        heading="Medical Reports"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: 'Medical Reports' },
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
      {currentTab === 'Medicalreports' && (
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
          <Medicalreports user={user?.patient._id} />
        </Box>
      )}
      {currentTab === 'oldmedicaloeports' && <OldMedicalReports user={user?.patient._id} />}
      {currentTab === 'bmi' && <Bmi />}
    </Container>
  );
}
