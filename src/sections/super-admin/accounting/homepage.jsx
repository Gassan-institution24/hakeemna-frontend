import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import StakeholderAccounting from './stakeholders/accounting-table';
import UnitServicesAccounting from './unit-services/accounting-table';

// ----------------------------------------------------------------------

export default function AccountingHomePage() {
  const theme = useTheme();

  const { t } = useTranslate();

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('Unit Services');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const HistoryTabsList = ['Unit Services', 'Stakeholders'];

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {HistoryTabsList.map((tab, idx) => (
        <Tab key={idx} iconPosition="end" value={tab} label={tab} />
      ))}
    </Tabs>
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('accounting')}
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: t('accounting'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {renderTabs}

      {currentTab === 'Unit Services' && <UnitServicesAccounting />}
      {currentTab === 'Stakeholders' && <StakeholderAccounting />}
    </Container>
  );
}
