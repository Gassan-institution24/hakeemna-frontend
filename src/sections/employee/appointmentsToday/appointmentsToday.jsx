import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Tab,
  Tabs,
  Table,
  Button,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';

import { fTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import {
  useGetEntranceManagement,
  useGetUsAppointmentsToday,
  useGetfinishedAppointments,
  useGetUsAppointmentsComingpatients,
} from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

export default function AppointmentsToday() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const { appointmentsData, refetch } = useGetUsAppointmentsToday(
    user?.employee?.employee_engagements?.[0]?.unit_service?._id
  );
  const { comingPatientData } = useGetUsAppointmentsComingpatients(
    user?.employee?.employee_engagements?.[0]?.unit_service?._id
  );
  const { entranceData } = useGetEntranceManagement();
  const { finishedAppointmentsData } = useGetfinishedAppointments();

  const TABS = [
    {
      value: 'one',
      label: 'Appointments Today',
      color: 'info',
      count: appointmentsData?.length,
      data: appointmentsData,
    },
    {
      value: 'two',
      label: 'Coming',
      color: 'success',
      count: comingPatientData?.length,
      data: comingPatientData,
    },
    {
      value: 'three',
      label: 'Waiting',
      color: 'warning',
      count: entranceData?.length,
      data: entranceData,
    },
    {
      value: 'four',
      label: 'Finished',
      color: 'error',
      count: finishedAppointmentsData?.length,
      data: finishedAppointmentsData,
    },
  ];

  const [currentTab, setCurrentTab] = useState('one');
  const handleChangeTab = useCallback((event, newValue) => setCurrentTab(newValue), []);

  const isEntranceTab = TABS.find((tab) => tab.value === currentTab)?.data === entranceData;

  const updateArrivalStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`${endpoints.appointments.one(id)}`, { arrived: status });
      refetch();
      enqueueSnackbar(`Patient Arrived: ${status}`, { variant: 'success' });
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const updateComingStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`${endpoints.appointments.one(id)}`, { coming: status });
      refetch();
      enqueueSnackbar(`Patient Coming: ${status}`, { variant: 'success' });
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const startAppointment = async (data) => {
    try {
      await axiosInstance.post(endpoints.entranceManagement.all, {
        patient: data?.patient?._id,
        patient_note: data?.note,
        start_time: new Date().toISOString(),
        wating: true,
      });
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error starting appointment', { variant: 'error' });
    }
  };

  const callPatient = (mobileNumber) => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      navigator.contacts.select(['phoneNumbers']).then((contact) => {
        if (contact) {
          const phoneNumber = contact.phoneNumbers[0].value;
          window.location.href = `tel:${phoneNumber}`;
        }
      });
    } else {
      alert(
        'Your browser does not support initiating phone calls. Please use a different device or contact the patient using an alternative method.'
      );
    }
  };

  return (
    <Container>
      <CustomBreadcrumbs
        heading="Appointments Today"
        links={[{ name: user.userName }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{ px: 2.5, boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}` }}
      >
        {TABS.map((tab, idx) => (
          <Tab
            key={idx}
            value={tab.value}
            label={tab.label}
            iconPosition="end"
            icon={<Label color={tab.color}>{tab.count}</Label>}
          />
        ))}
      </Tabs>
      <TableContainer sx={{ mt: 3, mb: 2 }}>
        <Scrollbar>
          <Table sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Patient Note</TableCell>
                {!isEntranceTab && (
                  <>
                    <TableCell>Coming</TableCell>
                    <TableCell>Arrived</TableCell>
                  </>
                )}
                <TableCell>Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TABS.find((tab) => tab.value === currentTab)?.data?.map((info, index) => (
                <TableRow key={index}>
                  <TableCell>{fTime(info?.start_time)}</TableCell>
                  <TableCell>{info?.patient?.name_english}</TableCell>
                  <TableCell>{isEntranceTab ? info?.patient_note : info?.note}</TableCell>
                  {!isEntranceTab && (
                    <>
                      <TableCell>
                        {info?.coming ? (
                          'YES'
                        ) : (
                          <>
                            <Button
                              sx={{ p: 2 }}
                              onClick={() => updateComingStatus(info?._id, true)}
                            >
                              Yes
                            </Button>
                            <Button
                              sx={{ p: 2 }}
                              onClick={() => updateComingStatus(info?._id, false)}
                            >
                              No
                            </Button>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {info?.arrived ? (
                          'YES'
                        ) : (
                          <>
                            <Button
                              sx={{ p: 2 }}
                              onClick={() => updateArrivalStatus(info?._id, true)}
                            >
                              Yes
                            </Button>
                            <Button
                              sx={{ p: 2 }}
                              onClick={() => updateArrivalStatus(info?._id, false)}
                            >
                              No
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </>
                  )}
                  <TableCell>
                    {isEntranceTab ? (
                      <IconButton sx={{ p: 2 }} onClick={() => alert('test')}>
                        <Iconify
                          width={20}
                          sx={{ cursor: 'pointer', mr: 1, color: 'info.main' }}
                          icon="mage:next-fill"
                        />
                        <span style={{ fontSize: 18 }}>Next</span>
                      </IconButton>
                    ) : (
                      <>
                        <IconButton
                          sx={{ p: 2 }}
                          onClick={() => info.arrived && startAppointment(info)}
                          disabled={!info.arrived}
                        >
                          <Iconify
                            width={20}
                            sx={{ cursor: 'pointer', mr: 1, color: '#2788EF' }}
                            icon="teenyicons:next-solid"
                          />
                          <span style={{ fontSize: 16 }}>Start</span>
                        </IconButton>
                        <IconButton
                          sx={{ p: 2 }}
                          onClick={() => callPatient(info?.patient?.mobile_num1)}
                        >
                          <Iconify
                            width={20}
                            sx={{ cursor: 'pointer', mr: 1, color: 'success.main' }}
                            icon="material-symbols:call"
                          />
                          <span style={{ fontSize: 16 }}>Call</span>
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Container>
  );
}
