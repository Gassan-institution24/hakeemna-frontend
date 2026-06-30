import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Card, Stack, TextField, Autocomplete, InputAdornment } from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';

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

import Iconify from 'src/components/iconify';

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

  const usTypeSearch = useDebounce(search.usType);
  const nameSearch = useDebounce(search.name);

  const { unitserviceTypesData } = useGetActiveUSTypes({
    select: '_id name_arabic name_english',
    name: usTypeSearch,
    rowPerPage: 10,
  });
  const { keywordsData } = useGetKeywords({ name: nameSearch });
  const { specialtiesData } = useGetSpecialties({
    select: '_id name_arabic name_english',
    name: nameSearch,
  });
  const { countriesData } = useGetCountries({ select: '_id name_arabic name_english' });
  const { tableData } = useGetCountryCities(country, { select: '_id name_arabic name_english' });
  const { insuranseCosData } = useGetActiveInsuranceCos({ select: '_id name_arabic name_english' });
  const { employeesData } = useGetEmployees({
    select: '_id name_arabic name_english',
    name: nameSearch,
  });

  const withIcon = (params, icon, label) => (
    <TextField
      {...params}
      label={label}
      variant="outlined"
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <>
            <InputAdornment position="start" sx={{ ml: 0.5 }}>
              <Iconify icon={icon} width={20} sx={{ color: 'primary.main' }} />
            </InputAdornment>
            {params.InputProps.startAdornment}
          </>
        ),
      }}
    />
  );

  return (
    <Card
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(145, 158, 171, 0.16)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems="center"
        spacing={1.5}
        sx={{ width: '100%' }}
      >
        <Autocomplete
          size="small"
          fullWidth
          sx={{ flex: 3, minWidth: { md: 280 } }}
          options={[...specialtiesData, ...employeesData, ...keywordsData]}
          onChange={(event, newValue) => {
            filterChange('name', newValue?._id || newValue);
          }}
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option;
            return curLangAr ? option.name_arabic : option.name_english;
          }}
          renderInput={(params) =>
            withIcon(params, 'eva:search-fill', t('search by doctor, specialty or disease'))
          }
        />
        <Autocomplete
          size="small"
          fullWidth
          sx={{ flex: 1, minWidth: { md: 170 } }}
          options={unitserviceTypesData}
          onChange={(event, newValue) => filterChange('US_type', newValue?._id)}
          getOptionLabel={(option) =>
            typeof option === 'object' && curLangAr ? option.name_arabic : option.name_english
          }
          renderInput={(params) =>
            withIcon(params, 'solar:hospital-bold', t('unit of service type'))
          }
        />
        <Autocomplete
          size="small"
          fullWidth
          sx={{ flex: 1, minWidth: { md: 140 } }}
          options={countriesData}
          onChange={(event, newValue) => filterChange(`country`, newValue?._id)}
          getOptionLabel={(option) =>
            typeof option === 'object' && curLangAr ? option.name_arabic : option.name_english
          }
          renderInput={(params) => withIcon(params, 'solar:global-bold', t('country'))}
        />
        <Autocomplete
          size="small"
          fullWidth
          sx={{ flex: 1, minWidth: { md: 140 } }}
          options={tableData}
          onChange={(event, newValue) => filterChange(`city`, newValue?._id)}
          getOptionLabel={(option) =>
            typeof option === 'object' && curLangAr ? option.name_arabic : option.name_english
          }
          renderInput={(params) => withIcon(params, 'solar:map-point-bold', t('city'))}
        />
        <Autocomplete
          size="small"
          fullWidth
          sx={{ flex: 1, minWidth: { md: 170 } }}
          options={insuranseCosData}
          onChange={(event, newValue) => filterChange(`insurance`, newValue?._id)}
          getOptionLabel={(option) =>
            typeof option === 'object' && curLangAr ? option.name_arabic : option.name_english
          }
          renderInput={(params) =>
            withIcon(params, 'solar:shield-check-bold', t('insurance company'))
          }
        />
      </Stack>
    </Card>
  );
}

BookToolbar.propTypes = {
  filters: PropTypes.object,
  filterChange: PropTypes.func,
};
