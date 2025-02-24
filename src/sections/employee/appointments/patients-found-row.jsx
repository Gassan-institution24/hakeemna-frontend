import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {
  Card,
  Stack,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fDateTime } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

export default function PatientFoundRow({
  row,
  note,
  setNote,
  selected,
  onEmploymentRow,
  SelectedAppointment,
}) {
  const {
    name_english,
    name_arabic,
    nationality,
    identification_num,
    mobile_num1,
    mobile_num2,
    sequence_number,
    birth_date,
  } = row;

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const confirm = useBoolean();
  const dialog = useBoolean();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align="center">{name_english}</TableCell>
      <TableCell align="center">{name_arabic}</TableCell>
      <TableCell align="center">{mobile_num1}</TableCell>
      <TableCell align="center">
        {curLangAr ? nationality?.name_arabic : nationality?.name_english}
      </TableCell>
      <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap', display: 'flex', gap: 1 }}>
        <Button variant="contained" color="primary" onClick={confirm.onToggle}>
          {t('Select this patient')}
        </Button>
        <Button onClick={dialog.onToggle}>{t('details')}</Button>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      <Dialog
        open={dialog.value}
        onClose={dialog.onFalse}
        fullWidth
        maxWidth="sm"
        sx={{ padding: 5 }}
      >
        <DialogTitle>{curLangAr ? name_arabic : name_english}</DialogTitle>
        <DialogContent>
          {nationality?.code && sequence_number && (
            <Stack direction="row" gap={2}>
              <Typography variant="subtitle2">{t('Code')}:</Typography>
              <Typography variant="body2">
                {' '}
                {nationality?.code ? String(nationality?.code).padStart(3, '0') : ''}-
                {sequence_number}
              </Typography>
            </Stack>
          )}
          {nationality && (
            <Stack direction="row" gap={2}>
              <Typography variant="subtitle2">{t('Nationality')}:</Typography>
              <Typography variant="body2">
                {curLangAr ? nationality?.name_arabic : nationality?.name_english}
              </Typography>
            </Stack>
          )}
          {identification_num && (
            <Stack direction="row" gap={2}>
              <Typography variant="subtitle2">{t('ID number')}:</Typography>
              <Typography variant="body2">{identification_num}</Typography>
            </Stack>
          )}
          {mobile_num1 && (
            <Stack direction="row" gap={2}>
              <Typography variant="subtitle2">{t('Phone number')}:</Typography>
              <Typography variant="body2">{mobile_num1}</Typography>
            </Stack>
          )}
          {mobile_num2 && (
            <Stack direction="row" gap={2}>
              <Typography variant="subtitle2">{t('Alternative phone number')}:</Typography>
              <Typography variant="body2">{mobile_num2}</Typography>
            </Stack>
          )}
          {birth_date && (
            <Stack direction="row" gap={2}>
              <Typography variant="subtitle2">{t('Birth date')}:</Typography>
              <Typography variant="body2">{fDate(birth_date)}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={dialog.onFalse} variant="contained" color="warning">
            {t('Close')}
          </Button>
          <Button onClick={confirm.onTrue} variant="contained" color="primary">
            {t('Book')}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('Patient identity confirmation:')}
        content={
          <>
            <Typography>
              {' '}
              {t(
                'By booking the appointment, you confirm that you have been checked patient data and there are at minimum three data that matches with next patient identity:'
              )}
            </Typography>
            <Card sx={{ p: 2, m: 2 }}>
              <Typography>
                {t('patient')} : {curLangAr ? name_arabic : name_english}
              </Typography>
              <Typography>
                {t('appoitment')} : {fDateTime(SelectedAppointment.start_time)}
              </Typography>
            </Card>
            <TextField
              multiline
              fullWidth
              label={t('note')}
              rows={2}
              sx={{ my: 2 }}
              onChange={(e) => setNote(e.target.value)}
              value={note}
            />
          </>
        }
        action={
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              onEmploymentRow();
              confirm.onFalse();
              setNote('');
            }}
          >
            {t('confirm')}
          </Button>
        }
      />
    </>
  );
}

PatientFoundRow.propTypes = {
  onEmploymentRow: PropTypes.func,
  row: PropTypes.object,
  SelectedAppointment: PropTypes.object,
  selected: PropTypes.bool,
  note: PropTypes.string,
  setNote: PropTypes.func,
};
