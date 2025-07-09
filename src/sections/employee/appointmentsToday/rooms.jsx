import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import {
  Box,
  Card,
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
import { useFDateTimeUnit } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetRoom,
  useGetUSRooms,
  useGetEmployeeRooms,
  useGetEntranceManagementByActivity,
} from 'src/api';

import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function WaitingRoom() {
  const { fTimeUnit} = useFDateTimeUnit();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const router = useRouter();

  const { user } = useAuthContext();
  const { roomsData } = useGetUSRooms(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  const { employeeRoomsData } = useGetEmployeeRooms(user.employee._id);

  const receptionActivity = roomsData.find(
    (activity) => activity?.activities?.name_english === 'Reception'
  );

  const [selectedTitle, setSelectedTitle] = useState();
  const { data } = useGetRoom(selectedTitle);
  const { EntranceByActivity } = useGetEntranceManagementByActivity(
    data?.activities,
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  useEffect(() => {
    setSelectedTitle(employeeRoomsData?._id);
  }, [employeeRoomsData]);

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
  };
  const updateRoom = async (roomId) => {
    try {
      const { data: allRooms } = await axiosInstance.get(
        `/api/rooms/unitservice/${
          user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
            ?._id
        }`
      );

      // Find the current room where the employee is assigned
      const currentRoom = allRooms.find((room) =>
        room.employee?.some((emp) => emp._id === user?.employee?._id)
      );

      // Remove the employee from the current room
      if (currentRoom) {
        await axiosInstance.patch(`/api/rooms/${currentRoom?._id}`, {
          employee: currentRoom.employee.filter((emp) => emp._id !== user?.employee?._id),
        });
      }

      // Get the employees of the target room
      const targetRoom = allRooms.find((one) => one._id === roomId);
      const nextRoomEmployees = targetRoom ? targetRoom.employee : [];

      // Check if the employee is already in the target room
      const isEmployeeInTargetRoom = nextRoomEmployees.some(
        (emp) => emp._id === user?.employee?._id
      );

      // If not already in the target room, add the employee
      if (!isEmployeeInTargetRoom) {
        await axiosInstance.patch(`/api/rooms/${roomId}`, {
          employee: [...nextRoomEmployees, user?.employee?._id],
        });

        enqueueSnackbar('Room updated successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Employee is already in the selected room', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error updating room:', error.message);
      enqueueSnackbar('Error updating room', { variant: 'error' });
    }
  };

  return (
    <Card sx={{ mt: 3 }}>
      <Box sx={{ m: 2 }}>
        <Typography variant="" sx={{ color: 'text.secondary', mr: 3 }}>
          {t('Select The room you are working in today')}{' '}
        </Typography>
        <Select
          sx={{
            width: 150,
            height: 35,
          }}
          value={selectedTitle || ''} // Ensure value is not null or undefined
          displayEmpty
          onChange={(e) => {
            const selectedRoomId = e.target.value;
            setSelectedTitle(selectedRoomId);
            updateRoom(selectedRoomId); // Update the room based on selection
          }}
        >
          <MenuItem disabled value="" sx={{ display: 'none' }}>
            {t('Select Room')}
          </MenuItem>
          {roomsData.map((activity, index) => {
            const roomName = curLangAr ? activity?.name_arabic : activity?.name_english;
            return (
              activity?.activities?.name_english !==
                receptionActivity?.activities?.name_english && (
                <MenuItem key={index} value={activity?._id}>
                  {roomName}
                </MenuItem>
              )
            );
          })}
        </Select>

        <Box>
          <TableContainer sx={{ mt: 3, mb: 2 }}>
            <Scrollbar>
              <Table sx={{ minWidth: 400 }}>
                <TableHead>
                  <TableRow>
                    {EntranceByActivity?.[0]?.Last_activity_atended && (
                      <TableCell>{t('Last activity')}</TableCell>
                    )}

                    <TableCell>{t('Patient')}</TableCell>
                    <TableCell>{t('Arrival Time')}</TableCell>
                    <TableCell>{t('Doctor Note')}</TableCell>
                    <TableCell>{t('Options')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {EntranceByActivity?.map((entranceData, i) => {
                    let patientName;
                    if (entranceData.patient) {
                      patientName = curLangAr
                        ? entranceData?.patient?.name_arabic
                        : entranceData?.patient?.name_english;
                    } else if (entranceData.unit_service_patient) {
                      patientName = curLangAr
                        ? entranceData?.unit_service_patient?.name_arabic
                        : entranceData?.unit_service_patient?.name_english;
                    }
                    return (
                      <TableRow key={i}>
                        {entranceData?.Last_activity_atended?.name_english && (
                          <TableCell>{entranceData?.Last_activity_atended?.name_english}</TableCell>
                        )}

                        <TableCell>{patientName}</TableCell>
                        <TableCell>{fTimeUnit(entranceData?.Arrival_time, 'p', true)}</TableCell>
                        <TableCell>{entranceData?.note}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            sx={{ bgcolor: 'success.main', color: 'white' }}
                            onClick={() => goToProcessingPage(entranceData)}
                          >
                            {t('Proceed')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Box>
      </Box>
    </Card>
  );
}
