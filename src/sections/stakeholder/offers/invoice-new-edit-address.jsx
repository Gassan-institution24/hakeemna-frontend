import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

// import { _addressBooks } from 'src/_mock';

import { useAuthContext } from 'src/auth/hooks';
import { RHFCheckbox, RHFSelect, RHFTextField, RHFUpload } from 'src/components/hook-form';
import { useLocales, useTranslate } from 'src/locales';
import { useCallback } from 'react';
import { useGetActiveUSTypes, useGetActiveUnitservices, useGetCountries, useGetCountryCities, useGetCurrencies, useGetSpecialties } from 'src/api';
import { Box, MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

export default function InvoiceNewEditAddress() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { user } = useAuthContext();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const mdUp = useResponsive('up', 'md');

  const values = watch();

  const { t } = useTranslate()

  const { currencies } = useGetCurrencies()
  const { countriesData } = useGetCountries()
  const { tableData } = useGetCountryCities(values.country)
  const { unitserviceTypesData } = useGetActiveUSTypes()
  const { specialtiesData } = useGetSpecialties()
  const { unitservicesData } = useGetActiveUnitservices()

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <>
      <Typography variant='h6' color='text.disabled' sx={{ pt: 3, pl: 3 }}>{t('details')}:</Typography>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: 'column', md: 'row' }}
        // alignItems='center'
        sx={{ p: 3 }}
      >
        <Stack sx={{ width: 1 }}>
          <RHFUpload onDrop={handleDrop} sx={{ width: 1, height: 1 }} name='image' label='image' />
        </Stack>
        <Stack sx={{ width: 1 }}>
          <Stack spacing={2}>
            <RHFTextField name='name_english' label={t('name in english')} />
            <RHFTextField name='name_arabic' label={t('name in arabic')} />
            <RHFTextField multiline rows={2} name='description_english' label={t('description in english')} />
            <RHFTextField multiline rows={2} name='description_arabic' label={t('description in arabic')} />
            <RHFSelect name='currency' label={t('currency')}>
              {currencies.map((one) => (
                <MenuItem key={one._id} value={one._id}> {one.symbol} </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Stack
        sx={{ bgcolor: 'background.neutral' }}
      >
        <Typography variant='h6' color='text.disabled' sx={{ pt: 3, pl: 3 }}>{t('to whom')}:</Typography>
        <Stack
          spacing={{ xs: 3, md: 5 }}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ p: 3 }}
        >
          <RHFCheckbox name='to_patients' label={t('to patients')} onClick={() => setValue('to_patients', !values.to_patients)} />
          <RHFCheckbox name='to_unit_service' label={t('to units of service')} onClick={() => setValue('to_unit_service', !values.to_unit_service)} />
        </Stack>

        {values.to_unit_service && values.to_patients && <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          sx={{ p: 3 }}
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          <RHFSelect name='country' label={t('country')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {countriesData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name='city' label={t('city')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {tableData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name='unit_service_type' label={t('unit of service type')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {unitserviceTypesData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name='speciality' label={t('speciality')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {specialtiesData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name='unit_service' label={t('unit of service')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {unitservicesData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name='age' label={t('age')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            <MenuItem value='less than 18'> {t('less than 18')} </MenuItem>
            <MenuItem value='18 - 35'> {t('18 - 35')} </MenuItem>
            <MenuItem value='more than 35'> {t('more than 35')} </MenuItem>
          </RHFSelect>
          <RHFSelect name='gender' label={t('gender')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            <MenuItem value='male'> {t('male')} </MenuItem>
            <MenuItem value='female'> {t('female')} </MenuItem>
          </RHFSelect>
        </Box>}

        {values.to_unit_service && !values.to_patients && <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          sx={{ p: 3 }}
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          <RHFSelect name='country' label={t('country')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {countriesData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name='city' label={t('city')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {tableData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name='unit_service_type' label={t('unit of service type')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {unitserviceTypesData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name='speciality' label={t('speciality')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {specialtiesData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name='unit_service' label={t('unit of service')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {unitservicesData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
        </Box>}

        {values.to_patients && !values.to_unit_service && <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          sx={{ p: 3 }}
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          <RHFSelect name='country' label={t('country')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {countriesData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name='city' label={t('city')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            {tableData.map((one) => (
              <MenuItem key={one._id} value={one._id}> {curLangAr ? one.name_arabic : one.name_english} </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name='age' label={t('age')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            <MenuItem value='less than 18'> {t('less than 18')} </MenuItem>
            <MenuItem value='18 - 35'> {t('18 - 35')} </MenuItem>
            <MenuItem value='more than 35'> {t('more than 35')} </MenuItem>
          </RHFSelect>
          <RHFSelect name='gender' label={t('gender')}>
            <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>{t('all')}</MenuItem>
            <Divider />
            <MenuItem value='male'> {t('male')} </MenuItem>
            <MenuItem value='female'> {t('female')} </MenuItem>
          </RHFSelect>
        </Box>}
      </Stack>

    </>
  );
}
