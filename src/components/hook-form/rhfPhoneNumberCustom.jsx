import PropTypes from 'prop-types';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Box,
  List,
  Button,
  Divider,
  Popover,
  TextField,
  InputBase,
  Typography,
  ListItemText,
  InputAdornment,
  ListItemButton,
} from '@mui/material';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState('');

  if (!currentValue && JORDAN) {
    setValue(name, JORDAN.callingCode, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
  }

  const filtered = COUNTRIES.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.callingCode.includes(search)
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Display only the local digits (strip the country code prefix)
        const displayValue = field.value?.startsWith(selectedCountry.callingCode)
          ? field.value.slice(selectedCountry.callingCode.length)
          : field.value || '';

        return (
          <>
            <TextField
              fullWidth
              label={label}
              dir="ltr"
              placeholder="7XXXXXXXX"
              inputProps={{ inputMode: 'tel' }}
              value={displayValue}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Button
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      disableRipple={false}
                      sx={{
                        minWidth: 'unset',
                        px: 1,
                        py: 0.5,
                        mr: 1,
                        gap: 0.5,
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '8px 0 0 8px',
                        color: 'text.primary',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      color="inherit"
                    >
                      <img
                        src={flagUrl(selectedCountry.code)}
                        alt={selectedCountry.code}
                        width={22}
                        style={{ borderRadius: 2, display: 'block' }}
                      />
                      <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1 }}>
                        {selectedCountry.callingCode}
                      </Typography>
                    </Button>
                  </InputAdornment>
                ),
              }}
              error={!!error}
              helperText={error ? error.message : helperText}
              onChange={(e) => {
                const local = e.target.value.replace(/\D/g, '');
                field.onChange(selectedCountry.callingCode + local);
              }}
            />

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => {
                setAnchorEl(null);
                setSearch('');
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              PaperProps={{ sx: { width: 280, borderRadius: 2, boxShadow: 4 } }}
            >
              <Box sx={{ p: 1 }}>
                <InputBase
                  autoFocus
                  fullWidth
                  placeholder={curLangAr ? 'ابحث عن دولة...' : 'Search country...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    fontSize: '0.875rem',
                  }}
                />
              </Box>
              <Divider />
              <List dense disablePadding sx={{ maxHeight: 260, overflowY: 'auto' }}>
                {filtered.map((country) => (
                  <ListItemButton
                    key={country.code}
                    selected={country.code === selectedCountry.code}
                    onClick={() => {
                      setSelectedCountry(country);
                      const digits = field.value?.replace(/^\+\d+/, '') || '';
                      field.onChange(country.callingCode + digits);
                      setAnchorEl(null);
                      setSearch('');
                    }}
                    sx={{ gap: 1.5, py: 0.75 }}
                  >
                    <img
                      src={flagUrl(country.code)}
                      alt={country.code}
                      width={22}
                      style={{ borderRadius: 2, flexShrink: 0 }}
                    />
                    <ListItemText
                      primary={country.label}
                      secondary={country.callingCode}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Popover>
          </>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

RHFPhoneNumberCustom.propTypes = {
  name: PropTypes.string.isRequired,
  helperText: PropTypes.node,
  label: PropTypes.string,
};
