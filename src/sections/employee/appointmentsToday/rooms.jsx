import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Box, Card, Button, Select, MenuItem, TextField, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import {
  useGetUSRooms,
  useGeEntrancePrescription,
  useGetOneEntranceManagement,
  useGetEntranceDoctorReports,
  useGetEntranceExaminationReports,
} from 'src/api';

const formatTextWithLineBreaks = (text) => {
  if (!text) return '';
  const words = text.split(' ');
  return words.reduce(
    (formattedText, word, index) => formattedText + word + ((index + 1) % 20 === 0 ? '<br />' : ' '),
    ''
  );
};

export default function Rooms() {
  const [noteContent, setNoteContent] = useState('');
  const [selectedValue] = useState('');
  const {t} = useTranslate()
  const { id } = useParams();
  const { Entrance, refetch } = useGetOneEntranceManagement(id, { populate: 'all' });
  const { user } = useAuthContext();
  const router = useRouter();
  const methods = useForm({
    mode: 'onTouched',
  });
  const { roomsData } = useGetUSRooms(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  const { medicalreportsdata } = useGetEntranceExaminationReports(id);
  const { doctorreportsdata } = useGetEntranceDoctorReports(id);
  const { prescriptionData } = useGeEntrancePrescription(id);

  const medicalReportIds = medicalreportsdata?.map((report) => report._id);
  const doctorReportIds = doctorreportsdata?.map((report) => report._id);
  const prescriptionIds = prescriptionData?.map((report) => report._id);

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
      console.log(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const handleEndAppointment = async () => {
    try {
      await axiosInstance.patch(`/api/entrance/${Entrance?._id}`, {
        Patient_attended: true,
        note: noteContent,
      });
      await axiosInstance.patch(`/api/appointments/${Entrance?.appointmentId}`, {
        finished_or_not: true,
      });
      await axiosInstance.post('/api/feedback', {
        unit_service: Entrance?.service_unit?._id,
        appointment: Entrance?.appointmentId,
        employee: user?.employee?._id,
        patient: Entrance?.patient?._id,
      });
      await axiosInstance.post(`/api/medrecord/`, {
        appointmentId: Entrance?.appointmentId,
        Appointment_date: Entrance?.Appointment_date,
        service_unit: Entrance?.service_unit,
        patient: Entrance?.patient?._id,
        medical_report: medicalReportIds,
        doctor_report: doctorReportIds,
        Drugs_report: prescriptionIds,
        // sick_leave: prescriptionIds,
      });

      // await axiosInstance.patch(`/api/rooms/${receptionActivity?._id}`, {
      //   patient: null,
      //   entranceMangament: null,
      // });
      enqueueSnackbar('appointment finished', { variant: 'success' });
      refetch();
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('something went wrong', { variant: 'error' });
    }
  };

  return (
    <Card sx={{ display: 'flex', gap: 15 }}>
      <Box sx={{ m: 2 }}>
        <Typography variant="h6">{t("Last activity")}</Typography>
        <Typography>{Entrance?.Last_activity_atended?.name_english}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t("Doctor Message")}
        </Typography>
        <Typography
          dangerouslySetInnerHTML={{ __html: formatTextWithLineBreaks(Entrance?.note || '') }}
        />
      </Box>

      <Box sx={{ m: 2 }}>
        <Typography variant="h6">{t("Next Activity")}</Typography>
        <Box sx={{ m: 2, display: 'grid', gridTemplateColumns: '1fr 1fr ' }}>
          <Box>
            <TextField
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder={t("Add Message")}
              fullWidth
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <Select
              sx={{
                width: 150,
                height: 35,
              }}
              value={selectedValue}
              displayEmpty
            >
              <MenuItem value="" disabled sx={{ display: 'none' }}>
                {t("Choose")}
              </MenuItem>
              {roomsData?.map((rooms, index) => (
                <MenuItem key={index}>
                  <Button
                    onClick={() => {
                      if (
                        Entrance?.Current_activity?.name_english !== rooms?.activities?.name_english
                      ) {
                        processingPage(rooms);
                      }
                    }}
                    variant="contained"
                    sx={{
                      bgcolor:
                        Entrance?.Current_activity?.name_english === rooms?.activities?.name_english
                          ? 'green'
                          : 'success.main',
                      m: 2,
                    }}
                    disabled={
                      Entrance?.Current_activity?.name_english === rooms?.activities?.name_english
                    }
                  >
                    {Entrance?.Current_activity?.name_english === rooms?.activities?.name_english
                      ? `${rooms?.name_english} (Current)`
                      : `Go to ${rooms?.name_english} Room`}
                  </Button>
                </MenuItem>
              ))}
            </Select>
            <Button
              onClick={() => handleEndAppointment()}
              variant="contained"
              sx={{ bgcolor: 'error.main', ml: 2 }}
            >
             {t("end appointment")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
