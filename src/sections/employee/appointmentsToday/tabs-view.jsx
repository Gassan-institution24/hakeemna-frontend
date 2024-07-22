import { useState, useCallback } from 'react';

import Masonry from '@mui/lab/Masonry';
import { Tab, Box, Tabs, Card, Stack, Container } from '@mui/material';
import PropTypes from 'prop-types';

import { useParams } from 'react-router';
import { useGetOneEntranceManagement } from 'src/api';
import Prescription from './prescription';
import SickLeave from './sickLeave';

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
      label: 'Item Two',
    },
    {
      value: 'three',
      title: 'doctor report',
      label: 'Item Three',
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
    <Card>
      <Container sx={{ my: 2 }}>
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Tabs value={currentTab} onChange={handleChangeTab}>
              {TABS.slice(0, 4).map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.title} />
              ))}
            </Tabs>

            {TABS.slice(0, 4).map(
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
        </Masonry>
      </Container>
    </Card>
  );
}
TabsView.propTypes = {
  patient: PropTypes.object,
  service_unit: PropTypes.string,
};
