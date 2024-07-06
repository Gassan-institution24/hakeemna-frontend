import PropTypes from 'prop-types';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';

import { useLocales } from 'src/locales';
import { useState } from 'react';

import Iconify from '../iconify';

// ----------------------------------------------------------------------

export function SelectWithSearch({
  name,
  native,
  maxHeight = 220,
  helperText,
  options,
  placeholder,
  PaperPropsSx,
  ...other
}) {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [search, setSearch] = useState('')

  return (
    <TextField
      select
      fullWidth
      // variant='filled'
      InputLabelProps={{
        style: { color: 'white' },
      }}
      SelectProps={{
        MenuProps: {
          autoFocus: false,
        },
        sx: { textTransform: 'capitalize', color: 'white' },
      }}
      {...other}
    >
      <MenuItem>
        <TextField
          size='small'
          sx={{ mx: 1 }}
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </MenuItem>
      {options
        ?.filter((one) =>
          one.name_arabic?.toLowerCase().includes(search?.toLowerCase()) ||
          one.name_english?.toLowerCase().includes(search?.toLowerCase())
        )
        ?.map((one, index) => (
          <MenuItem key={index} value={one?._id}>
            {curLangAr ? one?.name_arabic : one?.name_english}
          </MenuItem>
        ))}
    </TextField>
  );
}

SelectWithSearch.propTypes = {
  PaperPropsSx: PropTypes.object,
  options: PropTypes.node,
  helperText: PropTypes.object,
  maxHeight: PropTypes.number,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  native: PropTypes.bool,
};
