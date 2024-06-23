import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Link, Stack, Avatar } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function AppointmentsTableRow({
  row,
  selected,
  onSelectRow,
  refetch,
  onViewRow,
  onBookAppoint,
  onDelayRow,
  onCancelRow,
  onUnCancelRow,
  onDeleteRow,
}) {
  const {
    _id,
    code,
    name_english,
    name_arabic,
    description_english,
    description_arabic,
    stakeholder,
    image,
    products,
  } = row;

  const router = useRouter();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  return (
    <TableRow hover selected={selected}>
      <TableCell align="center">{code}</TableCell>
      <TableCell align="center">
        <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
          <Avatar
            alt={curLangAr ? name_arabic : name_english}
            src={image}
            variant="rounded"
            sx={{ width: 64, height: 64, mr: 2 }}
          />

          <ListItemText
            disableTypography
            primary={
              <Link
                noWrap
                color="inherit"
                variant="subtitle2"
                onClick={() => router.push(paths.dashboard.user.products.offer(_id))}
                sx={{ cursor: 'pointer' }}
              >
                {curLangAr ? name_arabic : name_english}
              </Link>
            }
            secondary={
              <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
                {curLangAr ? description_arabic : description_english}
              </Box>
            }
            sx={{ display: 'flex', flexDirection: 'column' }}
          />
        </Stack>
      </TableCell>
      <TableCell align="center">
        {curLangAr ? stakeholder.name_arabic : stakeholder.name_english}
      </TableCell>
      <TableCell align="center">
        {products.length}
      </TableCell>
    </TableRow>
  );
}

AppointmentsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onCancelRow: PropTypes.func,
  onUnCancelRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onBookAppoint: PropTypes.func,
  onViewRow: PropTypes.func,
  onDelayRow: PropTypes.func,
  refetch: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
