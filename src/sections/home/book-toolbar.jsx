import { InputAdornment, Stack, TextField } from '@mui/material'
import PropTypes from 'prop-types';
import React from 'react'
import { useGetActiveInsuranceCos, useGetActiveUSTypes, useGetCountries, useGetCountryCities, useGetEmployees, useGetSpecialties } from 'src/api'
import Iconify from 'src/components/iconify'
import { SelectWithSearch } from 'src/components/input-components/select-with-search'
import { useTranslate } from 'src/locales'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function BookToolbar({ filters, filterChange }) {
    const { country } = filters
    const { t } = useTranslate()

    const { unitserviceTypesData } = useGetActiveUSTypes({ select: '_id name_arabic name_english' })
    const { specialtiesData } = useGetSpecialties({ select: '_id name_arabic name_english' })
    const { countriesData } = useGetCountries({ select: '_id name_arabic name_english' })
    const { tableData } = useGetCountryCities(country, { select: '_id name_arabic name_english' })
    const { insuranseCosData } = useGetActiveInsuranceCos({ select: '_id name_arabic name_english' })
    const { employeesData } = useGetEmployees({ select: '_id name_arabic name_english' })

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
        <Stack direction={{ md: 'row' }} justifyContent='space-around' gap={3} px={5} py={3} bgcolor='primary.darker' sx={{ backgroundColor: 'primary.darker' }} color='white' position={{ md: 'sticky' }} top={112} zIndex={3}>
            <ThemeProvider theme={darkTheme}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <SelectWithSearch sx={{ flex: 1 }} filters={filters} name='US_type' label={t('select a unit of service type')} onChange={(e) => filterChange('US_type', e)} options={unitserviceTypesData} />
                    <SelectWithSearch sx={{ flex: 1 }} filters={filters} name='speciality' label={t('select a speciality')} onChange={(e) => filterChange('speciality', e)} options={specialtiesData} />
                    <SelectWithSearch sx={{ flex: 1 }} filters={filters} name='country' label={t('select a country')} onChange={(e) => filterChange('country', e)} options={countriesData} />
                    <SelectWithSearch sx={{ flex: 1 }} filters={filters} name='city' label={t('select a city')} onChange={(e) => filterChange('city', e)} options={tableData} />
                    <SelectWithSearch sx={{ flex: 1 }} filters={filters} name='insurance' label={t('select a insurance')} onChange={(e) => filterChange('insurance', e)} options={insuranseCosData} />
                    <SelectWithSearch sx={{ flex: 1 }} filters={filters} name='doctor' label={t('select a doctor')} onChange={(e) => filterChange('doctor', e)} options={employeesData} />
                    {/* <TextField
                sx={{ flex: 1.5 }}
                fullWidth
                onChange={(e) => filterChange('doctor', e)}
                placeholder={t('search by doctor name')} // Replace with your translation function if using i18n
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
    )
}
BookToolbar.propTypes = {
    filters: PropTypes.object,
    filterChange: PropTypes.func,
};
