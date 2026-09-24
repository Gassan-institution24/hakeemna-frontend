import { useState } from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Table,
  Divider,
  TableRow,
  Collapse,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { fDate, fTime } from 'src/utils/format-time';
import { getWorkGroupColor } from 'src/utils/workgroup_colors';

import { useGetPatientEntrances } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

// The visit record — what actually happened each time this patient came in.
//
// This was the one part of the system the patient file could not reach: entrance_management held
// the arrival time, the room, the activity chain, transfers, notes and whether the visit was
// billed, and none of it was visible from the patient's own page. A file that stops short of the
// visits is not a file.
//
// A visit has far more fields than a row can hold, so the row carries what identifies the visit
// and the expander carries the rest. Nothing is summarised away — expanding shows everything
// recorded for that visit.

const localized = (doc, ar) => {
  if (!doc || typeof doc !== 'object') return '';
  return (ar ? doc.name_arabic || doc.name_english : doc.name_english || doc.name_arabic) || '';
};

/** Minutes between two instants, or null when either is missing. */
const durationMinutes = (from, to) => {
  if (!from || !to) return null;
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return ms > 0 ? Math.round(ms / 60000) : null;
};

function VisitRow({ visit, isDark, curLangAr, t }) {
  const [open, setOpen] = useState(false);

  const group = visit.work_group;
  const groupColor = getWorkGroupColor(group, isDark);
  const stayed = durationMinutes(visit.Arrival_time, visit.end_attended_Time);

  // Three states, not two: unrecorded is not the same as late.
  let arrivedOnTime = null;
  if (visit.Arrived_on_time !== undefined && visit.Arrived_on_time !== null) {
    arrivedOnTime = visit.Arrived_on_time ? t('yes') : t('no');
  }

  // Only the facts that were actually recorded. A visit with nothing beyond arrival should read
  // as a short visit, not as a grid of dashes.
  const details = [
    [t('Arrival time'), visit.Arrival_time && fTime(visit.Arrival_time)],
    [t('Process time'), visit.process_time && fTime(visit.process_time)],
    [t('end attended Time'), visit.end_attended_Time && fTime(visit.end_attended_Time)],
    [t('Time spent attention'), visit.Time_spent_attention],
    [t('Arrived on time'), arrivedOnTime],
    [t('Arrival sequence'), visit.Arrival_sequence],
    [t('Appointment sequence number'), visit.Appointment_sequence_number],
    [t('work shift'), localized(visit.work_shift, curLangAr)],
    [t('room'), localized(visit.rooms, curLangAr)],
    [t('Current activity'), localized(visit.Current_activity, curLangAr)],
    [t('Last activity atended'), localized(visit.Last_activity_atended, curLangAr)],
    [t('Next activity'), localized(visit.Next_activity, curLangAr)],
    [t('Number activities'), visit.Number_activities],
    [t('time avareg'), visit.time_avareg],
    [t('Is it Transfer'), visit.Is_it_Transfer ? t('yes') : null],
    [t('From US'), localized(visit.From_US, curLangAr)],
    [t('Transfer comment'), visit.Transfer_comment],
    [t('Transfer to hospital'), localized(visit.Transfer_to_hospital, curLangAr)],
    [t('Transfer to laboratory'), visit.Transfer_to_laboratory],
    [t('Transfer to doctor'), visit.Transfer_to_doctor],
    [t('patient note'), visit.patient_note],
    [t('note'), visit.note],
    [t('Drugs report status'), visit.Drugs_report_status],
    [t('medical report status'), visit.medical_report_status],
    [t('created by'), visit.user_creation?.email],
  ].filter(([, value]) => value !== null && value !== undefined && value !== '');

  const services = visit.Service_types || [];

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2">{fDate(visit.Appointment_date || visit.Arrival_time)}</Typography>
          {visit.Arrival_time && (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {fTime(visit.Arrival_time)}
            </Typography>
          )}
        </TableCell>

        <TableCell>
          {group ? (
            <Stack direction="row" alignItems="center" gap={0.75}>
              <Box
                sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: groupColor, flexShrink: 0 }}
              />
              <Box component="span">{localized(group, curLangAr)}</Box>
            </Stack>
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell>{localized(visit.rooms, curLangAr) || '-'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {stayed !== null ? `${stayed} ${t('minutes')}` : '-'}
        </TableCell>

        <TableCell>
          <Stack direction="row" gap={0.5} flexWrap="wrap" useFlexGap>
            <Label color={visit.Patient_attended ? 'success' : 'warning'} variant="soft">
              {visit.Patient_attended ? t('finished') : t('in progress')}
            </Label>
            {visit.invoiced && (
              <Label color="info" variant="soft">
                {t('invoiced')}
              </Label>
            )}
            {visit.Is_it_Transfer && (
              <Label color="secondary" variant="soft">
                {t('Is it Transfer')}
              </Label>
            )}
          </Stack>
        </TableCell>

        <TableCell align="right" sx={{ width: 48 }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            <Iconify icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ py: 0, borderBottom: open ? undefined : 'none' }} colSpan={6}>
          <Collapse in={open} unmountOnExit>
            <Box sx={{ py: 2 }}>
              {details.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gap: 1.5,
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                  }}
                >
                  {details.map(([label, value]) => (
                    <Box key={label}>
                      <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                        {label}
                      </Typography>
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {String(value)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {services.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 1 }}>
                    {t('services')}
                  </Typography>
                  <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap>
                    {services.map((service) => (
                      <Label key={service._id} variant="soft">
                        {localized(service, curLangAr)}
                      </Label>
                    ))}
                  </Stack>
                </>
              )}

              {details.length === 0 && services.length === 0 && (
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                  {t('no data')}
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

VisitRow.propTypes = {
  visit: PropTypes.object,
  isDark: PropTypes.bool,
  curLangAr: PropTypes.bool,
  t: PropTypes.func,
};

export default function PatientVisits({ patient }) {
  const theme = useTheme();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { visits, loading, empty } = useGetPatientEntrances(patient?._id);

  if (loading) {
    return (
      <Card sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (empty) {
    return (
      <Card>
        <EmptyContent
          title={t('no data')}
          description={t('This patient has no recorded visits in this unit service')}
          sx={{ py: 8 }}
        />
      </Card>
    );
  }

  return (
    <Card>
      <Stack sx={{ p: 2.5, pb: 1.5 }}>
        <Typography variant="h6">{t('Visits')}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`${visits.length} ${t('Visits')}`}
        </Typography>
      </Stack>

      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t('date')}</TableCell>
                <TableCell>{t('work group')}</TableCell>
                <TableCell>{t('room')}</TableCell>
                <TableCell>{t('Time spent attention')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {visits.map((visit) => (
                <VisitRow
                  key={visit._id}
                  visit={visit}
                  isDark={theme.palette.mode === 'dark'}
                  curLangAr={curLangAr}
                  t={t}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}

PatientVisits.propTypes = {
  patient: PropTypes.object,
};
