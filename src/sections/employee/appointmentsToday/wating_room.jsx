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
import { useGetUSRooms, useGetEntranceManagementByActivity } from 'src/api';

import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function WaitingRoom() { 
  const { t } = useTranslate();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const { user } = useAuthContext();
  const { roomsData } = useGetUSRooms(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );


  const receptionActivity = roomsData.find(
    (activity) => activity?.activities?.name_english === 'reception'
  );

  const [selectedTitle, setSelectedTitle] = useState(receptionActivity?.activities?._id);

  const { EntranceByActivity,refetch } = useGetEntranceManagementByActivity(
    selectedTitle,
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  const goToProcessingPage = async (entrance) => {
    try {
      await axiosInstance.patch(`/api/entrance/${entrance?._id}`, {
        Current_activity: entrance?.Next_activity?._id,
      });
      router.push(`${paths.unitservice.departments.processingPage}/${entrance?._id}`);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
    await axiosInstance.patch(`/api/rooms/${receptionActivity?._id}`, {
      patient: entrance?.patient?._id,
      entranceMangament: entrance?._id,
    });
  };
  const handleEndAppointment = async (entrance) => {
    try {
      await axiosInstance.patch(`/api/entrance/${entrance?._id}`, {
        Patient_attended: true,
      });
      await axiosInstance.patch(`/api/appointments/${entrance?.appointmentId}`, {
        finished_or_not: true,
      });
      await axiosInstance.post('/api/feedback', {
        unit_service: entrance?.service_unit?._id,
        appointment: entrance?.appointmentId,
        employee: user?.employee?._id,
        patient: entrance?.patient?._id,
      });
      await axiosInstance.post(`/api/medrecord/`, {
        appointmentId: entrance?.appointmentId,
        Appointment_date: entrance?.Appointment_date,
        service_unit: entrance?.service_unit,
        patient: entrance?.patient?._id,
      });
      await axiosInstance.patch(`/api/rooms/${receptionActivity?._id}`, {
        patient: null,
        entranceMangament: null,
      });
      enqueueSnackbar('appointment finished', { variant: 'success' });
      refetch()

    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('something went wrong', { variant: 'error' });
    }
  };

  return (
    <>
      {showAlert && (
        <Grow in={showAlert} timeout={600}>
          <Alert
            severity="info"
            variant="filled"
            sx={{ width: '70%', mb: 3, mt: 3 }}
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
                    // handleEndAppointment();
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
            {roomsData.map((activitiy, index) => (
              <MenuItem key={index} value={activitiy?.activities?._id}>
                {activitiy?.activities?.name_english}
              </MenuItem>
            ))}
          </Select>
          <Box>
            <TableContainer sx={{ mt: 3, mb: 2 }}>
              <Scrollbar>
                <Table sx={{ minWidth: 400 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Last activity</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Doctor Note</TableCell>
                      <TableCell>Options</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {EntranceByActivity?.map((entranceData, i) => (
                      <TableRow key={i}>
                        <TableCell>{entranceData?.Last_activity_atended?.name_english}</TableCell>

                        <TableCell>{entranceData?.patient?.name_english}</TableCell>
                        <TableCell>{entranceData?.note}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => goToProcessingPage(entranceData)}
                          >
                            Next
                          </Button>
                          <Button
                            onClick={() => handleEndAppointment(entranceData)}
                            variant="contained"
                            sx={{ bgcolor: 'error.main', ml: 2 }}
                          >
                            end appointment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          </Box>
        </Box>
      </Card>
    </>
  );
}
