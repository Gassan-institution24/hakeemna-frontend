import { useFieldArray, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';
import { RHFAutocomplete, RHFSelect } from 'src/components/hook-form';
import { Box, Link, MenuItem } from '@mui/material';
import { useGetOneEntranceManagement, useGetPatient, useGetUSPatient } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function InvoiceNewEditAddress() {

  const {
    control,
    watch,
  } = useFormContext();

  const { append } = useFieldArray({
    control,
    name: 'items',
  });

  const handleInvoicing = (activity) => {
    append({
      service: null,
      activity: activity || '',
      quantity: 1,
      price: 0,
      subtotal: 0,
      discount: 0,
      deduction: 0,
      tax: 0,
      total: 0,
    });
  }

  const { user } = useAuthContext();
  const { t } = useTranslate()
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const myUS =
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service;

  const { patientsData } = useGetUSPatient(myUS?._id);

  const values = watch();

  const { invoiceTo } = values;
  const { data } = useGetPatient(invoiceTo)
  const { Entrance } = useGetOneEntranceManagement('669614f30abf2815208c985d')
  return (
    <Stack direction={{ md: 'row' }} >

      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{ p: 3 }}
        flex={1}
      >
        <Stack sx={{ width: 1 }}>
          <Stack spacing={1}>
            <Typography variant="h4">{curLangAr ? myUS.name_arabic : myUS.name_english}</Typography>
            <Typography variant="body2">{curLangAr ? `${myUS.city.name_arabic}, ${myUS.country.name_arabic}` : `${myUS.city.name_english}, ${myUS.country.name_english}`}</Typography>
            <Typography variant="body2"> {myUS.phone}</Typography>
          </Stack>
        </Stack>

        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              {t('to')}:
            </Typography>
          </Stack>
          {invoiceTo ? <Stack spacing={1}>
            <Typography variant="subtitle2">{curLangAr ? data?.name_arabic : data?.name_english}</Typography>
            <Typography variant="body2">{curLangAr ? `${data?.city.name_arabic}, ${data?.country.name_arabic}` : `${data?.city?.name_english}, ${data?.country?.name_english}`}</Typography>
            <Typography variant="body2"> {data?.phone}</Typography>
          </Stack> : <Stack direction='row' justifyContent='flex-start'>
            <RHFAutocomplete
              lang='ar'
              sx={{ minWidth: 200 }}
              name="invoiceTo"
              options={patientsData.map((speciality) => speciality._id)}
              getOptionLabel={(option) =>
                patientsData.find((one) => one._id === option)?.[
                curLangAr ? 'name_arabic' : 'name_english'
                ]
              }
              renderOption={(props, option, idx) => (
                <li lang='ar' {...props} key={idx} value={option}>
                  {
                    patientsData.find((one) => one._id === option)?.[
                    curLangAr ? 'name_arabic' : 'name_english'
                    ]
                  }
                </li>
              )}
            />
            {/* <RHFSelect name='invoiceTo' sx={{ maxWidth: 200 }} >
              {patientsData?.map((one) => (
                <MenuItem value={one._id}>{one.name_english}</MenuItem>
              ))}
            </RHFSelect> */}
          </Stack>}
        </Stack>
      </Stack>
      <Stack flex={0.5} sx={{ p: { md: 5, xs: 2 } }} >
        <Typography variant='body1'>{t('activities')}:</Typography>
        <Stack gap={0.5} px={2} mt={1} maxHeight={200} overflow='auto'>
          {Entrance?.activity_happened?.map((one) => (
            <Stack direction='row' gap={2}>
              <Typography variant='subtitle2'><li>
                {curLangAr ? one.name_arabic : one.name_english}
              </li></Typography>
              <Typography
                variant='caption'
                sx={{ color: 'primary.main', cursor: 'pointer' }}
                onClick={() => handleInvoicing(one._id)}
              >
                {t('invoicing')}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
