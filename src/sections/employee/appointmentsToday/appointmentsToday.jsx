import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import { Container } from '@mui/system';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Tab,
  Tabs,
  Table,
  Button,
  Select,
  Dialog,
  MenuItem,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';
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
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import WaitingRoom from 'src/sections/employee/appointmentsToday/rooms';

import NewAppointmentDialog from './new-patient/new-patient';

export default function AppointmentsToday() {
  const checkAcl = useAclGuard();

  const [currentTab, setCurrentTab] = useState('one');

  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const router = useRouter();
  const [selectedTitle, setSelectedTitle] = useState('');
  const [pateintInfo, setPatientInfo] = useState('');
  const [addingId, setAddingId] = useState();
  const { fullWidth } = useState(false);
  const { maxWidth } = useState('xs');
  const dialog = useBoolean(false);
  const iddialog = useBoolean(false);
  const [newDialog, setNewDialog] = useState(false);

  const unitServiceId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id;

  const { appointmentsData, refetch } = useGetUsAppointmentsToday(unitServiceId);
  const { entrance, refetch2 } = useGetEntranceManagement(unitServiceId);

  const { roomsData } = useGetUSRooms(unitServiceId);

  const { finishedAppointmentsData, refetch3 } = useGetfinishedAppointments(unitServiceId);
  const receptionActivity = roomsData.find(
    (activity) => activity?.activities?.name_english === 'Reception'
  );
  const TABS = [
    checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'appointment' }) && {
      value: 'one',
      label: t('Appointments Today'),
      color: 'info',
      count: appointmentsData?.length,
      data: appointmentsData,
    },
    checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'rooms' }) && {
      value: 'two',
      label: t('Rooms'),
      color: 'warning',
      count: entrance?.length,
      data: entrance,
    },
    checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'finished' }) && {
      value: 'three',
      label: t('Finished'),
      color: 'error',
      count: finishedAppointmentsData?.length,
      data: finishedAppointmentsData,
    },
  ].filter(Boolean);

  const handleChangeTab = useCallback((event, newValue) => setCurrentTab(newValue), []);

  const currentTabData = TABS.find((tab) => tab.value === currentTab);

  const startAppointment = async (info) => {
    try {
      const entranceData = await axiosInstance.post(endpoints.entranceManagement.all, {
        patient: info?.patient?._id,
        unit_service_patient: info?.unit_service_patient?._id,
        patient_note: info?.note,
        start_time: new Date().toISOString(),
        Appointment_date: info?.start_time,
        service_unit: info?.unit_service?._id,
        appointmentId: info?._id,
        work_group: info?.work_group?._id,
        Last_activity_atended: info?.Last_activity_atended,
        Arrival_time: info?.created_at,
      });
      const dataToUpdate = {
        started: true,
        entrance: entranceData?.data?._id,
        arrived: true,
      };
      if (addingId) {
        dataToUpdate.identification_num = addingId;
      }
      await axiosInstance.patch(`${endpoints.appointments.one(info?._id)}`, dataToUpdate);
      refetch();
      enqueueSnackbar('Appointment started successfully', {
        variant: 'success',
      });
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };
  const StatusFunction = async (info, status, alert) => {
    try {
      const updateField = alert === 'coming' ? { coming: status } : { arrived: status };

      await axiosInstance.patch(`${endpoints.appointments.one(info?._id)}`, updateField);
      refetch();
      enqueueSnackbar(`${info?.patient?.name_english} ${alert}`, {
        variant: 'success',
      });
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };
  const dialogOnTrue = async (info) => {
    dialog.onTrue();
    setPatientInfo(info);
  };

  const updateAppointmentactivity = async (activityId, info) => {
    try {
      await axiosInstance.patch(`${endpoints.entranceManagement.one(info?.entrance)}`, {
        Next_activity: activityId,
      });
      await axiosInstance.patch(`${endpoints.appointments.one(info?._id)}`, {
        activityhappend: true,
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

  const handleEndAppointment = async (appointmentdata) => {
    try {
      await axiosInstance.patch(`/api/entrance/${appointmentdata?.entrance}`, {
        Patient_attended: true,
      });
      await axiosInstance.patch(`/api/appointments/${appointmentdata?._id}`, {
        finished_or_not: true,
      });
      await axiosInstance.post('/api/feedback', {
        unit_service: appointmentdata?.unit_service?._id,
        appointment: appointmentdata?._id,
        patient: appointmentdata?.patient?._id,
        unit_service_patient: appointmentdata?.unit_service_patient?._id,
      });
      enqueueSnackbar('appointment finished', { variant: 'success' });
      refetch();
      refetch2();
      refetch3();
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('something went wrong', { variant: 'error' });
    }
  };

  useEffect(() => {
    setCurrentTab(TABS[0].value);
    // eslint-disable-next-line
  }, []);

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

    return info?.arrived ? (
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
                onClick={() => updateAppointmentactivity(activity?.activities?._id, info)}
                // disabled={info?.activityhappend}
              >
                {curLangAr ? activity?.name_arabic : activity?.name_english}
              </MenuItem>
            ) : null
          )}
        </Select>
        <Button
          onClick={() => handleEndAppointment(info)}
          variant="contained"
          sx={{ bgcolor: 'error.main', ml: 2 }}
        >
          {t('end appointment')}
        </Button>
      </>
    ) : (
      <IconButton sx={{ p: 2 }} onClick={() => dialogOnTrue(info?.patient)}>
        <Iconify
          width={20}
          sx={{ cursor: 'pointer', mr: 1, color: 'success.main' }}
          icon="material-symbols:call"
        />
      </IconButton>
    );
  };

  return (
    <>
      <Dialog open={dialog.value} maxWidth={maxWidth} onClose={dialog.onTrue} fullWidth={fullWidth}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            margin: '10px',
          }}
        >
          <DialogTitle>{t('Contact patient')}</DialogTitle>
          <Typography sx={{ mb: 1, fontSize: 15 }}>
            {t('Thoos are some data the pateint provide to contact')}
          </Typography>
        </div>
        <DialogContent>
          <Typography sx={{ mb: 1, fontSize: 15, m: 2 }}>
            {' '}
            <Iconify
              width={20}
              sx={{ cursor: 'pointer', color: 'success.main' }}
              icon="material-symbols:call"
            />
            {pateintInfo?.mobile_num1}
          </Typography>
          <Typography sx={{ mb: 1, fontSize: 15, m: 2 }}>
            {' '}
            <Iconify
              width={20}
              sx={{ cursor: 'pointer', color: 'success.main' }}
              icon="material-symbols:call"
            />
            {pateintInfo?.mobile_num2}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            color="info"
            variant="contained"
            sx={{
              bgcolor: 'info.dark',
            }}
            onClick={() => {
              dialog.onFalse();
              setPatientInfo('');
            }}
          >
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      <Container>
        <CustomBreadcrumbs
          heading={t('Appointments Today')}
          links={[{ name: curLangAr ? user.employee?.name_arabic : user.employee?.name_english }]}
          action={
            checkAcl({
              category: 'work_group',
              subcategory: 'appointments',
              acl: 'create',
            }) && (
              <>
                <Button
                  sx={{ mr: 2 }}
                  component={RouterLink}
                  href={paths.employee.appointments.book}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  {t('book appointment')}
                </Button>
                <Button
                  component={RouterLink}
                  onClick={() => setNewDialog(true)}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  {t('create & book appointment')}
                </Button>
              </>
            )
          }
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
                    let patientName;
                    if (info?.patient) {
                      patientName = curLangAr
                        ? info?.patient?.name_arabic
                        : info?.patient?.name_english;
                    } else if (info.unit_service_patient) {
                      patientName = curLangAr
                        ? info?.unit_service_patient?.name_arabic
                        : info?.unit_service_patient?.name_english;
                    }
                    return (
                      <>
                        <TableRow sx={{ borderBottom: '2px #91edff ridge' }} key={index}>
                          <TableCell>{fTime(info?.start_time)}</TableCell>
                          <TableCell>{patientName}</TableCell>
                          {currentTab !== 'three' && (
                            <>
                              <TableCell>
                                <>
                                  {info?.coming !== undefined ? (
                                    <Iconify
                                      width={22}
                                      sx={{
                                        cursor: 'pointer',
                                        mr: 1,
                                        color: info.coming ? 'info.main' : 'error.main',
                                      }}
                                      icon={info.coming ? 'dashicons:yes' : 'dashicons:no'}
                                    />
                                  ) : (
                                    <>
                                      <Button
                                        sx={{ p: 2 }}
                                        onClick={() => StatusFunction(info, true, 'coming')}
                                      >
                                        {t('Yes')}
                                      </Button>
                                      <Button
                                        sx={{ p: 2 }}
                                        onClick={() => StatusFunction(info, false, 'coming')}
                                      >
                                        {t('No')}
                                      </Button>
                                    </>
                                  )}
                                </>
                              </TableCell>

                              <TableCell>
                                <>
                                  {info?.arrived !== undefined ? (
                                    <Iconify
                                      width={22}
                                      sx={{
                                        cursor: 'pointer',
                                        mr: 1,
                                        color: info.arrived ? 'info.main' : 'error.main',
                                      }}
                                      icon={info.arrived ? 'dashicons:yes' : 'dashicons:no'}
                                    />
                                  ) : (
                                    <>
                                      {info?.unit_service_patient?.identification_num ||
                                      info?.patient?.identification_num ? (
                                        <Button
                                          sx={{ p: 2 }}
                                          onClick={() => startAppointment(info)}
                                        >
                                          {t('Yes')}
                                        </Button>
                                      ) : (
                                        <Button sx={{ p: 2 }} onClick={iddialog.onTrue}>
                                          {t('Yes')}
                                        </Button>
                                      )}

                                      <Button
                                        sx={{ p: 2 }}
                                        onClick={() => StatusFunction(info, false, 'arrived')}
                                      >
                                        {t('No')}
                                      </Button>
                                    </>
                                  )}
                                </>
                              </TableCell>
                            </>
                          )}
                          <TableCell>{renderOptions(info)}</TableCell>
                        </TableRow>
                        <Dialog
                          open={iddialog.value}
                          onClose={iddialog.onTrue}
                          lang="ar"
                          fullWidth
                          maxWidth="xs"
                        >
                          <DialogTitle>{t('Proof number')}</DialogTitle>
                          <DialogContent>
                            <Typography>
                              {t('Please enter the patient national number')}{' '}
                              <span style={{ color: 'red' }}>
                                {t('As entered in the proof document')}
                              </span>
                            </Typography>
                            <TextField
                              onChange={(e) => setAddingId(e.target.value)}
                              sx={{ width: '100%', mt: 2 }}
                              placeholder={curLangAr ? 'مثال: ٢٣٤٢****' : 'Ex: 2342****'}
                            />
                          </DialogContent>

                          <DialogActions>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                bgcolor: 'info.dark',
                              }}
                              onClick={() => {
                                iddialog.onFalse();
                                startAppointment(info);
                              }}
                            >
                              {t('add')}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                iddialog.onFalse();
                              }}
                            >
                              {t('cancel')}
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}
      </Container>
      <NewAppointmentDialog refetch={refetch} open={newDialog} close={() => setNewDialog(false)} />
    </>
  );
}
