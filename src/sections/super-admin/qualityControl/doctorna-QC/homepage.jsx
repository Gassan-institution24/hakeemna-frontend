import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { _jobs, JOB_DETAILS_TABS, JOB_PUBLISH_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { RouterLink } from 'src/routes/components';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import DoctornaFeedback from './doctorna-feedback/feedback';
import SystemError from './system-errors/system-errors-table';
import TableAnalytic from '../../patients/history/table-analytic';

// ----------------------------------------------------------------------

export default function DoctornaQCPage() {
  const theme = useTheme();

  const settings = useSettingsContext();

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
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Doctorna Quality Control"
        links={[
          {
            name: 'Dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Doctorna Quality Control',
          },
        ]}
        style={{ marginBottom: '25px' }}
      />

      {renderTabs}

      {currentTab === 'Feedback' && <DoctornaFeedback />}
      {currentTab === 'System Errors' && <SystemError />}
    </Container>
  );
}
