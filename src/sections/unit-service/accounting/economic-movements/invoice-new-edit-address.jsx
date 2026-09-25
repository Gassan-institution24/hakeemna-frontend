import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { useDebounce } from 'src/hooks/use-debounce';

import { useLocales, useTranslate } from 'src/locales';
import {
  useGetPatient,
  useGetUSPatients,
  useGetOneUSPatient,
  useGetOneEntranceManagement,
} from 'src/api';

// ----------------------------------------------------------------------

export default function InvoiceNewEditAddress() {
  const { control, watch, setValue } = useFormContext();

  const { append } = useFieldArray({
    control,
    name: 'items',
  });

  const handleInvoicing = (activity) => {
    append({
      service_type: null,
      activity: activity || null,
      quantity: 1,
      price_per_unit: 0,
      subtotal: 0,
      discount_amount: 0,
      deduction: 0,
      tax: 0,
      total: 0,
    });
  };

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const values = watch();

  const { unit_service, patient, entrance, unit_service_patient } = values;
  const { data } = useGetPatient(patient);
  const { usPatientData } = useGetOneUSPatient(unit_service_patient, {
    populate: [
      { path: 'country', select: 'name_english name_arabic' },
      { path: 'city', select: 'name_english name_arabic' },
    ],
  });
  const { Entrance } = useGetOneEntranceManagement(entrance, {
    select: 'activity_happened',
    populate: [{ path: 'activity_happened', select: 'name_english name_arabic' }],
  });
  // The clinic's own patient records (unit_service_patients), searched on the server.
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const { patientsData } = useGetUSPatients(unit_service, {
    name: debouncedSearch || undefined,
    select: 'name_english name_arabic patient mobile_num1 file_code',
  });

  return (
    <Stack direction={{ md: 'row' }}>
      <Stack spacing={{ xs: 2, md: 3 }} sx={{ p: 3 }} flex={1}>
        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              {t('to')}:
            </Typography>
          </Stack>
          {patient ? (
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
          ) : (
            <Stack spacing={1}>
              <Typography variant="subtitle2">
                {curLangAr ? usPatientData?.name_arabic : usPatientData?.name_english}
              </Typography>
              <Typography variant="body2"> {usPatientData?.phone}</Typography>
            </Stack>
          )}

          {/* Always offered, so the invoice can be addressed to someone else — including a
              patient the clinic added without a Hakeemna account (unit_service_patient only). */}
          <Autocomplete
            sx={{ mt: 1.5, maxWidth: 360 }}
            size="small"
            options={patientsData}
            filterOptions={(options) => options} // the server already searched
            getOptionLabel={(option) =>
              (curLangAr ? option?.name_arabic : option?.name_english) ||
              option?.name_english ||
              option?.name_arabic ||
              ''
            }
            isOptionEqualToValue={(a, b) => a._id === b._id}
            value={null}
            inputValue={search}
            onInputChange={(_e, value, reason) => reason !== 'reset' && setSearch(value)}
            onChange={(_e, option) => {
              if (!option) return;
              setValue('unit_service_patient', option._id, { shouldDirty: true });
              setValue('patient', option.patient?._id || option.patient || null, {
                shouldDirty: true,
              });
              setSearch('');
            }}
            noOptionsText={t('no data')}
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                <Stack>
                  <Typography variant="body2">
                    {(curLangAr ? option.name_arabic : option.name_english) ||
                      option.name_english ||
                      option.name_arabic}
                  </Typography>
                  {(option.mobile_num1 || option.file_code) && (
                    <Typography variant="caption" color="text.secondary">
                      {[option.file_code, option.mobile_num1].filter(Boolean).join(' · ')}
                    </Typography>
                  )}
                </Stack>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={patient || unit_service_patient ? t('change patient') : t('choose patient')}
                placeholder={t('search by name, phone or file number')}
              />
            )}
          />
        </Stack>
      </Stack>
      {Entrance?.activity_happened?.length > 0 && (
        <Stack flex={0.5} sx={{ p: { md: 5, xs: 2 } }}>
          <Typography variant="body1">{t('activities')}:</Typography>
          <Stack gap={0.5} px={2} mt={1} maxHeight={120} overflow="auto">
            {Entrance?.activity_happened?.map((one) => (
              <Stack direction="row" gap={2}>
                <Typography variant="subtitle2">
                  <li>{curLangAr ? one.name_arabic : one.name_english}</li>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'primary.main', cursor: 'pointer' }}
                  onClick={() => handleInvoicing(one._id)}
                >
                  {t('invoicing')}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
