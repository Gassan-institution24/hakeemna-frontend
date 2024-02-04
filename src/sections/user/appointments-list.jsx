import { useAuthContext } from 'src/auth/hooks';
import { useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
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
  const [currentTab, setCurrentTab] = useState('My Appointments');
  const { data } = useGetPatient(user?.patient._id);


  return (
    <AppointmentBooking patientData={data} />
  );
}
