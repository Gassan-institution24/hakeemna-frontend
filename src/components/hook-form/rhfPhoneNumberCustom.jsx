import PropTypes from 'prop-types';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, TextField, Typography, Autocomplete, InputAdornment } from '@mui/material';

import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

const flagUrl = (code) => `https://flagcdn.com/w20/${code.toLowerCase()}.png`;

const COUNTRIES = [
  { label: 'Afghanistan', code: 'AF', callingCode: '+93' },
  { label: 'Albania', code: 'AL', callingCode: '+355' },
  { label: 'Algeria', code: 'DZ', callingCode: '+213' },
  { label: 'Argentina', code: 'AR', callingCode: '+54' },
  { label: 'Australia', code: 'AU', callingCode: '+61' },
  { label: 'Austria', code: 'AT', callingCode: '+43' },
  { label: 'Bahrain', code: 'BH', callingCode: '+973' },
  { label: 'Bangladesh', code: 'BD', callingCode: '+880' },
  { label: 'Belgium', code: 'BE', callingCode: '+32' },
  { label: 'Brazil', code: 'BR', callingCode: '+55' },
  { label: 'Canada', code: 'CA', callingCode: '+1' },
  { label: 'China', code: 'CN', callingCode: '+86' },
  { label: 'Comoros', code: 'KM', callingCode: '+269' },
  { label: 'Czech Republic', code: 'CZ', callingCode: '+420' },
  { label: 'Denmark', code: 'DK', callingCode: '+45' },
  { label: 'Djibouti', code: 'DJ', callingCode: '+253' },
  { label: 'Egypt', code: 'EG', callingCode: '+20' },
  { label: 'Ethiopia', code: 'ET', callingCode: '+251' },
  { label: 'Finland', code: 'FI', callingCode: '+358' },
  { label: 'France', code: 'FR', callingCode: '+33' },
  { label: 'Germany', code: 'DE', callingCode: '+49' },
  { label: 'Ghana', code: 'GH', callingCode: '+233' },
  { label: 'Greece', code: 'GR', callingCode: '+30' },
  { label: 'India', code: 'IN', callingCode: '+91' },
  { label: 'Indonesia', code: 'ID', callingCode: '+62' },
  { label: 'Iran', code: 'IR', callingCode: '+98' },
  { label: 'Iraq', code: 'IQ', callingCode: '+964' },
  { label: 'Italy', code: 'IT', callingCode: '+39' },
  { label: 'Japan', code: 'JP', callingCode: '+81' },
  { label: 'Jordan', code: 'JO', callingCode: '+962' },
  { label: 'Kenya', code: 'KE', callingCode: '+254' },
  { label: 'Kuwait', code: 'KW', callingCode: '+965' },
  { label: 'Lebanon', code: 'LB', callingCode: '+961' },
  { label: 'Libya', code: 'LY', callingCode: '+218' },
  { label: 'Malaysia', code: 'MY', callingCode: '+60' },
  { label: 'Mauritania', code: 'MR', callingCode: '+222' },
  { label: 'Morocco', code: 'MA', callingCode: '+212' },
  { label: 'Netherlands', code: 'NL', callingCode: '+31' },
  { label: 'New Zealand', code: 'NZ', callingCode: '+64' },
  { label: 'Nigeria', code: 'NG', callingCode: '+234' },
  { label: 'Norway', code: 'NO', callingCode: '+47' },
  { label: 'Oman', code: 'OM', callingCode: '+968' },
  { label: 'Pakistan', code: 'PK', callingCode: '+92' },
  { label: 'Palestine', code: 'PS', callingCode: '+970' },
  { label: 'Philippines', code: 'PH', callingCode: '+63' },
  { label: 'Poland', code: 'PL', callingCode: '+48' },
  { label: 'Portugal', code: 'PT', callingCode: '+351' },
  { label: 'Qatar', code: 'QA', callingCode: '+974' },
  { label: 'Romania', code: 'RO', callingCode: '+40' },
  { label: 'Russia', code: 'RU', callingCode: '+7' },
  { label: 'Saudi Arabia', code: 'SA', callingCode: '+966' },
  { label: 'Senegal', code: 'SN', callingCode: '+221' },
  { label: 'Somalia', code: 'SO', callingCode: '+252' },
  { label: 'South Africa', code: 'ZA', callingCode: '+27' },
  { label: 'South Korea', code: 'KR', callingCode: '+82' },
  { label: 'Spain', code: 'ES', callingCode: '+34' },
  { label: 'Sudan', code: 'SD', callingCode: '+249' },
  { label: 'Sweden', code: 'SE', callingCode: '+46' },
  { label: 'Switzerland', code: 'CH', callingCode: '+41' },
  { label: 'Syria', code: 'SY', callingCode: '+963' },
  { label: 'Tunisia', code: 'TN', callingCode: '+216' },
  { label: 'Turkey', code: 'TR', callingCode: '+90' },
  { label: 'Uganda', code: 'UG', callingCode: '+256' },
  { label: 'Ukraine', code: 'UA', callingCode: '+380' },
  { label: 'United Arab Emirates', code: 'AE', callingCode: '+971' },
  { label: 'United Kingdom', code: 'GB', callingCode: '+44' },
  { label: 'United States', code: 'US', callingCode: '+1' },
  { label: 'Yemen', code: 'YE', callingCode: '+967' },
];

const JORDAN = COUNTRIES.find((c) => c.code === 'JO');

// ----------------------------------------------------------------------

export default function RHFPhoneNumberCustom({ name, helperText, label }) {
  const { control, setValue } = useFormContext();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const currentValue = control._formValues?.[name];
  const initialCountry =
    currentValue
      ? COUNTRIES.find((c) => currentValue.startsWith(c.callingCode)) || JORDAN
      : JORDAN;

  const [selectedCountry, setSelectedCountry] = useState(initialCountry);

  if (!currentValue && JORDAN) {
    setValue(name, JORDAN.callingCode, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box display="flex" gap={1}>
          {/* Country Selector */}
          <Autocomplete
            sx={{ width: 280, flexShrink: 0 }}
            options={COUNTRIES}
            value={selectedCountry}
            onChange={(e, newValue) => {
              if (newValue) {
                setSelectedCountry(newValue);
                const digits = field.value?.replace(/^\+\d+/, '') || '';
                field.onChange(newValue.callingCode + digits);
              }
            }}
            autoHighlight
            isOptionEqualToValue={(option, value) => option.code === value.code}
            getOptionLabel={(option) => `${option.label} (${option.callingCode})`}
            renderOption={(props, option) => (
              <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} {...props}>
                <img
                  loading="lazy"
                  width={20}
                  src={flagUrl(option.code)}
                  alt={option.code}
                  style={{ borderRadius: 2, objectFit: 'cover' }}
                />
                <Typography variant="body2">
                  {option.label} ({option.callingCode})
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={curLangAr ? 'مفتاح الدولة' : 'Key country'}
                placeholder={curLangAr ? 'ابحث عن دولة' : 'Search country'}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: selectedCountry ? (
                    <InputAdornment position="start" sx={{ ml: 0.5 }}>
                      <img
                        src={flagUrl(selectedCountry.code)}
                        alt={selectedCountry.code}
                        width={22}
                        style={{ borderRadius: 2, display: 'block' }}
                      />
                    </InputAdornment>
                  ) : (
                    params.InputProps?.startAdornment
                  ),
                }}
              />
            )}
          />

          {/* Phone Number Input */}
          <TextField
            {...field}
            fullWidth
            label={label}
            dir="ltr"
            placeholder="7XXXXXXXX"
            inputProps={{ inputMode: 'tel' }}
            InputProps={{
              startAdornment: selectedCountry ? (
                <InputAdornment position="start">
                  <img
                    src={flagUrl(selectedCountry.code)}
                    alt={selectedCountry.code}
                    width={22}
                    style={{ borderRadius: 2, display: 'block' }}
                  />
                </InputAdornment>
              ) : null,
            }}
            error={!!error}
            helperText={error ? error.message : helperText}
            onChange={(e) => {
              let { value } = e.target;
              value = value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
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
  label: PropTypes.string,
};
