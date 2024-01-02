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
// import Appoinment from './apointments';
import Appoinment from '../apointments';
import FinishedAppoinment from '../apointmentsfinished';
import AppointmentBooking from '../apointmentsbooking';
import Prescriptions from '../prescriptions';
import Pharmaces  from '../pharmacies';
// ----------------------------------------------------------------------
const TABS = [
  {
    value: 'Prescriptions',
    label: 'Prescriptions',
    icon: <Iconify icon="material-symbols-light:prescriptions-outline" width={24} />,
  },
  {
    value: 'Pharmaces',
    label: 'Pharmacies Near Me',
    icon: <Iconify icon="healthicons:pharmacy-outline" width={24} />,
  },
  
];

export default function UserCardList() {
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('Prescriptions');
  const { data } = useGetPatient(user.patient._id);
  
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
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

      {currentTab === 'Prescriptions' && (
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(1, 1fr)',
            }}
            sx={{width:'100%'}}
          >
            <Prescriptions user={user.patient._id} />
          </Box>
      )}

      {currentTab === 'Pharmaces' && <Pharmaces patientData={data} />}

    </Container>
  );
}
