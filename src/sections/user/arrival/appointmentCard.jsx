import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLocales } from 'src/locales';
import { useState, useEffect } from 'react';

export default function AppointmentCard({ appointment, t, handleConfirmArrival }) {
  const { currentLang } = useLocales();
  const isArabic = currentLang.value === 'ar';
  const [isArrived, setIsArrived] = useState(appointment.arrived);
  useEffect(() => {
    setIsArrived(appointment.arrived);
  }, [appointment]);
  return (
    <Card sx={{ width: '100%', height: 140, display: 'flex', flexDirection: 'row', alignItems: 'center', p: 3, boxShadow: 3 }}>
      <Stack direction="row" alignItems="center" sx={{ flex: 1, width: '100%' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <Stack direction="row" spacing={3} sx={{ mt: 1, mb: 2 }}>
            <Typography><b>{t('department')}:</b> {isArabic ? appointment.work_group?.name_arabic : appointment.work_group?.name_english}</Typography>
            <Typography><b>{t('appointment type')}:</b> {isArabic ? appointment.appointment_type?.name_arabic : appointment.appointment_type?.name_english}</Typography>
            <Typography><b>{t('status')}:</b> {t(appointment.status)}</Typography>
          </Stack>
        </Box>
        <Stack sx={{ flexGrow: 0, ml: 4, alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
          {isArrived ? (
            <Button variant="contained" color="success" sx={{ width: 220 }} disabled>
              {t('Arrival confirmed')}
            </Button>
          ) : (
            <Button variant="contained" color="success" sx={{ width: 220 }} onClick={() => handleConfirmArrival(appointment)}>
              {t('Confirm Arrival')}
            </Button>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.object,
  t: PropTypes.func,
  handleConfirmArrival: PropTypes.func,
};