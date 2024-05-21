import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function CountriesTableRow({
  row,
  selected,
  onSelectRow,
  onShow,
}) {
  const {
    sequence_number,
    name_english,
    name_arabic,
    status,
  } = row;

  const { t } = useTranslate();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={onShow}
        align="center"
      >
        {sequence_number}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={onShow}
        align="center"
      >
        {curLangAr ? name_arabic : name_english}
      </TableCell>
      <TableCell align="center">
        <Label
          variant="soft"
          color={
            (status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'
          }
        >
          {t(status)}
        </Label>
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
    </>
  );
}

CountriesTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  onShow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
