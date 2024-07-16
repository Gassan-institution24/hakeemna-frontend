import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Card, Button, TextField, IconButton, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
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
    sequence_number,
    name_english,
    name_arabic,
    nationality,
    birth_date,
    identification_num,
    email,
    mobile_num1,
    mobile_num2,
  } = row;

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const confirm = useBoolean();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align="center">
        <Box>
          {String(nationality.code).padStart(3, '0')}-{sequence_number}
        </Box>
      </TableCell>

      <TableCell align="center">{name_english}</TableCell>
      <TableCell align="center">{name_arabic}</TableCell>
      <TableCell align="center">{mobile_num1}</TableCell>
      <TableCell align="center">{mobile_num2}</TableCell>
      <TableCell align="center" sx={{ textTransform: 'none' }}>
        {email}
      </TableCell>
      <TableCell align="center">{identification_num}</TableCell>
      <TableCell align="center">
        {curLangAr ? nationality?.name_arabic : nationality?.name_english}
      </TableCell>
      <TableCell align="center">{birth_date}</TableCell>

      <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton onClick={confirm.onToggle}>
          <Iconify width="27px" color="info.main" icon="mdi:book-add" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('confirm checking information')}
        content={
          <>
            <Typography>
              {' '}
              {t(
                'Do you confirm checking patient data and check at least three values if they are true?'
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
          <Button variant="contained" color="info" onClick={() => {
            onEmploymentRow()
            confirm.onFalse()
            setNote('')
          }}>
            {t('confirm')}
          </Button >
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
