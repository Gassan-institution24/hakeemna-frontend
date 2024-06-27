import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

// import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProductSearch({ query, filters, results, onSearch, hrefItem, loading }) {
  const { t } = useTranslate();

  return (
    <TextField
      sx={{ width: { xs: 1, sm: 260 } }}
      value={filters.name}
      onChange={onSearch}
      placeholder={t('Search name or number...')}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
    />
  );
}

ProductSearch.propTypes = {
  hrefItem: PropTypes.func,
  loading: PropTypes.bool,
  onSearch: PropTypes.func,
  query: PropTypes.string,
  filters: PropTypes.object,
  results: PropTypes.array,
};
