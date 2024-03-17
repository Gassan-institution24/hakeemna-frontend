import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useLocales } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function InsuranceRow({ row, onDeleteRow, setFilters, filters }) {
  const { code, name_english, name_arabic, type, webpage, phone, address } = row;

  // const { t } = useTranslate();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const renderPrimary = (
    <TableRow hover>
      <TableCell lang="ar" align="center">
        {code}
      </TableCell>
      <TableCell lang="ar" align="center">
        {curLangAr ? name_arabic : name_english}
      </TableCell>
      <TableCell
        align="center"
        onClick={() => setFilters({ ...filters, name: type?.name_english })}
      >
        {curLangAr ? type?.name_arabic : type?.name_english}
      </TableCell>
      {/* <TableCell lang="ar" align="center">
        <Label
          lang="ar"
          variant="soft"
          color={
            (status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'
          }
        >
          {t(status)}
        </Label>
      </TableCell> */}
      <TableCell lang="ar" align="center">
        {webpage}
      </TableCell>
      <TableCell lang="ar" align="center">
        {phone}
      </TableCell>
      <TableCell lang="ar" align="center">
        {address}
      </TableCell>
      <TableCell lang="ar" align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton sx={{ color: 'error.main' }} onClick={onDeleteRow}>
          <Iconify icon="mi:delete" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}

InsuranceRow.propTypes = {
  setFilters: PropTypes.func,
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  filters: PropTypes.object,
};
