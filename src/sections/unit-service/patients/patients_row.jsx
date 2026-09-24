import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Button, MenuItem } from '@mui/material';

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
  const { _id, file_code, patient, name_english, name_arabic } = row;

  // unit_service_patient carries a legacy scalar and an authoritative array; which one is
  // populated depends on how the patient was registered, so accept either.
  const work_group = row.work_group || row.work_groups?.[0] || null;
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const router = useRouter();
  const checkAcl = useAclGuard();
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useBoolean();
  const popover = usePopover();
  const clickHandler = () => {
    if (checkAcl('entrance:rooms')) {
      router.push(paths.employee.patients.info(_id));
    } else {
      enqueueSnackbar(t('permission denide'), { variant: 'warning' });
    }
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align="center">
        {patient?.nationality?.code ? String(patient?.nationality?.code).padStart(3, '0') : ''}-
        {patient?.sequence_number}
      </TableCell>
        <TableCell align="center">
          <Tooltip
            arrow
            placement="top"
            title={t("Click on the name to open the file and edit the patient's data")}
          >
            <Box
              onClick={clickHandler}
              sx={{
                cursor: 'pointer',
                color: '#3F54EB',
              }}
            >
              {name_english || patient?.name_english}
            </Box>
          </Tooltip>
        </TableCell>
       <TableCell align="center">
          <Tooltip
            arrow
            placement="top"
            title={t("Click on the name to open the file and edit the patient's data")}
          >
            <Box
              onClick={clickHandler}
              sx={{
                cursor: 'pointer',
                color: '#3F54EB',
              }}
            >
              {name_arabic || patient?.name_arabic}
            </Box>
          </Tooltip>
        </TableCell>
      <TableCell sx={{ cursor: 'pointer' }} onClick={clickHandler} align="center">
        {/* The group's colour is a swatch, not the text colour. Several palette slots sit below
            3:1 against the surface — fine for a shape read at a glance, not for a word someone
            has to read. The name carries identity; the dot only speeds up scanning. */}
        {work_group ? (
          <Stack direction="row" alignItems="center" justifyContent="center" gap={0.75}>
            <Box
              sx={{
                width: 10,
                height: 10,
                flexShrink: 0,
                borderRadius: '50%',
                bgcolor: row.color || 'transparent',
                border: (muiTheme) =>
                  row.color ? 'none' : `1px dashed ${muiTheme.palette.divider}`,
              }}
            />
            <Box component="span">
              {curLangAr ? work_group?.name_arabic : work_group?.name_english}
            </Box>
          </Stack>
        ) : (
          '-'
        )}
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
      {/* <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell> */}
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
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
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
