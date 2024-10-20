import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Button, MenuItem, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useLocales, useTranslate } from 'src/locales';
import { useAclGuard } from 'src/auth/guard/acl-guard';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function USPatientsTableRow({ row, selected, onDeleteRow }) {
  const { _id, file_code, work_group, patient, name_english, name_arabic } = row;

  const { t } = useTranslate();
  const checkAcl = useAclGuard();
  const { enqueueSnackbar } = useSnackbar()
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const router = useRouter();
  const confirm = useBoolean();
  const popover = usePopover();
  const clickHandler = () => {
    if (checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'rooms' })) {
      router.push(paths.employee.patients.info(_id))
    } else {
      enqueueSnackbar(t('permission denide'), { variant: 'error' })
    }
  }
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">
          {patient?.nationality?.code ? String(patient?.nationality?.code).padStart(3, '0') : ''}-
          {patient?.sequence_number}
        </TableCell>
        <TableCell
          sx={{
            cursor: 'pointer',
            color: '#3F54EB',
          }}
          onClick={clickHandler}
          align="center"
        >
          {name_english || patient?.name_english}
        </TableCell>
        <TableCell
          sx={{
            cursor: 'pointer',
            color: '#3F54EB',
          }}
          onClick={clickHandler}
          align="center"
        >
          {name_arabic || patient?.name_arabic}
        </TableCell>
        <TableCell
          sx={{
            cursor: 'pointer',
            color: '#3F54EB',
          }}
          onClick={clickHandler}
          align="center"
        >
          {curLangAr ? work_group?.name_arabic : work_group?.name_english}
        </TableCell>
        <TableCell
          sx={{
            cursor: 'pointer',
            color: '#3F54EB',
          }}
          onClick={clickHandler}
          align="center"
        >
          {file_code}
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem sx={{ color: 'error.main' }} lang="ar" onClick={confirm.onTrue}>
          <Iconify icon="mi:delete" />
          {t('delete')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete')}
        content={
          <>
            {t('are you sure want to delete')} {name_english} {name_arabic}?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            {t('delete')}
          </Button>
        }
      />
    </>
  );
}

USPatientsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onDeleteRow: PropTypes.func,
};
