import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Medicalreports from '../medicalreports';
import OldMedicalReports from '../oldmedicalrepots';
// ----------------------------------------------------------------------

export default function UserCardList() {
  const { user } = useAuthContext();
  const { t } = useTranslate();
  const [currentTab, setCurrentTab] = useState('Medicalreports');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const TABS = [
    {
      value: 'Medicalreports',
      label: t('Medical Reports'),
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'oldmedicaloeports',
      label: t('Old Medical Reports'),
      icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
    },
  ];
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Medical Reports')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('Medical Reports') },
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
        {TABS.map((tab, idx) => (
          <Tab key={idx} label={tab.label} icon={tab.icon} value={tab.value} />
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
    </Container>
  );
}
