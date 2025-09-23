
import PropTypes from 'prop-types';
import React, { useState } from 'react';


import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';


import {
  AccessTime,
  Assignment,
  CalendarToday,
  CheckCircle,
  EventBusy,
  ExpandLess,
  ExpandMore,
  Groups,
  LocalHospital,
  Receipt,
  Timeline,
} from '@mui/icons-material';


import { fDate, fDateTime } from 'src/utils/format-time';
import { useTranslate } from 'src/locales';


const recordTypeConfig = {
  sick_leave: {
    label: 'Sick Leave',
    icon: EventBusy,
    color: '#d32f2f',
    bgColor: '#ffebee'
  },
  medical_report: {
    label: 'Medical Report',
    icon: Assignment,
    color: '#1976d2',
    bgColor: '#e3f2fd'
  },
  prescription: {
    label: 'Prescription',
    icon: Receipt,
    color: '#ed6c02',
    bgColor: '#fff3e0'
  },
  appointment: {
    label: 'Appointment',
    icon: CalendarToday,
    color: '#388e3c',
    bgColor: '#e8f5e9'
  },
  general: {
    label: 'General Visit',
    icon: LocalHospital,
    color: '#7b1fa2',
    bgColor: '#f3e5f5'
  },
};


const HistoryCard = ({ record, onView }) => {
  const { currentLang, t } = useTranslate();
  const [expanded, setExpanded] = useState(false);
  const curLangAr = currentLang?.value === 'ar';

  const recordType = recordTypeConfig[record?.recordType] || recordTypeConfig?.general;
  const RecordIcon = recordType.icon;


  const statusConfig = {
    completed: { color: '#388e3c', bgColor: '#e8f5e9', label: t('Completed') },
    cancelled: { color: '#d32f2f', bgColor: '#ffebee', label: t('Cancelled') },
    attended: { color: '#1976d2', bgColor: '#e3f2fd', label: t('Attended') },
    scheduled: { color: '#ed6c02', bgColor: '#fff3e0', label: t('Scheduled') }
  };

  const visitStatus = statusConfig[record.visitStatus] || statusConfig.scheduled;

  return (
    <Card
      elevation={3}
      sx={{
        mb: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 6,
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardHeader
        avatar={
          <Badge
            badgeContent={record.servicesCount}
            color="primary"
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                height: 20,
                minWidth: 20,
                borderRadius: '10px'
              }
            }}
          >
            <Avatar
              sx={{
                bgcolor: recordType.color,
                width: 48,
                height: 48
              }}
            >
              <RecordIcon sx={{ fontSize: 24 }} />
            </Avatar>
          </Badge>
        }
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={visitStatus.label}
              size="small"
              sx={{
                bgcolor: visitStatus.bgColor,
                color: visitStatus.color,
                fontWeight: 500,
                height: 24
              }}
            />
            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
              sx={{
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>
        }
        title={
          <Typography variant="h6" component="span" fontWeight={600}>
            {record.visitLabel}
          </Typography>
        }
        subheader={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {fDate(record.created_at)}
              </Typography>
            </Stack>

            {record.durationInHours && (
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {record.durationInHours}h
                </Typography>
              </Stack>
            )}

            <Stack direction="row" spacing={1} alignItems="center">
              <Groups sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {curLangAr
                  ? record.work_group?.name_arabic
                  : record.work_group?.name_english}
              </Typography>
            </Stack>
          </Stack>
        }
        sx={{
          pb: 1
        }}
      />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                {t('Service Unit')}
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                <Typography variant="body2">
                  {curLangAr
                    ? record.service_unit?.name_arabic
                    : record.service_unit?.name_english}
                </Typography>
              </Paper>
            </Grid>

            {record.activitySummary?.total_activities > 0 && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                  {t('Activities Progress')}
                </Typography>
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">
                      {record.activitySummary.completed_activities}/{record.activitySummary?.total_activities} {t('completed')}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(record.activitySummary.completed_activities / record.activitySummary.total_activities) * 100}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                  </Stack>
                  {record.activitySummary.ongoing_activities > 0 && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                      {record.activitySummary.ongoing_activities} {t('ongoing activities')}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}

            {/* Enhanced Services Summary */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                {t('Services & Documents')}
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {record.servicesSummary?.hasAppointment && (
                    <Chip
                      icon={<CalendarToday />}
                      label={`${t('Appointment')}${record.servicesSummary.isEmergency ? ` (${t('Emergency')})` : ''}`}
                      size="small"
                      variant="filled"
                      color={record.servicesSummary.isEmergency ? "error" : "success"}
                      sx={{ mb: 0.5 }}
                    />
                  )}
                  {record.servicesSummary?.medicalReports > 0 && (
                    <Chip
                      icon={<Assignment />}
                      label={`${record.servicesSummary?.medicalReports} ${t('Report')}${record.servicesSummary?.medicalReports > 1 ? 's' : ''}`}
                      size="small"
                      variant="filled"
                      color="info"
                      sx={{ mb: 0.5 }}
                    />
                  )}
                  {record.servicesSummary?.prescriptions > 0 && (
                    <Chip
                      icon={<Receipt />}
                      label={`${record.servicesSummary?.prescriptions} ${t('Prescription')}${record.servicesSummary?.prescriptions > 1 ? 's' : ''}`}
                      size="small"
                      variant="filled"
                      color="warning"
                      sx={{ mb: 0.5 }}
                    />
                  )}
                  {record.servicesSummary?.sickLeaves > 0 && (
                    <Chip
                      icon={<EventBusy />}
                      label={`${record.servicesSummary?.sickLeaves} ${t('Sick Leave')}${record.servicesSummary?.sickLeaves > 1 ? 's' : ''}`}
                      size="small"
                      variant="filled"
                      color="error"
                      sx={{ mb: 0.5 }}
                    />
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Visit timing info */}
            {record.entrance && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                  {t('Visit Timeline')}
                </Typography>
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ fontSize: '0.875rem' }}>
                    {record.entrance.Arrival_time && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {t('Arrived')}: {fDateTime(record.entrance.Arrival_time)}
                        </Typography>
                      </Stack>
                    )}
                    {record.entrance.end_attended_Time && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircle sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {t('Ended')}: {fDateTime(record.entrance.end_attended_Time)}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            )}
          </Grid>

          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button
              variant="contained"
              onClick={() => onView(record)}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none'
              }}
              endIcon={<Timeline />}
            >
              {t('View Details')}
            </Button>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

HistoryCard.propTypes = {
  record: PropTypes.shape({
    recordType: PropTypes.string,
    visitStatus: PropTypes.string,
    visitLabel: PropTypes.string,
    created_at: PropTypes.string,
    durationInHours: PropTypes.number,
    servicesCount: PropTypes.number,
    work_group: PropTypes.shape({
      name_arabic: PropTypes.string,
      name_english: PropTypes.string,
    }),
    service_unit: PropTypes.shape({
      name_arabic: PropTypes.string,
      name_english: PropTypes.string,
    }),
    activitySummary: PropTypes.shape({
      total_activities: PropTypes.number,
      completed_activities: PropTypes.number,
      ongoing_activities: PropTypes.number,
    }),
    servicesSummary: PropTypes.shape({
      hasAppointment: PropTypes.bool,
      isEmergency: PropTypes.bool,
      medicalReports: PropTypes.number,
      prescriptions: PropTypes.number,
      sickLeaves: PropTypes.number,
    }),
    entrance: PropTypes.shape({
      Arrival_time: PropTypes.string,
      end_attended_Time: PropTypes.string,
    }),
  }).isRequired,
  onView: PropTypes.func.isRequired,
};

export default HistoryCard;