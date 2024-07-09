import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Button, Card, Typography, Box, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetOneEntranceManagement, useGetUSActivities } from 'src/api';

// ----------------------------------------------------------------------

export default function Rooms() {
  const { t } = useTranslate();
  const [noteContent, setNoteContent] = useState();
  console.log(noteContent);
  const { id } = useParams();
  const { Entrance } = useGetOneEntranceManagement(id);
  const { user } = useAuthContext();
  const router = useRouter();
  const methods = useForm({
    mode: 'onTouched',
  });

  const { reset } = methods;
  const { activitiesData } = useGetUSActivities(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  useEffect(() => {
    reset({
      employee: user?.employee?._id,
      patient: Entrance?.patient?._id,
      service_unit: Entrance?.service_unit,
      unit_service: Entrance?.service_unit?._id,
      appointment: Entrance?.appointmentId,
    });
  }, [user, Entrance, reset]);
 
  const processingPage = async (activity) => {
    try {
      await axiosInstance.patch(`/api/entrance/${Entrance?._id}`, {
        Last_activity_atended: Entrance?.Next_activity,
        Next_activity: activity,
        note: noteContent,
      });
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  return (
    
    

      <Card sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Box sx={{ m: 2 }}>
          last activity <br />
          {Entrance?.Last_activity_atended?.name_english} <br />
          Dr message:
          <Typography>{Entrance?.note}</Typography>
        </Box>

        <Box sx={{ m: 2 }}>
          Next activity <br />
          {activitiesData?.map((activities) => (
            <Button
              onClick={() => processingPage(activities?._id)}
              variant="contained"
              // disabled
              sx={{ bgcolor: 'success.main', m: 1 }}
            >
              go to {activities?.name_english} room
            </Button>
          ))}
          <TextField onChange={(e) => setNoteContent(e.target.value)} placeholder='Add commint' />
          
        </Box>
      </Card>

  );
}
