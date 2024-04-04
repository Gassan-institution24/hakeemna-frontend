import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import EconomicMovementsView from '../accouting/invoices/invoices-view';
import PaymentControlView from '../accouting/payment-control/payment-control';

// ----------------------------------------------------------------------

export default function EmployeeAccountingView({ employeeData }) {
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
        heading={`${employeeData.name_english || 'Deaprtment'} History`}
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          {
            name: t('departments'),
            href: paths.unitservice.departments.root,
          },
          {
            name: `${employeeData.name_english || 'Deaprtment'} History`,
          },
        ]}
        sx={{
            mb: { xs: 3, md: 5 },
          }}
      /> */}

      {renderTabs}

      {currentTab === 'Invoices' && <EconomicMovementsView employeeData={employeeData} />}
      {currentTab === 'Payment Control' && <PaymentControlView employeeData={employeeData} />}
    </Container>
  );
}

EmployeeAccountingView.propTypes = {
  employeeData: PropTypes.object,
};
