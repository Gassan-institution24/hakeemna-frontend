import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { useLocales } from 'src/locales';
import { useState, useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { fTime } from 'src/utils/format-time';

export default function AppointmentCard({ appointment, t, handleConfirmArrival }) {
  const { currentLang } = useLocales();
  const isArabic = currentLang.value === 'ar';
  const [isArrived, setIsArrived] = useState(appointment.arrived);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsArrived(appointment.arrived);
  }, [appointment]);

  const handleConfirmArrivalClick = async () => {
    setIsLoading(true);
    try {
      await handleConfirmArrival(appointment);
      setIsArrived(true);
    } catch (error) {
      console.error('Error confirming arrival:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      sx={{ 
        width: '100%', 
        minHeight: { xs: 180, sm: 160, md: 140 },
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center', 
        p: { xs: 2, sm: 3 }, 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        alignItems={{ xs: 'stretch', md: 'center' }} 
        sx={{ 
          flex: 1, 
          width: '100%',
          gap: { xs: 2, md: 3 }
        }}
      >
        {/* Appointment Info Section */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          gap: 1.5
        }}>
          {/* Date and Time */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {fTime(appointment.start_time, 'p', true)}
            </Typography>
          </Box>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 1, sm: 3 }}
            sx={{ flexWrap: 'wrap' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                {t('department')}:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {isArabic ? appointment.work_group?.name_arabic : appointment.work_group?.name_english}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                {t('type')}:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {isArabic ? appointment.appointment_type?.name_arabic : appointment.appointment_type?.name_english}
              </Typography>
            </Box>
          </Stack>

          {/* Status Chip */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={t(appointment.status)} 
              color={getStatusColor(appointment.status)}
              size="small"
              sx={{ 
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            />
          </Box>

          {/* Notes if available */}
          {appointment.note && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontStyle: 'italic',
                backgroundColor: 'action.hover',
                p: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              📝 {appointment.note}
            </Typography>
          )}
        </Box>

        {/* Action Button Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: { xs: 'center', md: 'flex-end' },
          minWidth: { xs: '100%', md: 200 }
        }}>
          {isArrived ? (
            <Button 
              variant="contained" 
              color="success" 
              disabled
              startIcon={<CheckCircleIcon />}
              sx={{ 
                width: { xs: '100%', md: 200 },
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              {t('Arrival confirmed')}
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="success"
              onClick={handleConfirmArrivalClick}
              disabled={isLoading}
              sx={{ 
                width: { xs: '100%', md: 200 },
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
              }}
            >
              {isLoading ? t('Confirming...') : t('Confirm Arrival')}
            </Button>
          )}
        </Box>
      </Stack>
    </Card>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.object,
  t: PropTypes.func,
  handleConfirmArrival: PropTypes.func,
};