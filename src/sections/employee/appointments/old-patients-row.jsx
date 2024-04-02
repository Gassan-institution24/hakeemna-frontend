import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export default function OldPatientsRow({ row, selected, onEmploymentRow }) {
  const { code, first_name, middle_name, family_name, identification_num, email, phone, files } =
    row;

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align="center">
        <Box>{code}</Box>
      </TableCell>

      <TableCell align="center">
        {first_name} {middle_name} {family_name}
      </TableCell>
      <TableCell align="center">{identification_num}</TableCell>
      <TableCell align="center">{email}</TableCell>
      <TableCell align="center">{phone}</TableCell>
      <TableCell align="center">{files?.length}</TableCell>

      {/* <TableCell  align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
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
