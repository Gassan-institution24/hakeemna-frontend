import PropTypes from 'prop-types';
import { isValid } from 'date-fns';

import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import useUSTypeGuard from 'src/auth/guard/USType-guard';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AppointmentsTableRow({ row, selected }) {
  const {
    _id,
    appoint_number,
    entrance,
    unit_service,
    work_group,
    medicalAnalysis,
    appointment_type,
    patient,
    unit_service_patient,
    start_time,
    status,
  } = row;

  const router = useRouter();

  const { t } = useTranslate();

  const { isMedLab } = useUSTypeGuard();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  let patientName;
  if (patient) {
    patientName = curLangAr ? patient?.name_arabic : patient?.name_english;
  } else if (unit_service_patient) {
    patientName = curLangAr
      ? unit_service_patient?.name_arabic
      : unit_service_patient?.name_english;
  }

  return (
    <TableRow hover selected={selected}>
      <TableCell align="center">
        <ListItemText
          primary={
            isValid(new Date(start_time)) &&
            new Date(start_time).toLocaleTimeString(t('en-US'), {
              timeZone: unit_service?.country?.time_zone || 'Asia/Amman',
              hour: '2-digit',
              minute: '2-digit',
            })
          }
          secondary={
            isValid(new Date(start_time)) &&
            new Date(start_time).toLocaleDateString(t('en-US'), {
              timeZone: unit_service?.country?.time_zone || 'Asia/Amman',
            })
          }
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell align="center">{appoint_number}</TableCell>
      <TableCell align="center">
        {curLangAr ? appointment_type?.name_arabic : appointment_type?.name_english}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={() => router.push(paths.employee.patients.info(unit_service_patient?._id))}
      >
        {patientName}
      </TableCell>
      {isMedLab && (
        <TableCell align="center">
          <Iconify
            icon={medicalAnalysis ? 'eva:checkmark-fill' : 'mingcute:close-line'}
            width={16}
          />
        </TableCell>
      )}
      <TableCell align="center">
        {curLangAr ? work_group?.name_arabic : work_group?.name_english}
      </TableCell>
      {/* <TableCell  align="center">
          {curLangAr ? work_shift?.name_arabic : work_shift?.name_english}
        </TableCell> */}

      <TableCell align="center">
        <Label
          variant="soft"
          color={
            (status === 'processing' && 'info') ||
            (status === 'arrived' && 'success') ||
            (status === 'late' && 'warning') ||
            (status === 'booked' && 'info') ||
            (status === 'finished' && 'success') ||
            (status === 'not arrived' && 'error') ||
            (status === 'canceled' && 'warning') ||
            (status === 'available' && 'secondary') ||
            (status === 'not booked' && 'secondary') ||
            'default'
          }
        >
          {t(status)}
        </Label>
      </TableCell>

      <TableCell align="center" sx={{ px: 1 }}>
        <Button
          variant="outlined"
          onClick={() =>
            router.push(
              `${paths.unitservice.accounting.economicmovements.add}?appointment=${_id}${
                entrance ? `&&entrance=${entrance}` : ''
              }`
            )
          }
        >
          {t('make an invoice')}
        </Button>
      </TableCell>
    </TableRow>
  );
}

AppointmentsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};
