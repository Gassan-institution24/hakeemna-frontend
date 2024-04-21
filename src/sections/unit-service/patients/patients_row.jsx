import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function CountriesTableRow({ row, selected }) {
  const { _id, sequence_number, nationality, name_english, name_arabic } = row;

  const router = useRouter();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align="center">
        {String(nationality?.code).padStart(3, '0')}-{sequence_number}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={() => router.push(paths.unitservice.patients.info(_id))}
        align="center"
      >
        {name_english}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={() => router.push(paths.unitservice.patients.info(_id))}
        align="center"
      >
        {name_arabic}
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}

CountriesTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};
