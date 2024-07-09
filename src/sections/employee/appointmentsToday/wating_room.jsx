import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  Grow,
  Alert,
  Table,
  Button,
  Select,
  MenuItem,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUSRooms, useGetUSActivities, useGetEntranceManagementByActivity } from 'src/api';

import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function WaitingRoom() {
  const { t } = useTranslate();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);


  const { user } = useAuthContext();
  const { activitiesData } = useGetUSActivities(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  const waitingActivity = activitiesData.find((activity) => activity.name_english === 'waiting');
  const [selectedTitle, setSelectedTitle] = useState(waitingActivity?._id);
  const { EntranceByActivity } = useGetEntranceManagementByActivity(
    selectedTitle,
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  const { roomsData } = useGetUSRooms(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const goToProcessingPage = async (entrance) => {
    try {
      await axiosInstance.patch(`/api/entrance/${entrance?._id}`, {
        Last_activity_atended: entrance?.Next_activity?._id,
        Next_activity: null,
      });
      router.push(`${paths.unitservice.departments.processingPage}/${entrance?._id}`);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const handleEndAppointment = async () => {
    try {
      // await axiosInstance.patch(`/api/entrance/${entrance?._id}`, {
      //   Patient_attended: true,
      // });
      // await axiosInstance.patch(`/api/appointments/${entrance?.appointmentId}`, {
      //   finished_or_not: true,
      // });
      // await axiosInstance.post('/api/feedback', {
        // unit_service: Entrance?.service_unit?._id,
        // appointment: Entrance?.appointmentId,
        // employee: user?.employee?._id,
        // patient: Entrance?.patient?._id,
      // });
      // await axiosInstance.post(`/api/medrecord/`, {
        // appointmentId: entrance?.appointmentId,
        // Appointment_date: Entrance?.Appointment_date,
        // service_unit: Entrance?.service_unit?._id,
        // patient: Entrance?.patient?._id,
      // });
      enqueueSnackbar('appointment finished', { variant: 'success' });
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('no', { variant: 'error' });
    }
  };

  return (
    <>
      {showAlert && (
        <Grow in={showAlert} timeout={600}>
          <Alert
            severity="info"
            variant="filled"
            sx={{ width: '70%', mb:3, mt:3 }}
            action={
              <>
                <Button
                  color="inherit"
                  size="small"
                  variant="outlined"
                  sx={{
                    mr: 1,
                    border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.48)}`,
                  }}
                  onClick={() => setShowAlert(false)}
                >
                  {t('Cancel')}
                </Button>

                <Button
                  size="small"
                  color="info"
                  variant="contained"
                  sx={{
                    bgcolor: 'info.dark',
                  }}
                  onClick={() => {
                    setShowAlert(false);
                    handleEndAppointment();
                  }}
                >
                  {t('Confirm')}
                </Button>
              </>
            }
          >
            {t('By accepting you will end this appointment')}
          </Alert>
        </Grow>
      )}

      <Card sx={{ mt: 3 }}>
        <Box sx={{ m: 2 }}>
          <Typography variant="" sx={{ color: 'text.secondary', mr: 3 }}>
            {t('Select The activity you are working on today')}{' '}
          </Typography>
          <Select
            sx={{
              width: 150,
              height: 35,
            }}
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
          >
            {roomsData.map((type, index) => (
              <MenuItem key={index} value={type?.activities}>
                {type?.name_english}
              </MenuItem>
            ))}
          </Select>
          <Box>
            {EntranceByActivity?.map((entranceData, i) => (
              <TableContainer key={i} sx={{ mt: 3, mb: 2 }}>
                <Scrollbar>
                  <Table sx={{ minWidth: 400 }}>
                    <TableHead>
                      <TableRow>
                        {entranceData?.Last_activity_atended && (
                          <TableCell>Last activity</TableCell>
                        )}

                        <TableCell>Patient</TableCell>
                        <TableCell>Patient Note</TableCell>
                        <TableCell>Options</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {entranceData?.Last_activity_atended && (
                          <TableCell>{entranceData?.Last_activity_atended}</TableCell>
                        )}

                        <TableCell>{entranceData?.patient?.name_english}</TableCell>
                        <TableCell>{entranceData?.patient_note}</TableCell>
                        <TableCell>
                          {EntranceByActivity?.map((info) => (
                            <Button variant="outlined" onClick={() => goToProcessingPage(info)}>
                              Next
                            </Button>
                          ))}
                          <Button
                            onClick={() => setShowAlert(true)}
                            variant="contained"
                            sx={{ bgcolor: 'error.main',ml:2}}
                          >
                            end appointment
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            ))}
          </Box>
        </Box>
      </Card>
    </>
  );
}
