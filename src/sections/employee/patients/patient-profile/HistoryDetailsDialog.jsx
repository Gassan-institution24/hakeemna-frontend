
import PropTypes from 'prop-types';
import React from 'react';


import {
  AccessTime,
  Assignment,
  CalendarToday,
  CheckCircle,
  EventBusy,
  Receipt,
  Schedule,
  Timeline,
} from '@mui/icons-material';


import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';


import { fDate, fDateTime } from 'src/utils/format-time';
import { useTranslate } from 'src/locales';


const statusConfig = {
  completed: { color: '#388e3c', bgColor: '#e8f5e9' },
  cancelled: { color: '#d32f2f', bgColor: '#ffebee' },
  attended: { color: '#1976d2', bgColor: '#e3f2fd' },
  scheduled: { color: '#ed6c02', bgColor: '#fff3e0' }
};

const getStatusStyles = (status) => statusConfig[status] || statusConfig.scheduled;

const getAppointmentStatus = (appointment) => {
  if (!appointment) return 'Scheduled';
  if (appointment.finished_or_not) return 'Completed';
  if (appointment.canceled) return 'Cancelled';
  if (appointment.emergency) return 'Emergency';
  return 'Scheduled';
};

const getAppointmentColor = (appointment) => {
  if (!appointment) return 'info';
  if (appointment.finished_or_not) return 'success';
  if (appointment.canceled) return 'error';
  if (appointment.emergency) return 'warning';
  return 'info';
};

const HistoryDetailsDialog = ({ open, onClose, data }) => {
  const { currentLang, t } = useTranslate();
  const curLangAr = currentLang?.value === 'ar';


  const getDisplayName = (entity) => {
    if (!entity) return '';
    if (curLangAr && entity.name_arabic) return entity.name_arabic;
    return entity.name_english || '';
  };

  if (!data) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Timeline sx={{ color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={600}>{t('Patient History Details')}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* General Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
              {t('General Information')}
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('Visit')}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>{data.visitLabel}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('Date & Time')}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>{fDateTime(data.created_at)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('Duration')}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {data.durationInHours ? `${data.durationInHours} ${t('hours')}` : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('Status')}
                  </Typography>
                  <Chip
                    label={data.visitStatus}
                    size="small"
                    sx={{
                      ...getStatusStyles(data.visitStatus),
                      fontWeight: 500
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Services & Documents */}
          {data.hasActiveServices && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
                  {t('Services & Documents')}
                </Typography>

                <Grid container spacing={2}>
                  {/* Prescriptions */}
                  {data.prescriptionId?.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Receipt color="warning" />
                          <Typography variant="subtitle1" fontWeight={600}>
                            {t('Prescriptions')} ({data.prescriptionId.length})
                          </Typography>
                        </Stack>
                        <List dense>
                          {data.prescriptionId.map((prescription, idx) => (
                            <ListItem key={idx} divider>
                              <ListItemIcon>
                                <Receipt color="warning" />
                              </ListItemIcon>
                              <ListItemText
                                primary={`${t('Prescription')} #${idx + 1}`}
                                secondary={prescription.created_at ?
                                  fDate(prescription.created_at) : t('Date not specified')}
                              />

                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  )}

                  {/* Medical Reports */}
                  {data.medicalReportId?.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Assignment color="info" />
                          <Typography variant="subtitle1" fontWeight={600}>
                            {t('Medical Reports')} ({data.medicalReportId.length})
                          </Typography>
                        </Stack>
                        <List dense>
                          {data.medicalReportId.map((report, idx) => (
                            <ListItem key={idx} divider>
                              <ListItemIcon>
                                <Assignment color="info" />
                              </ListItemIcon>
                              <ListItemText
                                primary={report.name || `${t('Report')} #${idx + 1}`}
                                secondary={report.created_at ?
                                  fDate(report.created_at) : t('Date not specified')}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  )}

                  {/* Sick Leaves */}
                  {data.sickLeavesId?.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <EventBusy color="error" />
                          <Typography variant="subtitle1" fontWeight={600}>
                            {t('Sick Leaves')} ({data.sickLeavesId.length})
                          </Typography>
                        </Stack>
                        <List dense>
                          {data.sickLeavesId.map((leave, idx) => (
                            <ListItem key={idx} divider>
                              <ListItemIcon>
                                <EventBusy color="error" />
                              </ListItemIcon>
                              <ListItemText
                                primary={`${t('Sick Leave')} #${idx + 1}`}
                                secondary={leave.Medical_sick_leave_start && leave.Medical_sick_leave_end ?
                                  `${fDate(leave.Medical_sick_leave_start)} - ${fDate(leave.Medical_sick_leave_end)}` :
                                  t('Dates not specified')}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  )}

                  {/* Appointments */}
                  {data.appointmentId && (
                    <Grid item xs={12} md={6}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <CalendarToday color="success" />
                          <Typography variant="subtitle1" fontWeight={600}>
                            {t('Appointment Details')}
                          </Typography>
                        </Stack>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary={t('Date & Time')}
                              secondary={data.appointmentId.start_time ?
                                fDateTime(data.appointmentId.start_time) : t('Not specified')}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary={t('Status')}
                              secondary={
                                <Chip
                                  label={getAppointmentStatus(data.appointmentId)}
                                  size="small"
                                  color={getAppointmentColor(data.appointmentId)}
                                  variant="outlined"
                                />
                              }
                            />
                          </ListItem>
                          {data.appointmentId.note && (
                            <ListItem>
                              <ListItemText
                                primary={t('Notes')}
                                secondary={data.appointmentId.note}
                              />
                            </ListItem>
                          )}
                        </List>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
            </>
          )}

          {/* Activities */}
          {data.activities?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
                {t('Activities')} ({data.activities.length})
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <List>
                  {data.activities.map((activity, idx) => (
                    <ListItem key={idx} divider>
                      <ListItemIcon>
                        <Timeline color={activity.end_time ? 'success' : 'disabled'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          curLangAr
                            ? activity.activity_id?.name_arabic
                            : activity.activity_id?.name_english || `${t('Activity')} ${idx + 1}`
                        }
                        secondary={
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 0.5 }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <AccessTime sx={{ fontSize: 14 }} />
                              <span>{t('Start')}: {fDateTime(activity.start_time)}</span>
                            </Stack>
                            {activity.end_time && (
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <CheckCircle sx={{ fontSize: 14 }} />
                                <span>{t('End')}: {fDateTime(activity.end_time)}</span>
                              </Stack>
                            )}
                            {activity.duration && (
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Schedule sx={{ fontSize: 14 }} />
                                <span>{t('Duration')}: {activity.duration} {t('min')}</span>
                              </Stack>
                            )}
                          </Stack>
                        }
                      />
                      {activity.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2, maxWidth: '30%' }}>
                          {t('Notes')}: {activity.notes}
                        </Typography>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600
          }}
        >
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

HistoryDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    visitStatus: PropTypes.string,
    visitLabel: PropTypes.string,
    created_at: PropTypes.string,
    durationInHours: PropTypes.number,
    hasActiveServices: PropTypes.bool,
    prescriptionId: PropTypes.arrayOf(
      PropTypes.shape({
        prescription_date: PropTypes.string,
        created_at: PropTypes.string,
      })
    ),
    medicalReportId: PropTypes.arrayOf(
      PropTypes.shape({
        report_date: PropTypes.string,
        created_at: PropTypes.string,
        name: PropTypes.string,
      })
    ),
    sickLeavesId: PropTypes.arrayOf(
      PropTypes.shape({
        Medical_sick_leave_start: PropTypes.string,
        Medical_sick_leave_end: PropTypes.string,
      })
    ),
    appointmentId: PropTypes.shape({
      start_time: PropTypes.string,
      finished_or_not: PropTypes.bool,
      canceled: PropTypes.bool,
      emergency: PropTypes.bool,
      note: PropTypes.string,
    }),
    activities: PropTypes.arrayOf(
      PropTypes.shape({
        activity_id: PropTypes.shape({
          name_arabic: PropTypes.string,
          name_english: PropTypes.string,
        }),
        start_time: PropTypes.string,
        end_time: PropTypes.string,
        duration: PropTypes.number,
        notes: PropTypes.string,
      })
    ),
  }),
};

HistoryDetailsDialog.defaultProps = {
  data: null,
};

export default HistoryDetailsDialog;