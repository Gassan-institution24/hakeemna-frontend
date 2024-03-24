import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ExistPatientRow({ row, selected, onEmploymentRow }) {
  const {  identification_num, phone, first_name } = row;

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell lang="ar" align="center">
        {first_name}
      </TableCell>
      <TableCell lang="ar" align="center">
        {identification_num}
      </TableCell>

      <TableCell lang="ar" align="center">
        {phone}
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

ExistPatientRow.propTypes = {
  onEmploymentRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
