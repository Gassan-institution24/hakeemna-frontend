import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useState, useCallback } from 'react';

import { Tab, Box, Tabs, Card, Stack, Container } from '@mui/material';

import { useGetOneEntranceManagement } from 'src/api';

import SickLeave from './sickLeave';
import Prescription from './prescription';
import Doctorreport from './doctorReport';
import Medicalreport from './medicalreport';

// ----------------------------------------------------------------------

export default function TabsView({ patient, service_unit }) {
  const [currentTab, setCurrentTab] = useState('one');
  const params = useParams();
  const { id } = params;
  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });
  const TABS = [
    {
      value: 'one',
      title: 'Prescription',
      label: <Prescription Entrance={Entrance} />,
    },
    {
      value: 'two',
      title: 'medical report',
      label: <Medicalreport />,
    },
    {
      value: 'three',
      title: 'doctor report',
      label: <Doctorreport />,
    },
    {
      value: 'four',
      title: 'sick leave',
      label: <SickLeave />,
    },
  ];

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Card sx={{ mt: 3 }}>
      <Container sx={{ my: 2 }}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Tabs value={currentTab} onChange={handleChangeTab}>
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.title} />
            ))}
          </Tabs>

          {TABS.map(
            (tab) =>
              tab.value === currentTab && (
                <Box
                  key={tab.value}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'background.neutral',
                  }}
                >
                  {tab.label}
                </Box>
              )
          )}
        </Stack>
      </Container>
    </Card>
  );
}
TabsView.propTypes = {
  patient: PropTypes.object,
  service_unit: PropTypes.string,
};
