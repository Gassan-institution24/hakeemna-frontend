import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function OldPatientsRow({ row, selected, onEmploymentRow }) {
  const {
    code,
    first_name,
    middle_name,
    family_name,
    identification_num,
    email,
    phone,
    birth_date,
    files,
  } = row;

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell lang="ar" align="center">
        <Box>{code}</Box>
      </TableCell>

      <TableCell lang="ar" align="center">
        {first_name} {middle_name} {family_name}
      </TableCell>
      <TableCell lang="ar" align="center">
        {identification_num}
      </TableCell>
      <TableCell lang="ar" align="center">
        {email}
      </TableCell>
      <TableCell lang="ar" align="center">
        {phone}
      </TableCell>
      <TableCell lang="ar" align="center">
        {files?.length}
      </TableCell>

      {/* <TableCell lang="ar" align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton onClick={onEmploymentRow}>
          <Iconify icon="zondicons:user-add" />
        </IconButton>
      </TableCell> */}
    </TableRow>
  );

  return <>{renderPrimary}</>;
}

OldPatientsRow.propTypes = {
  onEmploymentRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
