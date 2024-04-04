import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import EconomicMovementsView from './invoices/invoices-view';
import AppointHistory from './appointment-history/appoint-history';
import PaymentControlView from './payment-control/payment-control';

// ----------------------------------------------------------------------

export default function PatientHistoryView({ patientData }) {
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
        <Tab
          key={idx}
          iconPosition="end"
          value={tab}
          label={tab}
          // icon={
          //   tab === 'candidates' ? (
          //     <Label variant="filled">{currentJob?.candidates.length}</Label>
          //   ) : (
          //     ''
          //   )
          // }
        />
      ))}
    </Tabs>
  );
  const patientName =
    (patientData?.first_name &&
      patientData?.last_name &&
      `${patientData?.first_name} ${patientData?.last_name}`) ||
    (patientData?.first_name && patientData?.first_name) ||
    (patientData?.last_name && patientData?.last_name) ||
    'Patient';

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={`${patientName} History`}
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: t('patients'),
            href: paths.superadmin.patients.root,
          },
          {
            name: `${patientName} History`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {/* <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <PatientHistoryAnalytic
                title="Total"
                total={appointmentsData.length}
                percent={100}
                price={sumBy(appointmentsData, 'totalAmount')}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.text.secondary}
              />
              <PatientHistoryAnalytic
                title="Pending"
                total={getAppointLength('pending')}
                percent={getPercentByStatus('pending')}
                price={getTotalAmount('pending')}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.warning.main}
              />

              <PatientHistoryAnalytic
                title="Processing"
                total={getAppointLength('processing')}
                percent={getPercentByStatus('processing')}
                price={getTotalAmount('processing')}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.info.main}
              />

              <PatientHistoryAnalytic
                title="Finished"
                total={getAppointLength('finished')}
                percent={getPercentByStatus('finished')}
                price={getTotalAmount('finished')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.success.main}
              />

              <PatientHistoryAnalytic
                title="Canceled"
                total={getAppointLength('canceled')}
                percent={getPercentByStatus('canceled')}
                price={getTotalAmount('canceled')}
                icon="solar:bell-bing-bold-duotone"
                color={theme.palette.error.main}
              />
            </Stack>
          </Scrollbar>
        </Card> */}
      {renderTabs}

      {currentTab === 'Appointment' && <AppointHistory patientData={patientData} />}
      {currentTab === 'Invoices' && <EconomicMovementsView patientData={patientData} />}
      {currentTab === 'Payment Control' && <PaymentControlView patientData={patientData} />}

      {/* {currentTab === 'candidates' && <JobDetailsCandidates candidates={currentJob?.candidates} />} */}
    </Container>
  );
}

PatientHistoryView.propTypes = {
  patientData: PropTypes.object,
};
