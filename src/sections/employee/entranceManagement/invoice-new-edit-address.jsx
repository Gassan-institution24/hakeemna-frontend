import { useFieldArray, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetPatient, useGetUSPatient, useGetOneEntranceManagement, useGetUnitservice } from 'src/api';

import { RHFAutocomplete } from 'src/components/hook-form';

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
      service_type: null,
      activity: activity || '',
      quantity: 1,
      price_per_unit: 0,
      subtotal: 0,
      discount_amount: 0,
      deduction: 0,
      tax: 0,
      total: 0,
    });
  }

  const { t } = useTranslate()
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const values = watch();

  const { unit_service, patient } = values;
  const { data } = useGetPatient(patient)
  const { data: USData } = useGetUnitservice(unit_service)
  const { Entrance } = useGetOneEntranceManagement('669614f30abf2815208c985d')
  const { patientsData } = useGetUSPatient(USData?._id);

  return (
    <Stack direction={{ md: 'row' }} >

      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{ p: 3 }}
        flex={1}
      >
        <Stack sx={{ width: 1 }}>
          <Stack spacing={1}>
            <Typography variant="h4">{curLangAr ? USData?.name_arabic : USData?.name_english}</Typography>
            <Typography variant="body2">{curLangAr ? `${USData?.city?.name_arabic}, ${USData?.country?.name_arabic}` : `${USData?.city?.name_english}, ${USData?.country?.name_english}`}</Typography>
            <Typography variant="body2"> {USData?.phone}</Typography>
          </Stack>
        </Stack>

        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              {t('to')}:
            </Typography>
          </Stack>
          {patient ? <Stack spacing={1}>
            <Typography variant="subtitle2">{curLangAr ? data?.name_arabic : data?.name_english}</Typography>
            <Typography variant="body2">{curLangAr ? `${data?.city?.name_arabic}, ${data?.country?.name_arabic}` : `${data?.city?.name_english}, ${data?.country?.name_english}`}</Typography>
            <Typography variant="body2"> {data?.phone}</Typography>
          </Stack> : <Stack direction='row' justifyContent='flex-start'>
            <RHFAutocomplete
              lang='ar'
              sx={{ minWidth: 200 }}
              name="patient"
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
