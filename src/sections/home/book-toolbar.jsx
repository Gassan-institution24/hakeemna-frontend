import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Stack, TextField, Autocomplete } from '@mui/material';

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

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      px={8}
      py={2}
      sx={{
        backgroundColor: '#E4F6F2',
        borderRadius: 1,
        display: { xs: 'grid', md: 'flex' },
      }}
    >
      <Autocomplete
        size="small"
        sx={{ minWidth: 180 }}
        options={unitserviceTypesData}
        onChange={(event, newValue) => filterChange('US_type', newValue?._id)}
        getOptionLabel={(option) =>
          typeof option === 'object' && curLangAr ? option.name_arabic : option.name_english
        }
        renderInput={(params) => (
          <TextField {...params} label={t('unit of service type')} variant="outlined" />
        )}
      />
      <Autocomplete
        size="small"
        sx={{ minWidth: 150 }}
        options={countriesData}
        onChange={(event, newValue) => filterChange(`country`, newValue?._id)}
        getOptionLabel={(option) =>
          typeof option === 'object' && curLangAr ? option.name_arabic : option.name_english
        }
        renderInput={(params) => <TextField {...params} label={t('country')} variant="outlined" />}
      />
      <Autocomplete
        size="small"
        sx={{ minWidth: 150 }}
        options={tableData}
        onChange={(event, newValue) => filterChange(`city`, newValue?._id)}
        getOptionLabel={(option) =>
          typeof option === 'object' && curLangAr ? option.name_arabic : option.name_english
        }
        renderInput={(params) => <TextField {...params} label={t('city')} variant="outlined" />}
      />
      <Autocomplete
        size="small"
        sx={{ minWidth: 180 }}
        options={insuranseCosData}
        onChange={(event, newValue) => filterChange(`insurance`, newValue?._id)}
        getOptionLabel={(option) =>
          typeof option === 'object' && curLangAr ? option.name_arabic : option.name_english
        }
        renderInput={(params) => (
          <TextField {...params} label={t('insurance company')} variant="outlined" />
        )}
      />
      <Autocomplete
        size="small"
        sx={{ minWidth: 300, flex: 3 }}
        options={[...specialtiesData, ...employeesData, ...keywordsData]}
        onChange={(event, newValue) => {
          filterChange('name', newValue?._id || newValue);
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return curLangAr ? option.name_arabic : option.name_english;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('search by doctor, specialty or disease')}
            variant="outlined"
          />
        )}
      />
    </Stack>
  );
}

BookToolbar.propTypes = {
  filters: PropTypes.object,
  filterChange: PropTypes.func,
};
