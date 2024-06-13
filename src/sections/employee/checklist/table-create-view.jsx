import { useState, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const [currentTab, setCurrentTab] = useState('select');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  const TABS = [
    {
      value: 'select',
      label: 'select from general checklist',
    },
    {
      value: 'create',
      label: 'create your custom checklist',
    },
  ];
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Create a new checklist"
        links={[
          {
            name: 'dashboard',
            href: paths.employee.root,
          },
          {
            name: 'checklists',
            href: paths.employee.checklist.root,
          },
          { name: 'New checklist' },
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
      {currentTab === 'create' && <TableNewEditForm />}
      {/* {currentTab === 'many' && <TableManyNewForm />} */}

    </Container>
  );
}
