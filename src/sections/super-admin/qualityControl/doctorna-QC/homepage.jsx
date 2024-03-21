import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import DoctornaFeedback from './doctorna-feedback/feedback';
import SystemError from './system-errors/system-errors-table';

// ----------------------------------------------------------------------

export default function DoctornaQCPage() {
  // const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('Feedback');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const HistoryTabsList = ['Feedback', 'System Errors', 'Special Services', 'International Users'];

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
    <Container maxWidth='xl'>
      <CustomBreadcrumbs
        heading="Doctorna Quality Control"
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Doctorna Quality Control',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {renderTabs}

      {currentTab === 'Feedback' && <DoctornaFeedback />}
      {currentTab === 'System Errors' && <SystemError />}
    </Container>
  );
}
