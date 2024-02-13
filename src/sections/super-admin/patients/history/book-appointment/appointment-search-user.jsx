import PropTypes from 'prop-types';

import { useState } from 'react';

import { useRouter } from 'src/routes/hooks';

import { Input, InputAdornment } from '@mui/material';

import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

export default function AppointmentSearch({ query, results, onSearch, hrefItem }) {
  const router = useRouter();

  const [value, setValue] = useState('');
  console.log(value);
  return (
    <Input
      sx={{
        border: 1,
        borderRadius: '8px',
        borderColor: 'grey.400',
        padding: '7px',
        '&::placeholder': {
          color: 'red', 
        },
      }}
      placeholder="Search..."
      startAdornment={
        <InputAdornment position="start">
          <Iconify icon="iconamoon:search" sx={{ color: 'text.disabled' }} />
        </InputAdornment>
      }
      value={value}
      onChange={(e) => setValue(e.target.value)}
      disableUnderline
    />
  );
}

AppointmentSearch.propTypes = {
  hrefItem: PropTypes.func,
  onSearch: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array,
};
