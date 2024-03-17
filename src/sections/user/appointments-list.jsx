import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

// import { useGetPatient } from 'src/api/tables';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
// import { useSettingsContext } from 'src/components/settings';

// import Appoinment from './apointments';
// import AppointmentBooking from './appointments/apointmentsbooking';
import FinishedAppoinment from './appointments/apointmentsfinished';
// ----------------------------------------------------------------------

export default function UserCardList() {
  const { user } = useAuthContext();
  // const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('My Appointments');
  // const { data } = useGetPatient(user?.patient?.[user.index_of]._id);

  const TABS = [
    {
      value: 'My Appointments',
      label: 'My Appointments',
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'BookAppointment',
      label: 'Book Appointment',
      icon: <Iconify icon="icon-park-outline:medicine-chest" width={24} />,
    },
  ];
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  return (
    <Container>
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
          mt: { md: -1 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'My Appointments' && (
        <>
          <h3>Current Appointment</h3>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
          >
            {/* <Appoinment user={user?.patient?.[user.index_of]._id} /> */}
          </Box>
          <hr />
          <h3>Finished Appointment</h3>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
          >
            <FinishedAppoinment user={user?.patient?.[user.index_of]._id} />
          </Box>
        </>
      )}

      {/* {currentTab === 'BookAppointment' && <AppointmentBooking patientData={data} />} */}
    </Container>
  );
}
