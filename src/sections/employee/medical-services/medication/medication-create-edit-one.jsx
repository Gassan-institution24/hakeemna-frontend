import useSWR from 'swr';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { medicineLabel } from 'src/utils/medicine-label';
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { useGetMedicines } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFCheckbox, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

// Medicines grouped by speciality (from each medicine's Medical_Specialty fields).
const SPECIALITY_GROUPS_URL = '/api/medicines/by-speciality';
const SPECIALITY_MEDICINES_URL = '/api/medicines/by-speciality/medicines';

const emptyRow = (medicine = null) => ({
  medicine,
  Frequency_per_day: '',
  chronic: false,
  Doctor_Comments: '',
});

export default function MedicationNewEditForm({ currentFavorite }) {
  const router = useRouter();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();

  const MedicationSchema = Yup.object().shape({
    name_arabic: Yup.string().required(t('arabic name is required')),
    name_english: Yup.string().required(t('english name is required')),

    medicines: Yup.array()
      .of(
        Yup.object().shape({
          medicine: Yup.object().nullable().required(t('medicine selection is required')),
          Frequency_per_day: Yup.number()
            .transform((value, original) =>
              original === '' || original === null || original === undefined ? undefined : value
            )
            .typeError(t('frequency must be a number')),
          chronic: Yup.boolean(),
          Doctor_Comments: Yup.string(),
        })
      )
      .min(1, t('at least one medicine must be added')),
  });

  const { medicinesData } = useGetMedicines({ rowsPerPage: 5000 });

  // Speciality filter: the medicine lists show only that speciality's medicines, and
  // "Add all" puts the whole list into the favorite. A new favorite starts on the doctor's own
  // speciality when the medicines table has one matching it.
  const { data: groupsData } = useSWR(SPECIALITY_GROUPS_URL, fetcher);
  const specialityGroups = useMemo(
    () => (Array.isArray(groupsData) ? groupsData.filter((g) => g.key !== 'none') : []),
    [groupsData]
  );
  const [specialityGroup, setSpecialityGroup] = useState(null);
  const [specialityTouched, setSpecialityTouched] = useState(false);
  const doctorSpecialityId = user?.employee?.speciality?._id || user?.employee?.speciality;

  useEffect(() => {
    if (currentFavorite || specialityTouched || specialityGroup || !doctorSpecialityId) return;
    const mine = specialityGroups.find(
      (g) => g.speciality?._id && String(g.speciality._id) === String(doctorSpecialityId)
    );
    if (mine) setSpecialityGroup(mine);
  }, [currentFavorite, specialityTouched, specialityGroup, doctorSpecialityId, specialityGroups]);

  const { data: specialityData, isLoading: specialityLoading } = useSWR(
    specialityGroup
      ? [SPECIALITY_MEDICINES_URL, { params: { key: specialityGroup.key, rowsPerPage: 5000 } }]
      : null,
    fetcher
  );
  const medicinePool = specialityGroup ? specialityData?.medicines || [] : medicinesData || [];
  const groupLabel = (g) =>
    (curLangAr ? g?.name_arabic || g?.name_english : g?.name_english || g?.name_arabic) || '';

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentFavorite?.favorite_name_ar || '',
      name_english: currentFavorite?.favorite_name || '',
      medicines:
        currentFavorite?.medicines?.length > 0
          ? currentFavorite.medicines
          : [
              {
                medicine: null,
                Frequency_per_day: '',
                chronic: false,
                Doctor_Comments: '',
              },
            ],
    }),
    [currentFavorite]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(MedicationSchema),
    defaultValues,
  });
  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { control } = methods;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'medicines',
  });
  const selectedMedicines = methods.watch('medicines');

  const selectedIds = new Set(
    (selectedMedicines || []).map((m) => m?.medicine?._id).filter(Boolean)
  );
  const notYetAdded = medicinePool.filter((m) => !selectedIds.has(m._id));

  const addAllFromSpeciality = () => {
    const kept = (methods.getValues('medicines') || []).filter((m) => m?.medicine);
    replace([...kept, ...notYetAdded.map((m) => emptyRow(m))]);
    // Name the favorite after the speciality when the names are still empty.
    if (!methods.getValues('name_english') && specialityGroup?.name_english) {
      methods.setValue(
        'name_english',
        `${specialityGroup.name_english} medicines`.replace(/[^a-zA-Z0-9\s,@#$!*_\-&^%.()]/g, ''),
        { shouldValidate: true }
      );
    }
    if (!methods.getValues('name_arabic') && specialityGroup?.name_arabic) {
      methods.setValue(
        'name_arabic',
        `أدوية ${specialityGroup.name_arabic}`.replace(/[^\u0600-\u06FF0-9\s!@#$%^&*_\-().]/g, ''),
        { shouldValidate: true }
      );
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        favorite_name: data.name_english,
        favorite_name_ar: data.name_arabic,
        medicines: data.medicines.map((m) => ({
          medicine: m.medicine?._id,
          Frequency_per_day:
            m.Frequency_per_day === '' || m.Frequency_per_day == null
              ? undefined
              : Number(m.Frequency_per_day),
          chronic: m.chronic || false,
          Doctor_Comments: m.Doctor_Comments,
        })),
      };

      if (currentFavorite) {
        await axiosInstance.patch(endpoints.favoriteMedication.one(currentFavorite._id), payload);
      } else {
        await axiosInstance.post(endpoints.favoriteMedication.all, payload);
      }

      enqueueSnackbar(currentFavorite ? t('update success!') : t('create success!'));
      router.push(paths.employee.medicalServices.medication.root);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                onChange={handleEnglishInputChange}
                name="name_english"
                label={t('name english')}
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                name="name_arabic"
                label={t('name arabic')}
              />
              <Stack spacing={2} sx={{ gridColumn: '1 / -1' }}>
                {!!specialityGroups.length && (
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ sm: 'center' }}
                  >
                    <Autocomplete
                      sx={{ flex: 1 }}
                      options={specialityGroups}
                      value={specialityGroup}
                      onChange={(_, g) => {
                        setSpecialityTouched(true);
                        setSpecialityGroup(g);
                      }}
                      getOptionLabel={(g) => `${groupLabel(g)} (${g.count})`}
                      isOptionEqualToValue={(a, b) => a.key === b.key}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('speciality medicines')}
                          helperText={
                            specialityGroup
                              ? t('the lists below show only this speciality')
                              : t('choose a speciality to pick from its medicines')
                          }
                        />
                      )}
                    />
                    {specialityGroup && (
                      <LoadingButton
                        variant="contained"
                        color="info"
                        loading={specialityLoading}
                        disabled={!notYetAdded.length}
                        onClick={addAllFromSpeciality}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {t('add all')} ({notYetAdded.length})
                      </LoadingButton>
                    )}
                  </Stack>
                )}
                {fields.length > 1 && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {fields.filter((_, i) => selectedMedicines?.[i]?.medicine).length}{' '}
                    {t('medicines in this favorite')}
                  </Typography>
                )}
                {specialityGroup && !specialityLoading && !medicinePool.length && (
                  <Alert severity="info">{t('no medicines found for this speciality')}</Alert>
                )}
                {fields.map((field, index) => (
                  <Grid container spacing={2} key={field.id}>
                    <Grid xs={12} md={3}>
                      <RHFAutocomplete
                        name={`medicines.${index}.medicine`}
                        label={t('medicine')}
                        options={medicinePool.filter(
                          (option) =>
                            !selectedIds.has(option._id) ||
                            option._id === selectedMedicines[index]?.medicine?._id
                        )}
                        getOptionLabel={(option) => medicineLabel(option)}
                        isOptionEqualToValue={(option, value) => option._id === value?._id}
                      />
                    </Grid>
                    <Grid xs={12} md={2}>
                      <RHFTextField
                        name={`medicines.${index}.Frequency_per_day`}
                        label={t('frequency')}
                        type="number"
                      />
                    </Grid>
                    <Grid xs={12} md={2}>
                      <RHFCheckbox
                        name={`medicines.${index}.chronic`}
                        label={t('chronic')}
                        onChange={(e) => {
                          methods.setValue(`medicines.${index}.chronic`, e.target.checked, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <RHFTextField
                        name={`medicines.${index}.Doctor_Comments`}
                        label={t('doctor comments')}
                      />
                    </Grid>

                    <Grid xs={12} md={1}>
                      <LoadingButton color="error" onClick={() => remove(index)}>
                        ✕
                      </LoadingButton>
                    </Grid>
                  </Grid>
                ))}

                <LoadingButton
                  variant="outlined"
                  onClick={() => append(emptyRow())}
                >
                  {t('add medicine')}
                </LoadingButton>
              </Stack>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {!currentFavorite ? t('create') : t('save changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

MedicationNewEditForm.propTypes = {
  currentFavorite: PropTypes.object,
};
