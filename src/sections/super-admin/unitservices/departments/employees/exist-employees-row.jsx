import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ExistEmployeesRow({ row, selected, onEmploymentRow }) {
  const {
    code,
    first_name,
    middle_name,
    family_name,
    identification_num,
    email,
    phone,
    birth_date,
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
        {fDate(birth_date)}
      </TableCell>

      <TableCell lang="ar" align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton onClick={onEmploymentRow}>
          <Iconify icon="zondicons:user-add" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}

ExistEmployeesRow.propTypes = {
  onEmploymentRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
