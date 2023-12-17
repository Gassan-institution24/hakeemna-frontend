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

import { useGetPatientAppointments } from 'src/api/tables';

import AppointHistory from './appointment-history/appoint-history'
import PatientHistoryAnalytic from './appointment-history/appoint-history-analytic';

// ----------------------------------------------------------------------

export default function PatientHistoryView({ patientData }) {
  const theme = useTheme();

  const {appointmentsData} = useGetPatientAppointments(patientData._id)
  console.log('app da',appointmentsData)

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('Appointment');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const getAppointLength = (status) => appointmentsData?.filter((item) => item.status === status).length;

  const getTotalAmount = (status) =>
  sumBy(
    appointmentsData.filter((item) => item.status === status),
    'totalAmount'
  );

const getPercentByStatus = (status) => (getAppointLength(status) / appointmentsData.length) * 100;

  const HistoryTabsList = ['Appointment','Economic Movements','Accounting','Payment Control','Subscriptions']

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {HistoryTabsList.map((tab,idx) => (
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
  (patientData?.first_name && patientData?.last_name && `${patientData?.first_name} ${patientData?.last_name}`) ||
  (patientData?.first_name && patientData?.first_name) ||
  (patientData?.last_name && patientData?.last_name) ||
  'Patient';
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
          heading={`${patientName} History`}
          links={[
            {
              name: 'Dashboard',
              href: paths.superadmin.root,
            },
            {
              name: 'Patients',
              href: paths.superadmin.patients.root,
            },
            {
              name:`${patientName} History`,
            },
          ]}
          style={{ marginBottom: '25px' }}
        />
        <Card
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
        </Card>
      {renderTabs}

      {currentTab === 'Appointment' && <AppointHistory patientData={patientData} />}

      {/* {currentTab === 'candidates' && <JobDetailsCandidates candidates={currentJob?.candidates} />} */}
    </Container>
  );
}

PatientHistoryView.propTypes = {
  patientData: PropTypes.object,
};
