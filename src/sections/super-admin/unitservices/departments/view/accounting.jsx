import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import EconomicMovementsView from '../accounting/invoices/invoices-view';
import PaymentControlView from '../accounting/payment-control/payment-control';

// ----------------------------------------------------------------------

export default function PatientHistoryView({ departmentData }) {
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
    <Container maxWidth="xl">
      {/* <CustomBreadcrumbs
        heading={`${departmentData.name_english || 'Deaprtment'} History`}
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.unitservices.root,
          },
          {
            name: t('departments'),
            href: paths.superadmin.unitservices.departments.root(id),
          },
          {
            name: `${departmentData.name_english || 'Deaprtment'} History`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      /> */}

      {renderTabs}

      {currentTab === 'Invoices' && <EconomicMovementsView departmentData={departmentData} />}
      {currentTab === 'Payment Control' && <PaymentControlView departmentData={departmentData} />}
    </Container>
  );
}

PatientHistoryView.propTypes = {
  departmentData: PropTypes.object,
};
