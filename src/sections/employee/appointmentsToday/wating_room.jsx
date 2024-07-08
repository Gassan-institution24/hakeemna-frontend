import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Box, Card, Button, Select, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUSRooms, useGetUSActivities, useGetEntranceManagementByActivity } from 'src/api';

// ----------------------------------------------------------------------

export default function WaitingRoom() {
  const { t } = useTranslate();
  const router = useRouter();

  const { user } = useAuthContext();
  const { id } = useParams();
  const { activitiesData } = useGetUSActivities(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  const waitingActivity = activitiesData.find((activity) => activity.name_english === 'waiting');
  const [selectedTitle, setSelectedTitle] = useState(waitingActivity?._id);
  const { EntranceByActivity } = useGetEntranceManagementByActivity(selectedTitle);
  const { roomsData } = useGetUSRooms(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );


  const goToProcessingPage = async (entrance) => {
    try {
      await axiosInstance.patch(`/api/entrance/${entrance}`, {
        Last_activity_atended: waitingActivity?._id,
        Next_activity:null
      });
      router.push(`${paths.unitservice.departments.processingPage}/${entrance}`);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  return (
    <Card sx={{ mt: 3 }}>
      <Box sx={{ m: 2 }}>
        <Typography variant="" sx={{ color: 'text.secondary', mr: 3 }}>
          {t('Select Room')}{' '}
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
          {EntranceByActivity?.map((info) => (
            <Button onClick={() => goToProcessingPage(info?._id)}>Next</Button>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
