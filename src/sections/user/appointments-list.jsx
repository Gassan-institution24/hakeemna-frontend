import { useAuthContext } from 'src/auth/hooks';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { useGetPatient } from 'src/api/tables';
import Appoinment from './apointments';
import FinishedAppoinment from './apointmentsfinished';
import AppointmentBooking from './apointmentsbooking';
// ----------------------------------------------------------------------

export default function UserCardList() {
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

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
    {
      value: 'medicalreport',
      label: 'Medical Report',
      icon: <Iconify icon="tabler:report-medical" width={24} />,
    },
  ];

  const { data } = useGetPatient(user.patient._id);

  return (
    <Container>
      <Card
        sx={{
          mb: 5,
          height: 50,
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'My Appointments' && (
        <>
          <h3>test</h3>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
          >
            <Appoinment user={user.patient._id} />
          </Box>
          <hr />
          <h3>test</h3>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
          >
            <FinishedAppoinment user={user.patient._id} />
          </Box>
        </>
      )}

      {currentTab === 'BookAppointment' && <AppointmentBooking patientData={data} />}

      {/* {currentTab === 'appointments' && <ProfileFriends appointments={_userFriends}/>} */}
    </Container>
  );
}
