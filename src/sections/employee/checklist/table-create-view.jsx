import { useState, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';

import { useTranslate } from 'src/locales';

import TableNewEditForm from './table-new-edit-form';
import SelectChecklistTableView from './select-general';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const [currentTab, setCurrentTab] = useState('create');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const { t } = useTranslate()

  const TABS = [
    {
      value: 'create',
      label: t('create your custom checklist'),
    },
    {
      value: 'select',
      label: t('select from general checklist'),
    },
  ];
  return (
    <Container maxWidth="xl">

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
      {currentTab === 'select' && <SelectChecklistTableView />}
      {currentTab === 'create' && <TableNewEditForm />}

    </Container>
  );
}
