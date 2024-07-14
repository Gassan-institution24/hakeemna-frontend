import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Button, Card, Typography, Box, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetOneEntranceManagement, useGetUSActivities, useGetUSRooms } from 'src/api';

// ----------------------------------------------------------------------

export default function Rooms({ data }) {
  const { t } = useTranslate();
  const [noteContent, setNoteContent] = useState();
  const { id } = useParams();
  const { Entrance } = useGetOneEntranceManagement(id);
  const { user } = useAuthContext();
  const router = useRouter();
  const methods = useForm({
    mode: 'onTouched',
  });
  const { roomsData } = useGetUSRooms(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  console.log(roomsData);

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
        entranceMangament: Entrance?._id
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
        {roomsData?.map((rooms) => (
          <Button
            onClick={() => processingPage(rooms)}
            variant="contained"
            // disabled
            sx={{ bgcolor: 'success.main', m: 1 }}
          >
            go to {rooms?.activities?.name_english} room
          </Button>
        ))}
        <TextField onChange={(e) => setNoteContent(e.target.value)} placeholder="Add commint" />
      </Box>
    </Card>
  );
}

Rooms.propTypes = {
  data: PropTypes.array,
};
