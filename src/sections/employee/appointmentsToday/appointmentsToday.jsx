import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Tab,
  Tabs,
  Table,
  Button,
  Select,
  MenuItem,
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

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import {
  useGetUSRooms,
  useGetEntranceManagement,
  useGetUsAppointmentsToday,
  useGetfinishedAppointments,
} from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import WaitingRoom from 'src/sections/employee/appointmentsToday/wating_room';

export default function AppointmentsToday() {
  const [currentTab, setCurrentTab] = useState('one');

  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const router = useRouter();
  const [selectedTitle, setSelectedTitle] = useState('');

  const { appointmentsData, refetch } = useGetUsAppointmentsToday(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  const { entrance, refetch2 } = useGetEntranceManagement(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  const { finishedAppointmentsData } = useGetfinishedAppointments();

  const TABS = [
    {
      value: 'one',
      label: t('Appointments Today'),
      color: 'info',
      count: appointmentsData?.length,
      data: appointmentsData,
    },
    {
      value: 'two',
      label: t('Rooms'),
      color: 'warning',
      count: entrance?.length,
      data: entrance,
    },
    {
      value: 'three',
      label: t('Finished'),
      color: 'error',
      count: finishedAppointmentsData?.length,
      data: finishedAppointmentsData,
    },
  ];

  const handleChangeTab = useCallback((event, newValue) => setCurrentTab(newValue), []);

  const { roomsData } = useGetUSRooms(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const currentTabData = TABS.find((tab) => tab.value === currentTab);

  const updateStatus = async (id, status, type) => {
    try {
      const endpoint = type === 'arrived' ? 'arrived' : 'coming';
      await axiosInstance.patch(`${endpoints.appointments.one(id)}`, { [endpoint]: status });
      refetch();

      enqueueSnackbar(`Patient ${type === 'arrived' ? 'Arrived' : 'Coming'}: ${status}`, {
        variant: 'success',
      });
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const startAppointment = async (data, activityId) => {
    try {
      await axiosInstance.post(endpoints.entranceManagement.all, {
        patient: data?.patient?._id,
        patient_note: data?.note,
        start_time: new Date().toISOString(),
        Appointment_date: data?.start_time,
        service_unit: data?.unit_service?._id,
        appointmentId: data?._id,
        work_group: data?.work_group?._id,
        Last_activity_atended: data?.Last_activity_atended,
        Next_activity: activityId,
      });
      await axiosInstance.patch(endpoints.appointments.one(data?._id), {
        started: true,
      });
      refetch();
      refetch2();
      setCurrentTab('two');
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
        t(
          'Your browser does not support initiating phone calls. Please use a different device or contact the patient using an alternative method.'
        )
      );
    }
  };

  const handleButtonClick = (activityId, info) => {
    setSelectedTitle(activityId);
    if (info.arrived) {
      startAppointment(info, activityId);
    }
  };

  const renderOptions = (info) => {
    if (currentTab === 'three') {
      return (
        <IconButton
          sx={{ p: 2 }}
          onClick={() => router.push(`${paths.unitservice.departments.viewgPage}/${info?._id}`)}
        >
          <Iconify
            width={20}
            sx={{ cursor: 'pointer', mr: 1, color: 'info.main' }}
            icon="carbon:view"
          />
          <span style={{ fontSize: 16 }}>{t("View")}</span>
        </IconButton>
      );
    }

    return (
      <>
        <Select
          sx={{
            width: 150,
            height: 35,
          }}
          value={selectedTitle}
          displayEmpty
        >
          <MenuItem value="" disabled sx={{ display: 'none' }}>
            {t('Next activity')}
          </MenuItem>
          {roomsData.map((activity, index) => (
            <Button
              onClick={() => handleButtonClick(activity?.activities?._id, info)}
              disabled={info?.started || !info.arrived}
              key={index}
              value={activity?.activities?._id}
              sx={{
                display: 'block',
                width: '100%',
              }}
            >
              {activity?.activities?.name_english}
            </Button>
          ))}
        </Select>
        <IconButton sx={{ p: 2 }} onClick={() => callPatient(info?.patient?.mobile_num1)}>
          <Iconify
            width={20}
            sx={{ cursor: 'pointer', mr: 1, color: 'success.main' }}
            icon="material-symbols:call"
          />
          <span style={{ fontSize: 16 }}>{t('Call')}</span>
        </IconButton>
      </>
    );
  };

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Appointments Today')}
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
      {currentTab === 'two' ? (
        <WaitingRoom />
      ) : (
        <TableContainer sx={{ mt: 3, mb: 2 }}>
          <Scrollbar>
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Time')}</TableCell>
                  <TableCell>{t('patient')}</TableCell>
                  <TableCell>{t('Patient Note')}</TableCell>
                  {currentTab !== 'three' && (
                    <>
                      <TableCell>{t('Coming')}</TableCell>
                      <TableCell>{t('Arrived')}</TableCell>
                    </>
                  )}
                  <TableCell>{t('Options')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentTabData?.data?.map((info, index) => (
                  <TableRow key={index}>
                    <TableCell>{fTime(info?.start_time)}</TableCell>
                    <TableCell>{info?.patient?.name_english}</TableCell>
                    <TableCell>{currentTab === 'three' ? info?.note : info?.note}</TableCell>
                    {currentTab !== 'three' && (
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
                                {t("Yes")}
                              </Button>
                              <Button
                                sx={{ p: 2 }}
                                onClick={() => updateStatus(info?._id, false, 'coming')}
                              >
                                {t("No")}
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
                                {t("Yes")}
                              </Button>
                              <Button
                                sx={{ p: 2 }}
                                onClick={() => updateStatus(info?._id, false, 'arrived')}
                              >
                                {t("No")}
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
      )}
    </Container>
  );
}
