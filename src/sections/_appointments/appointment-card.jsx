import PropTypes from 'prop-types';
import { isValid } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { getLocalizedName } from 'src/utils/get-localized-name';

import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import AppointmentStatusCell from './appointment-status-cell';

// ----------------------------------------------------------------------

// Mobile (below `md`) card equivalent of an appointments table row. Uses the
// same handlers the row uses so behaviour stays consistent; self-contained
// (no page-specific routing) so it can be shared across every appointments page.
export default function AppointmentCard({
  row,
  selected,
  onSelectRow,
  onDelayRow,
  onCancelRow,
  onUnCancelRow,
  onBookAppoint,
}) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const checkAcl = useAclGuard();

  const confirmDelayOne = useBoolean();

  const {
    appoint_number,
    unit_service,
    work_group,
    note,
    appointment_type,
    patient,
    unit_service_patient,
    start_time,
    status,
  } = row;

  const tz = unit_service?.country?.time_zone || 'Asia/Amman';
  const person = patient || unit_service_patient;
  const patientName = getLocalizedName(person, curLangAr);

  const time =
    isValid(new Date(start_time)) &&
    new Date(start_time).toLocaleTimeString(t('en-US'), { timeZone: tz, hour: '2-digit', minute: '2-digit' });
  const date =
    isValid(new Date(start_time)) && new Date(start_time).toLocaleDateString(t('en-US'), { timeZone: tz });

  let delayMin = 0;

  return (
    <Card sx={{ p: 2, boxShadow: (theme) => theme.customShadows?.z1 }}>
      <Stack direction="row" alignItems="flex-start" spacing={1}>
        <Checkbox checked={selected} onClick={onSelectRow} sx={{ mt: -1, ml: -1 }} />

        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle2">{time}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {date} · #{appoint_number}
              </Typography>
            </Box>
            <AppointmentStatusCell row={row} align="right" />
          </Stack>

          <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

          <Stack spacing={0.75}>
            {patientName && (
              <Row icon="solar:user-rounded-bold" label={patientName} />
            )}
            <Row
              icon="solar:stethoscope-bold"
              label={curLangAr ? appointment_type?.name_arabic : appointment_type?.name_english}
            />
            <Row
              icon="solar:users-group-rounded-bold"
              label={curLangAr ? work_group?.name_arabic : work_group?.name_english}
            />
            {note && <Row icon="solar:notes-bold" label={note} />}
          </Stack>

          <Stack direction="row" spacing={0.5} justifyContent="flex-end" sx={{ mt: 1.5 }}>
            {status === 'available' && checkAcl('appointments:update') && (
              <Tooltip title={t('book manually')}>
                <IconButton size="small" color="success" onClick={onBookAppoint}>
                  <Iconify icon="mdi:register" />
                </IconButton>
              </Tooltip>
            )}
            {status === 'available' && checkAcl('appointments:delete') && (
              <Tooltip title={t('cancel')}>
                <IconButton size="small" color="error" onClick={onCancelRow}>
                  <Iconify icon="mdi:bell-cancel" />
                </IconButton>
              </Tooltip>
            )}
            {status === 'canceled' && checkAcl('appointments:update') && (
              <Tooltip title={t('uncancel')}>
                <IconButton size="small" color="primary" onClick={onUnCancelRow}>
                  <Iconify icon="material-symbols-light:notifications-active-rounded" />
                </IconButton>
              </Tooltip>
            )}
            {checkAcl('appointments:update') &&
              !['finished', 'canceled', 'not booked'].includes(status) && (
                <Tooltip title={t('delay')}>
                  <IconButton size="small" color="info" onClick={confirmDelayOne.onTrue}>
                    <Iconify icon="mdi:timer-sync" />
                  </IconButton>
                </Tooltip>
              )}
          </Stack>
        </Box>
      </Stack>

      <ConfirmDialog
        open={confirmDelayOne.value}
        onClose={confirmDelayOne.onFalse}
        title={t('delay')}
        content={
          <TextField
            fullWidth
            type="number"
            size="small"
            sx={{ mt: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ fontSize: '0.8rem' }}>{t('min')}</Box>
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              delayMin = e.target.value;
            }}
            helperText={t('knowing that you can type a negative value to make it earlier')}
          />
        }
        action={
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              confirmDelayOne.onFalse();
              onDelayRow(row, delayMin);
            }}
          >
            {t('delay')}
          </Button>
        }
      />
    </Card>
  );
}

function Row({ icon, label }) {
  if (!label) return null;
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Iconify icon={icon} width={16} sx={{ color: 'text.disabled', flexShrink: 0 }} />
      <Typography variant="body2" noWrap>
        {label}
      </Typography>
    </Stack>
  );
}

Row.propTypes = { icon: PropTypes.string, label: PropTypes.node };

AppointmentCard.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onDelayRow: PropTypes.func,
  onCancelRow: PropTypes.func,
  onUnCancelRow: PropTypes.func,
  onBookAppoint: PropTypes.func,
};
