import Container from '@mui/material/Container';

import { useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableManyNewForm from '../new-patient/add-many-patients';
import AddOnePatient from '../new-patient/add-one-patient';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const { t } = useTranslate();

  const [currentTab, setCurrentTab] = useState(t('Add mutliple patients'));

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const HistoryTabsList = [t('Add mutliple patients'), t('Add a single patient')];

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
      {currentTab === t('Add mutliple patients') && <TableManyNewForm />}
      {currentTab === t('Add a single patient') && <AddOnePatient />}


    </Container>
  );
}
