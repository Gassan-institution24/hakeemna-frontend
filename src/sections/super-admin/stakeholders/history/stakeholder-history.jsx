import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

// import { useGetStakeholderAppointments } from 'src/api';

import EconomicMovementsView from './invoices/invoices-view';
import PaymentControlView from './payment-control/payment-control';

// ----------------------------------------------------------------------

export default function StakeholderHistoryView({ stakeholderData }) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('Appointment');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const HistoryTabsList = [
    'Appointment',
    'Invoices',
    'Accounting',
    'Payment Control',
    'Subscriptions',
  ]; // Invoices === economicMovement

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
  const stakeholderName = stakeholderData?.name_english || 'Stakeholder';
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`${stakeholderName} History`}
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: t('stakeholders'),
            href: paths.superadmin.stakeholders.root,
          },
          {
            name: `${stakeholderName} History`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {renderTabs}

      {/* {currentTab === 'Appointment' && <AppointHistory stakeholderData={stakeholderData} />} */}
      {currentTab === 'Invoices' && <EconomicMovementsView stakeholderData={stakeholderData} />}
      {currentTab === 'Payment Control' && <PaymentControlView stakeholderData={stakeholderData} />}

      {/* {currentTab === 'candidates' && <JobDetailsCandidates candidates={currentJob?.candidates} />} */}
    </Container>
  );
}

StakeholderHistoryView.propTypes = {
  stakeholderData: PropTypes.object,
};
