import PropTypes from 'prop-types';
import { useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';

export default function PhoneWithCountry({ countries = [], value = { number: '', country: null }, onChange, label }) {
  const [error, setError] = useState('');

  const handleCountryChange = (country) => {
    onChange({
      ...value,
      country,
    });
  };

  const handlePhoneChange = (val) => {
    // يسمح أرقام فقط
    const cleaned = val.replace(/\D/g, '');

    if (val && !/^\d*$/.test(val)) {
      setError('Only numbers allowed');
    } else {
      setError('');
    }

    onChange({
      ...value,
      number: cleaned,
    });
  };

  return (
    <Box display="flex" gap={1}>
      {/* 🌍 Country */}
      <TextField
        select
        fullWidth
        label="Country"
        value={value.country?._id || ''}
        onChange={(e) => {
          const selected = countries.find((c) => c._id === e.target.value) || null;
          handleCountryChange(selected);
        }}
        sx={{ maxWidth: 200 }}
      >
        <MenuItem value="">Select Country</MenuItem>
        {countries.map((c) => (
          <MenuItem key={c._id} value={c._id}>
            {c.name_english}
          </MenuItem>
        ))}
      </TextField>

      {/* 📞 Phone */}
      <TextField
        fullWidth
        label={label || 'Phone'}
        value={value.number || ''}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder="7XXXXXXXX"
        inputProps={{ inputMode: 'tel' }}
        error={!!error}
        helperText={error}
      />
    </Box>
  );
}

PhoneWithCountry.propTypes = {
  countries: PropTypes.array,
  value: PropTypes.shape({
    number: PropTypes.string,
    country: PropTypes.object,
  }),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};
