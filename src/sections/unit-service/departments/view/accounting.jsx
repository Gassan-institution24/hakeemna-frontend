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

import EconomicMovementsView from '../accounting/invoices/invoices-view';
import PaymentControlView from '../accounting/payment-control/payment-control';

// ----------------------------------------------------------------------

export default function PatientHistoryView({ departmentData }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('Invoices');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const HistoryTabsList = ['Invoices', 'Payment Control']; // Invoices === economicMovement

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
        heading={`${departmentData.name_english || 'Deaprtment'} History`}
        links={[
          {
            name: 'Dashboard',
            href: paths.unitservice.root,
          },
          {
            name: 'Departments',
            href: paths.unitservice.departments.root,
          },
          {
            name: `${departmentData.name_english || 'Deaprtment'} History`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {renderTabs}

      {currentTab === 'Invoices' && <EconomicMovementsView departmentData={departmentData} />}
      {currentTab === 'Payment Control' && <PaymentControlView departmentData={departmentData} />}
    </Container>
  );
}

PatientHistoryView.propTypes = {
  departmentData: PropTypes.object,
};
