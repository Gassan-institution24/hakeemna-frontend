import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Stack, TextField, Autocomplete } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useLocales, useTranslate } from 'src/locales';
import {
  useGetKeywords,
  useGetCountries,
  useGetEmployees,
  useGetSpecialties,
  useGetActiveUSTypes,
  useGetCountryCities,
  useGetActiveInsuranceCos,
} from 'src/api';

// import { SelectWithSearch } from 'src/components/input-components/select-with-search';
// import Iconify from 'src/components/iconify';
import { useDebounce } from 'src/hooks/use-debounce';

export default function BookToolbar({ filters, filterChange }) {
  const { country } = filters;
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [search, setSearch] = useState({
    country: '',
    city: '',
    insurance: '',
    usType: '',
    name: '',
  });

  const changeSearch = (name, value) => {
    setSearch({ ...search, [name]: value });
  };

  // const countrySearch = useDebounce(search.country)
  // const citySearch = useDebounce(search.city)
  // const insuranceSearch = useDebounce(search.insurance)
  const usTypeSearch = useDebounce(search.usType);
  const nameSearch = useDebounce(search.name);

  const { unitserviceTypesData } = useGetActiveUSTypes({
    select: '_id name_arabic name_english',
    name: usTypeSearch,
    rowPerPage: 10,
  });
  const { keywordsData } = useGetKeywords({ name: nameSearch });
  const { specialtiesData } = useGetSpecialties({ select: '_id name_arabic name_english' });
  const { countriesData } = useGetCountries({ select: '_id name_arabic name_english' });
  const { tableData } = useGetCountryCities(country, { select: '_id name_arabic name_english' });
  const { insuranseCosData } = useGetActiveInsuranceCos({ select: '_id name_arabic name_english' });
  const { employeesData } = useGetEmployees({
    select: '_id name_arabic name_english',
    name: nameSearch,
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ffffff',
      },
      // background: {
      //     paper: '#ffffff',
      //     default: '#ffffff',
      // },
      text: {
        primary: '#ffffff',
        secondary: '#ffffff',
      },
    },
  });

  return (
    <Stack
      direction={{ md: 'row' }}
      justifyContent="space-around"
      alignItems="center"
      gap={3}
      px={5}
      py={3}
      bgcolor="primary.darker"
      sx={{ backgroundColor: 'primary.darker' }}
      color="white"
      position={{ md: 'sticky' }}
      top={112}
      zIndex={3}
    >
      <ThemeProvider theme={darkTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Autocomplete
            size="small"
            sx={{ minWidth: 200, flex: 1 }}
            options={unitserviceTypesData}
            onChange={(event, newValue) => filterChange('US_type', newValue?._id)}
            getOptionLabel={(option) => (curLangAr ? option?.name_arabic : option?.name_english)}
            onInputChange={(event, newInputValue) => {
              setSearch(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label={t('unit of service type')} variant="outlined" />
            )}
          />
          {/* <SelectWithSearch
            sx={{ flex: 1 }}
            filters={filters}
            name="US_type"
            label={t('select a unit of service type')}
            onChange={(e) => filterChange('US_type', e)}
            options={unitserviceTypesData}
            /> */}
          <Autocomplete
            size="small"
            sx={{ minWidth: 200, flex: 1 }}
            options={countriesData}
            onChange={(event, newValue) => filterChange(`country`, newValue?._id)}
            getOptionLabel={(option) => (curLangAr ? option?.name_arabic : option?.name_english)}
            onInputChange={(event, newInputValue) => {
              changeSearch('country', newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label={t('country')} variant="outlined" />
            )}
          />
          <Autocomplete
            size="small"
            sx={{ minWidth: 200, flex: 1 }}
            options={tableData}
            onChange={(event, newValue) => filterChange(`city`, newValue?._id)}
            getOptionLabel={(option) => (curLangAr ? option?.name_arabic : option?.name_english)}
            onInputChange={(event, newInputValue) => {
              changeSearch('city', newInputValue);
            }}
            renderInput={(params) => <TextField {...params} label={t('city')} variant="outlined" />}
          />
          <Autocomplete
            size="small"
            sx={{ minWidth: 200, flex: 1 }}
            options={insuranseCosData}
            onChange={(event, newValue) => filterChange(`insurance`, newValue?._id)}
            getOptionLabel={(option) => (curLangAr ? option?.name_arabic : option?.name_english)}
            onInputChange={(event, newInputValue) => {
              changeSearch('insurance', newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label={t('insurance company')} variant="outlined" />
            )}
          />
          <Autocomplete
            size="small"
            sx={{ minWidth: 300, flex: 3 }}
            options={[...specialtiesData, ...employeesData, ...keywordsData]}
            onChange={(event, newValue) => {
              if (newValue?._id) {
                filterChange('name', newValue._id);
              } else {
                filterChange('name', newValue);
              }
            }}
            getOptionLabel={(option) => {
              if (option && typeof option === 'object') {
                return curLangAr ? option?.name_arabic : option?.name_english;
              }
              return option;
            }}
            onInputChange={(event, newInputValue) => {
              changeSearch('name', newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('search by doctor, specialty or disease')}
                variant="outlined"
              />
            )}
          />
          {/* <TextField
            size='small'
            sx={{ flex: 2, maxWidth: 1200 }}
            fullWidth
            onChange={(e) => filterChange('name', e.target.value)}
            placeholder={t('search by doctor, specialty or disease')}
            InputLabelProps={{
              style: { color: 'white' },
            }}
            InputProps={{
              style: { color: 'white' },
              endAdornment: (
                <InputAdornment position="end">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          /> */}
        </LocalizationProvider>
      </ThemeProvider>
    </Stack>
  );
}
BookToolbar.propTypes = {
  filters: PropTypes.object,
  filterChange: PropTypes.func,
};
