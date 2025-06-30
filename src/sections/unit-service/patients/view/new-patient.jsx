import Container from '@mui/material/Container';

import { useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AddOnePatient from '../new-patient/add-one-patient';
import TableManyNewForm from '../new-patient/add-many-patients';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const { t } = useTranslate();

  const [currentTab, setCurrentTab] = useState(t('Add a single patient'));

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const HistoryTabsList = [t('Add a single patient'), t('Add mutliple patients')];

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
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('add new patients')} /// edit
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.root,
          },
          {
            name: t('patients'),
            href: paths.superadmin.tables.list,
          },
          { name: t('new') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {renderTabs}
      {currentTab === t('Add a single patient') && <AddOnePatient />}
      {currentTab === t('Add mutliple patients') && <TableManyNewForm />}


    </Container>
  );
}
