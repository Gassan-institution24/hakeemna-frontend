import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';

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
import { fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUSRooms, useGetEntranceManagementByActivity } from 'src/api';

import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function WaitingRoom() {
  const { t } = useTranslate();
  const router = useRouter();

  const { user } = useAuthContext();
  const { roomsData } = useGetUSRooms(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const receptionActivity = roomsData.find(
    (activity) => activity?.activities?.name_english === 'Reception'
  );

  const [selectedTitle, setSelectedTitle] = useState(receptionActivity?.activities?._id);

  const { EntranceByActivity } = useGetEntranceManagementByActivity(
    selectedTitle,
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  console.log(EntranceByActivity,"EntranceByActivity");

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
  return (
  

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
                      <TableCell>{t('Last activity')}</TableCell>
                      <TableCell>{t('Patient')}</TableCell>
                      <TableCell>{t('Arrival Time')}</TableCell>
                      <TableCell>{t('Doctor Note')}</TableCell>
                      <TableCell>{t('Options')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {EntranceByActivity?.map((entranceData, i) => (
                      <TableRow key={i}>
                        <TableCell>{entranceData?.Last_activity_atended?.name_english}</TableCell>

                        <TableCell>{entranceData?.patient?.name_english}</TableCell>
                        <TableCell>{fTime(entranceData?.Arrival_time)}</TableCell>
                        <TableCell>{entranceData?.note}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            sx={{ bgcolor: 'success.main', color: 'white' }}
                            onClick={() => goToProcessingPage(entranceData)}
                          >
                            {t("Proceed")}
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
  
  );
}
