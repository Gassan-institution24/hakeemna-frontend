import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { Select, MenuItem } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function TablePaginationCustom({
  dense,
  count,
  page,
  onChangeDense,
  rowsPerPage,
  setPage,
  rowsPerPageOptions = [5, 10, 25, 50],
  sx,
  ...other
}) {
  const { t } = useTranslate();
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        showFirstButton
        showLastButton
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        {...other}
        sx={{
          borderTopColor: 'transparent',
        }}
      />

      {onChangeDense && (
        <FormControlLabel
          label={t('dense')}
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: 'absolute',
            },
          }}
        />
      )}
      {setPage && <FormControlLabel
        label={t('page')}
        control={
          <Select
            value={page}
            onChange={(e) => setPage(e.target.value)}
            variant="filled"
            sx={{
              height: 0,
              width: 68,
              mr: 1,
              backgroundColor: 'white',
              '.MuiSelect-select': {
                paddingTop: 1,
                paddingBottom: 1,
                lineHeight: '40px',
              },
            }}
          >
            {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, index) => (
              <MenuItem value={index} key={index}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        }
        sx={{
          ml: 18,
          my: 2,
          top: 5,
          position: {
            sm: 'absolute',
          },
        }}
      />}
    </Box>
  );
}

TablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  page: PropTypes.number,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  setPage: PropTypes.func,
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
};
