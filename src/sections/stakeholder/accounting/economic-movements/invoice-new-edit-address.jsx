import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useLocales, useTranslate } from 'src/locales';
import {
  useGetPatient,
  useGetPatients,
  useGetUnitservice,
  useGetActiveUnitservices,
} from 'src/api';

import { RHFRadioGroup, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditAddress() {
  const { watch } = useFormContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const values = watch();

  const { patient, unit_service } = values;
  const { data } = useGetPatient(patient);
  const { data: USData } = useGetUnitservice(unit_service);
  const { unitservicesData } = useGetActiveUnitservices({ select: 'name_english name_arabic' });
  const { patientsData } = useGetPatients({ select: 'name_english name_arabic', status: 'active' });

  return (
    <Stack direction={{ md: 'row' }}>
      <Stack spacing={{ xs: 2, md: 3 }} sx={{ p: 3 }} flex={1}>
        <Stack sx={{ width: 1 }}>
          {!data && !USData && (
            <>
              <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                <RHFRadioGroup
                  row
                  name="to"
                  options={[
                    { label: 'to patient', value: 'to_patient' },
                    { label: 'to unit of service', value: 'to_unit_service' },
                  ]}
                />
              </Stack>
              {values.to === 'to_patient' && (
                <Stack direction="row" justifyContent="flex-start">
                  <RHFAutocomplete
                    lang="ar"
                    sx={{ minWidth: 200 }}
                    name="patient"
                    options={patientsData.map((speciality) => speciality._id)}
                    getOptionLabel={(option) =>
                      patientsData.find((one) => one._id === option)?.[
                      curLangAr ? 'name_arabic' : 'name_english'
                      ]
                    }
                    renderOption={(props, option, idx) => (
                      <li lang="ar" {...props} key={idx} value={option}>
                        {
                          patientsData.find((one) => one._id === option)?.[
                          curLangAr ? 'name_arabic' : 'name_english'
                          ]
                        }
                      </li>
                    )}
                  />
                </Stack>
              )}
              {values.to === 'to_unit_service' && (
                <Stack direction="row" justifyContent="flex-start">
                  <RHFAutocomplete
                    lang="ar"
                    sx={{ minWidth: 200 }}
                    name="unit_service"
                    options={unitservicesData.map((speciality) => speciality._id)}
                    getOptionLabel={(option) =>
                      unitservicesData.find((one) => one._id === option)?.[
                      curLangAr ? 'name_arabic' : 'name_english'
                      ]
                    }
                    renderOption={(props, option, idx) => (
                      <li lang="ar" {...props} key={idx} value={option}>
                        {
                          unitservicesData.find((one) => one._id === option)?.[
                          curLangAr ? 'name_arabic' : 'name_english'
                          ]
                        }
                      </li>
                    )}
                  />
                </Stack>
              )}
            </>
          )}
          {(data || USData) && (
            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
                {t('to')}:
              </Typography>
            </Stack>
          )}
          {data && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">
                {curLangAr ? data?.name_arabic : data?.name_english}
              </Typography>
              <Typography variant="body2">
                {curLangAr
                  ? `${data?.city?.name_arabic || ''}, ${data?.country?.name_arabic || ''}`
                  : `${data?.city?.name_english || ''}, ${data?.country?.name_english || ''}`}
              </Typography>
              <Typography variant="body2"> {data?.phone}</Typography>
            </Stack>
          )}
          {USData && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">
                {curLangAr ? USData?.name_arabic : USData?.name_english}
              </Typography>
              <Typography variant="body2">
                {curLangAr
                  ? `${USData?.city?.name_arabic}, ${USData?.country?.name_arabic}`
                  : `${USData?.city?.name_english}, ${USData?.country?.name_english}`}
              </Typography>
              <Typography variant="body2"> {data?.phone}</Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
