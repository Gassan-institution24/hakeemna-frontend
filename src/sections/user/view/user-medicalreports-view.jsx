import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Bmi from '../bmi';
import Medicalreports from '../medicalreports';
import OldMedicalReports from '../oldmedicalrepots';
// ----------------------------------------------------------------------

export default function UserCardList() {
  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
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
    {
      value: 'bmi',
      label: `${curLangAr ? 'مؤشر كتلة الجسم' : 'BMI'}`,
      icon: <Iconify icon="fluent:calculator-24-filled" width={24} />,
    },
  ];
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('medical reports')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('medical reports') },
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
