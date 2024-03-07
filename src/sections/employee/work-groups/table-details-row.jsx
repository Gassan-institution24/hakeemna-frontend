import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function TableDetailsRow({ row, selected, onView }) {
  const { code, name_english, name_arabic, employees } = row;

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={onView}
        lang="ar"
        align="center"
      >
        <Box>{code}</Box>
      </TableCell>

      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={onView}
        lang="ar"
        align="center"
      >
        {curLangAr ? name_arabic : name_english}
      </TableCell>
      <TableCell onClick={onView} lang="ar" align="center">
        {employees
          .map(
            (employee) =>
              `${employee.employee?.employee?.first_name} ${employee.employee?.employee?.family_name}`
          )
          .join(', ')}
      </TableCell>
      <TableCell lang="ar" align="center" />
    </TableRow>
  );

  return <>{renderPrimary}</>;
}

TableDetailsRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onView: PropTypes.func,
};
