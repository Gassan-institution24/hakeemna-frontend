import { useState, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';
import TableManyNewForm from './table-many-new-form';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('many');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  const TABS = [
    {
      value: 'many',
      label: 'Add many',
    },
    {
      value: 'one',
      label: 'Add one',
    },
  ];
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Subspecialty"
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Tables',
            href: paths.superadmin.tables.list,
          },
          {
            name: 'Subspecialties',
            href: paths.superadmin.tables.subspecialities.root,
          },
          { name: 'New Subspecialty' },
        ]}
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
          <Tab key={idx} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      {currentTab === 'one' && <TableNewEditForm />}
      {currentTab === 'many' && <TableManyNewForm />}
    </Container>
  );
}
