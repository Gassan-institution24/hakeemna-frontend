import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Box, Card, Button, TextField, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

// import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUSRooms, useGetOneEntranceManagement } from 'src/api';

// ----------------------------------------------------------------------

export default function Rooms() {
  // const { t } = useTranslate();
  const [noteContent, setNoteContent] = useState('');
  const { id } = useParams();
  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });
  const { user } = useAuthContext();
  const router = useRouter();
  const methods = useForm({
    mode: 'onTouched',
  });
  const { roomsData } = useGetUSRooms(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const { reset } = methods;

  useEffect(() => {
    reset({
      employee: user?.employee?._id,
      patient: Entrance?.patient?._id,
      service_unit: Entrance?.service_unit,
      unit_service: Entrance?.service_unit?._id,
      appointment: Entrance?.appointmentId,
    });
  }, [user, Entrance, reset]);

  const processingPage = async (rooms) => {
    // has the rooms data
    try {
      await axiosInstance.patch(`/api/entrance/${Entrance?._id}`, {
        Last_activity_atended: Entrance?.Next_activity,
        Next_activity: rooms?.activities?._id,
        note: noteContent,
        rooms: rooms?._id,
      });
      await axiosInstance.patch(`/api/rooms/${rooms?._id}`, {
        patient: null,
        entranceMangament: null,
      });
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };
  return (
    <Card sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, p: 2 }}>
      <Box sx={{ m: 2 }}>
        <Typography variant="h6">Last Activity</Typography>
        <Typography>{Entrance?.Last_activity_atended?.name_english}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Doctor Message
        </Typography>
        <Typography>{Entrance?.note}</Typography>
      </Box>

      <Box sx={{ m: 2 }}>
        <Typography variant="h6">Next Activity</Typography>
        {roomsData?.map((rooms, index) => {
          const isSameActivity =
            Entrance?.Current_activity?.name_english === rooms?.activities?.name_english;
          return (
            <Button
              key={index}
              onClick={() => !isSameActivity && processingPage(rooms)}
              variant="contained"
              sx={{ bgcolor: isSameActivity ? 'green' : 'success.main', m: 1 }}
              disabled={isSameActivity}
              // disabled={isSameActivity || rooms?.patient === null}
            >
              {isSameActivity
                ? `${rooms?.activities?.name_english} (Current)`
                : `Go to ${rooms?.activities?.name_english} Room`}
            </Button>
          );
        })}
        <TextField
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Add comment"
          fullWidth
          multiline
          rows={4}
          sx={{ mt: 2 }}
        />
      </Box>
    </Card>
  );
}
