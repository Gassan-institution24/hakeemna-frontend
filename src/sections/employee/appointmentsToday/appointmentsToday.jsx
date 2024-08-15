import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Tab,
  Tabs,
  Table,
  Stack,
  Button,
  Select,
  MenuItem,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetUSRooms,
  useGetEntranceManagement,
  useGetUsAppointmentsToday,
  useGetfinishedAppointments,
} from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import WaitingRoom from 'src/sections/employee/appointmentsToday/rooms';

export default function AppointmentsToday() {
  const [currentTab, setCurrentTab] = useState('one');

  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const router = useRouter();
  const [selectedTitle, setSelectedTitle] = useState('');
  const [addingId, setAddingId] = useState(false);
  const [currId, setCurrId] = useState();

  const [arrivalTimes, setArrivalTimes] = useState({});
  const unitServiceId = user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id

  const { appointmentsData, refetch } = useGetUsAppointmentsToday(
    unitServiceId
  );
  const { entrance, refetch2 } = useGetEntranceManagement(
    unitServiceId
  );

  const { roomsData } = useGetUSRooms(
    unitServiceId
  );

  const { finishedAppointmentsData } = useGetfinishedAppointments();
  const receptionActivity = roomsData.find(
    (activity) => activity?.activities?.name_english === 'Reception'
  );
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

  const currentTabData = TABS.find((tab) => tab.value === currentTab);

  const updateStatus = async (info, status, type) => {
    try {
      const endpoint = type === 'arrived' ? 'arrived' : 'coming';
      if (!info?.unit_service_patient?.identification_num && !info?.patient?.identification_num && !currId && endpoint === 'arrived') {
        setAddingId({ info, status, type })
        return
      }
      setAddingId(false)
      await axiosInstance.patch(`${endpoints.appointments.one(info?._id)}`, { [endpoint]: status, identification_num: currId });
      setCurrId(false)

      if (type === 'arrived' && status) {
        setArrivalTimes((prev) => ({
          ...prev,
          [info?._id]: new Date().toISOString(),
        }));
      }

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
      const entranceData = await axiosInstance.post(endpoints.entranceManagement.all, {
        patient: data?.patient?._id,
        unit_service_patient: data?.unit_service_patient?._id,
        patient_note: data?.note,
        start_time: new Date().toISOString(),
        Appointment_date: data?.start_time,
        service_unit: data?.unit_service?._id,
        appointmentId: data?._id,
        work_group: data?.work_group?._id,
        Last_activity_atended: data?.Last_activity_atended,
        Next_activity: activityId,
        Arrival_time: arrivalTimes[data?._id] || '',
      });
      await axiosInstance.patch(endpoints.appointments.one(data?._id), {
        started: true,
        entrance: entranceData?.data?._id,
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
        <>
          <IconButton
            sx={{ p: 2 }}
            onClick={() => router.push(`${paths.unitservice.departments.viewgPage}/${info?._id}`)}
          >
            <Iconify
              width={20}
              sx={{ cursor: 'pointer', mr: 1, color: 'info.main' }}
              icon="carbon:view"
            />
            <span style={{ fontSize: 16 }}>{t('View')}</span>
          </IconButton>
          <Button
            variant="outlined"
            onClick={() =>
              router.push(
                `${paths.unitservice.accounting.economicmovements.add}?appointment=${info?.appointmentId}&&entrance=${info?._id}`
              )
            }
          >
            {t('make an invoice')}
          </Button>
        </>
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
          onChange={(e) => setSelectedTitle(e.target.value)}
        >
          <MenuItem value="" disabled sx={{ display: 'none' }}>
            {t('Next activity')}
          </MenuItem>
          {roomsData.map((activity, index) =>
            activity?.activities?.name_english !== receptionActivity?.activities?.name_english ? (
              <MenuItem
                key={index}
                value={activity?.activities?._id}
                onClick={() => handleButtonClick(activity?.activities?._id, info)}
                disabled={info?.started || !info.arrived}
              >
                 {curLangAr ? activity?.name_arabic : activity?.name_english}
              </MenuItem>
            ) : null
          )}
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
    <>
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
                  {currentTabData?.data?.map((info, index) => {
                    let patientName
                    if (info?.patient) {
                      patientName = curLangAr ? info?.patient?.name_arabic : info?.patient?.name_english
                    } else if (info.unit_service_patient) {
                      patientName = curLangAr ? info?.unit_service_patient?.name_arabic : info?.unit_service_patient?.name_english
                    }
                    return (
                      <TableRow key={index}>
                        <TableCell>{fTime(info?.start_time)}</TableCell>
                        <TableCell>{patientName}</TableCell>
                        <TableCell>{currentTab === 'three' ? info?.note : info?.note}</TableCell>
                        {currentTab !== 'three' && (
                          <>
                            <TableCell>
                              {info?.coming ? (
                                t('Yes')
                              ) : (
                                <>
                                  <Button
                                    sx={{ p: 2 }}
                                    onClick={() => updateStatus(info, true, 'coming')}
                                  >
                                    {t('Yes')}
                                  </Button>
                                  <Button
                                    sx={{ p: 2 }}
                                    onClick={() => updateStatus(info, false, 'coming')}
                                  >
                                    {t('No')}
                                  </Button>
                                </>
                              )}
                            </TableCell>
                            <TableCell>
                              {info?.arrived ? (
                                t('Yes')
                              ) : (
                                <>
                                  <Button
                                    sx={{ p: 2 }}
                                    onClick={() => updateStatus(info, true, 'arrived')}
                                  >
                                    {t('Yes')}
                                  </Button>
                                  <Button
                                    sx={{ p: 2 }}
                                    onClick={() => updateStatus(info, false, 'arrived')}
                                  >
                                    {t('No')}
                                  </Button>
                                </>
                              )}
                            </TableCell>
                          </>
                        )}
                        <TableCell>{renderOptions(info)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}
      </Container>
      <ConfirmDialog
        open={addingId}
        onClose={() => setAddingId(false)}
        title={t('add patient ID number')}
        content={
          <Stack alignItems='center' width={1}>
            <TextField type='number' onChange={(e) => setCurrId(e.target.value)} />
          </Stack>
        }
        action={
          <LoadingButton
            variant="contained"
            color="info"
            onClick={() => {
              updateStatus(addingId.info, addingId.status, addingId.type)
              setAddingId(false)
            }}
          >
            {t('add')}
          </LoadingButton>
        }
      />
    </>
  );
}
