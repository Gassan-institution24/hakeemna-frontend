import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function CustomersTableRow({ row, selected }) {
  const {  sequence_number, unit_service, patient, created_at } = row;

  const router = useRouter();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align="center">
        {sequence_number}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={() => router.push(`${paths.stakeholder.orders.root}?name=${unit_service.name_english}`)}
        align="center"
      >
        {unit_service?.name_english}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={() => router.push(`${paths.stakeholder.orders.root}?name=${patient.name_english}`)}
        align="center"
      >
        {patient?.name_english}
      </TableCell>
      <TableCell align="center">
        {fDate(new Date(created_at))}
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}

CustomersTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};
