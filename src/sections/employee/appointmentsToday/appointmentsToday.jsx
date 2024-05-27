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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

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
  const router = useRouter();

  const { appointmentsData, refetch: refetchAppointments } = useGetUsAppointmentsToday(
    user?.employee?.employee_engagements?.[0]?.unit_service?._id
  );
  const { comingPatientData, refetch: refetchComingPatients } = useGetUsAppointmentsComingpatients(
    user?.employee?.employee_engagements?.[0]?.unit_service?._id
  );
  const { entranceData, refetch: refetchEntrance } = useGetEntranceManagement();
  const { finishedAppointmentsData, refetch: refetchFinishedAppointments } = useGetfinishedAppointments();
  
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

  const currentTabData = TABS.find((tab) => tab.value === currentTab);
  
  const refetchAll = () => {
    refetchAppointments();
    refetchComingPatients();
    refetchEntrance();
    refetchFinishedAppointments();
  };

  const goToProcessingPage = async (id) => {
    try {
      router.push(`${paths.unitservice.departments.processingPage}/${id}`);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const updateStatus = async (id, status, type) => {
    try {
      const endpoint = type === 'arrived' ? 'arrived' : 'coming';
      await axiosInstance.patch(`${endpoints.appointments.one(id)}`, { [endpoint]: status });
      refetchAll();
      enqueueSnackbar(`Patient ${type === 'arrived' ? 'Arrived' : 'Coming'}: ${status}`, {
        variant: 'success',
      });
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
        Appointment_date: data?.start_time,
        service_unit: data?.unit_service?._id,
        appointmentId: data?._id,
      });
      await axiosInstance.patch(endpoints.appointments.one(data?._id), {
        started: true,
      });
      refetchAll();
      setCurrentTab('three')
      enqueueSnackbar('Appointment started', { variant: 'success' });
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

  const renderOptions = (info) => {
    if (currentTab === 'three') {
      return (
        <IconButton sx={{ p: 2 }} onClick={() => goToProcessingPage(info?._id)}>
          <Iconify
            width={20}
            sx={{ cursor: 'pointer', mr: 1, color: 'info.main' }}
            icon="mage:next-fill"
          />
          <span style={{ fontSize: 18 }}>Next</span>
        </IconButton>
      );
    }

    if (currentTab === 'four') {
      return (
        <IconButton sx={{ p: 2 }} onClick={() => router.push(`${paths.unitservice.departments.viewgPage}/${info?._id}`)}>
          <Iconify
            width={20}
            sx={{ cursor: 'pointer', mr: 1, color: 'info.main' }}
            icon="carbon:view"
          />
          <span style={{ fontSize: 16 }}>View</span>
        </IconButton>
      );
    }

    return (
      <>
        <IconButton
          sx={{ p: 2 }}
          onClick={() => info.arrived && startAppointment(info)}
          disabled={info?.started || !info.arrived}
        >
          <Iconify
            width={20}
            sx={{ cursor: 'pointer', mr: 1, color: '#2788EF' }}
            icon="teenyicons:next-solid"
          />
          <span style={{ fontSize: 16 }}>Start</span>
        </IconButton>
        <IconButton sx={{ p: 2 }} onClick={() => callPatient(info?.patient?.mobile_num1)}>
          <Iconify
            width={20}
            sx={{ cursor: 'pointer', mr: 1, color: 'success.main' }}
            icon="material-symbols:call"
          />
          <span style={{ fontSize: 16 }}>Call</span>
        </IconButton>
      </>
    );
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
                {currentTab !== 'three' && currentTab !== 'four' && currentTab !== 'two' && (
                  <>
                    <TableCell>Coming</TableCell>
                    <TableCell>Arrived</TableCell>
                  </>
                )}
                <TableCell>Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTabData?.data?.map((info, index) => (
                <TableRow key={index}>
                  <TableCell>{fTime(info?.start_time)}</TableCell>
                  <TableCell>{info?.patient?.name_english}</TableCell>
                  <TableCell>
                    {currentTab === 'three' || currentTab === 'four'
                      ? info?.patient_note
                      : info?.note}
                  </TableCell>
                  {currentTab !== 'three' && currentTab !== 'four' && currentTab !== 'two' && (
                    <>
                      <TableCell>
                        {info?.coming ? (
                          'YES'
                        ) : (
                          <>
                            <Button
                              sx={{ p: 2 }}
                              onClick={() => updateStatus(info?._id, true, 'coming')}
                            >
                              Yes
                            </Button>
                            <Button
                              sx={{ p: 2 }}
                              onClick={() => updateStatus(info?._id, false, 'coming')}
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
                              onClick={() => updateStatus(info?._id, true, 'arrived')}
                            >
                              Yes
                            </Button>
                            <Button
                              sx={{ p: 2 }}
                              onClick={() => updateStatus(info?._id, false, 'arrived')}
                            >
                              No
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </>
                  )}
                  <TableCell>{renderOptions(info)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Container>
  );
}
