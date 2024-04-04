import { useState, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';
import TableManyNewForm from './table-many-new-form';

// ----------------------------------------------------------------------

export default function CountryCreateView() {
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
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Create a new Surgery" /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'tables',
            href: paths.superadmin.tables.list,
          },
          {
            name: 'Surgeries', /// edit
            href: paths.superadmin.tables.surgeries.root,
          },
          { name: 'New surgery' }, /// edit
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
