import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, TextField, Typography, Autocomplete } from '@mui/material';

// ----------------------------------------------------------------------

export default function RHFPhoneNumberCustom({ name, helperText }) {
  const { control, setValue } = useFormContext();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2,flags')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data
          .filter((c) => c.idd?.root)
          .map((c) => {
            const isUSA = c.cca2 === 'US';

            return {
              label: c.name.common,
              code: c.cca2,
              flag: c.flags?.svg,
              callingCode: isUSA ? '+1' : c.idd.root + (c.idd.suffixes?.[0] || ''),
            };
          })

          .sort((a, b) => a.label.localeCompare(b.label));

        setCountries(formatted);

        const jordan = formatted.find((c) => c.code === 'JO');
        if (jordan) {
          setSelectedCountry(jordan);
          setValue(name, jordan.callingCode, {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
          });
        }
      });
  }, [name, setValue]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box display="flex" gap={1}>
          {/* Country Selector */}
          <Autocomplete
            sx={{ width: 280 }}
            options={countries}
            value={selectedCountry}
            onChange={(e, newValue) => {
              setSelectedCountry(newValue);
              if (newValue) {
                field.onChange(newValue.callingCode);
              }
            }}
            autoHighlight
            getOptionLabel={(option) => `${option.label} (${option.callingCode})`}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <img
                  loading="lazy"
                  width="20"
                  src={option.flag}
                  alt=""
                  style={{ marginRight: 8 }}
                />
                <Typography variant="body2">
                  {option.label} ({option.callingCode})
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Country" placeholder="Search country" />
            )}
          />

          {/* Phone Input */}
          <TextField
            {...field}
            fullWidth
            dir="ltr"
            placeholder="7XXXXXXXX"
            InputProps={{
              startAdornment: selectedCountry?.flag ? (
                <Box
                  component="img"
                  src={selectedCountry.flag}
                  alt=""
                  sx={{
                    width: 20,
                    height: 14,
                    mr: 1,
                    borderRadius: '2px',
                    objectFit: 'cover',
                  }}
                />
              ) : null,
            }}
            error={!!error}
            helperText={error ? error.message : helperText}
            onChange={(e) => {
              const value = e.target.value.replace(/\s+/g, '');
              field.onChange(value);
            }}
          />
        </Box>
      )}
    />
  );
}

// ----------------------------------------------------------------------

RHFPhoneNumberCustom.propTypes = {
  name: PropTypes.string.isRequired,
  helperText: PropTypes.node,
};
