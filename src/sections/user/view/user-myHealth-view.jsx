import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

// import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Bmi from '../bmi';
import Instructions from '../instructions';
import Mymentalhealth from '../mymentalhealth';

// ----------------------------------------------------------------------

export default function MyHealth() {
  // const { user } = useAuthContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [currentTab, setCurrentTab] = useState('bmi');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const TABS = [
    {
      value: 'bmi',
      label: `${curLangAr ? 'مؤشر كتلة الجسم' : 'BMI'}`,
      icon: <Iconify icon="fluent:calculator-24-filled" width={24} />,
    },
    {
      value: 'instructions',
      label: `${curLangAr ? 'ارشادات' : 'instructions'}`,
      icon: <Iconify icon="fontisto:prescription" width={23} />,
    },
    {
      value: 'mymentalhealth',
      label: `${curLangAr ? 'صحتي النفسية' : 'my mental health'}`,
      icon: <Iconify icon="ri:mental-health-fill" width={24} />,
    },
  ];
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('my health')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('my health') },
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

      {currentTab === 'bmi' && <Bmi />}
      {currentTab === 'mymentalhealth' && <Mymentalhealth />}
      {currentTab === 'instructions' && <Instructions />}
    </Container>
  );
}
