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

import Radiology from '../radiology';
// ----------------------------------------------------------------------

export default function UserCardList() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const [currentTab, setCurrentTab] = useState('radiology');
  const TABS = [
    {
      value: 'radiology',
      label: t('radiology'),
      icon: <Iconify icon="material-symbols-light:prescriptions-outline" width={24} />,
    },
  ];

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('My radiology')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('My radiology') },
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

      {currentTab === 'radiology' && (
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
          <Radiology user={user?.patient._id} />
        </Box>
      )}
    </Container>
  );
}
