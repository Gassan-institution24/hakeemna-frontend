import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import {
  useGetCountries,
  createDemoAccount,
  useGetCountryCities,
  useGetActiveUSTypes,
} from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const SECTOR_TYPES = ['public', 'private', 'non profit organization'];

const DEFAULT_TRIAL_DAYS = 3;

/**
 * Super-admin form for provisioning a demo / trial clinic.
 *
 * Field names deliberately mirror the public clinic-registration wizard
 * (src/sections/auth/unit-service-register-view.jsx): us_* for the clinic, em_* for its admin.
 * The backend validator and provisioning controller speak the same shape, so a demo clinic comes
 * out structurally identical to a self-registered one — that is what makes a demo account
 * indistinguishable from a paid one.
 *
 * The trial length is the only thing that differs, and the account expires automatically.
 */
export default function DemoAccountNewForm() {
  const router = useRouter();
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();

  const [errorMsg, setErrorMsg] = useState('');

  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });
  const { unitserviceTypesData } = useGetActiveUSTypes();

  const DemoAccountSchema = Yup.object().shape({
    // account
    email: Yup.string().email(t('required field')).required(t('required field')),
    userName: Yup.string(),
    password: Yup.string().min(8, t('required field')).required(t('required field')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('Passwords do not match'))
      .required(t('required field')),
    // clinic
    us_name_arabic: Yup.string().required(t('required field')),
    us_name_english: Yup.string().required(t('required field')),
    us_identification_num: Yup.string(),
    us_country: Yup.string().required(t('required field')),
    us_city: Yup.string().required(t('required field')),
    US_type: Yup.string().required(t('required field')),
    us_sector_type: Yup.string().required(t('required field')),
    // clinic admin
    em_name_english: Yup.string().required(t('required field')),
    em_name_arabic: Yup.string().required(t('required field')),
    em_nationality: Yup.string().required(t('required field')),
    em_phone: Yup.string(),
    em_identification_num: Yup.string(),
    // trial
    days: Yup.number()
      .typeError(t('required field'))
      .min(1)
      .max(365)
      .required(t('required field')),
  });

  const defaultValues = useMemo(
    () => ({
      email: '',
      userName: '',
      password: '',
      confirmPassword: '',
      us_name_arabic: '',
      us_name_english: '',
      us_identification_num: '',
      us_country: '',
      us_city: '',
      US_type: '',
      us_sector_type: 'private',
      em_name_english: '',
      em_name_arabic: '',
      em_nationality: '',
      em_phone: '',
      em_identification_num: '',
      days: DEFAULT_TRIAL_DAYS,
    }),
    []
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(DemoAccountSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Cities depend on the selected country, same as the registration wizard.
  const { tableData: citiesData } = useGetCountryCities(values.us_country, {
    select: 'name_english name_arabic',
  });

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');
    try {
      const response = await createDemoAccount({
        ...data,
        email: data.email.toLowerCase(),
      });

      enqueueSnackbar(t('Demo account created'));
      reset();
      router.push(paths.superadmin.users.root);
      return response;
    } catch (error) {
      // The axios interceptor rejects with the raw server payload, not an AxiosError.
      const message = typeof error === 'string' ? error : error?.message || t('Something went wrong');
      setErrorMsg(message);
      return null;
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        {t('Demo accounts have full access with no feature limits and expire automatically.')}
      </Alert>

      <Grid container spacing={3}>
        {/* ── Clinic ───────────────────────────────────────────────────── */}
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('units of service')}
            </Typography>

            <Stack spacing={2}>
              <RHFTextField name="us_name_english" label={t('name english')} />
              <RHFTextField name="us_name_arabic" label={t('name arabic')} />
              <RHFTextField name="us_identification_num" label={t('identification number')} />

              <RHFSelect name="us_country" label={t('region ( country )')}>
                {countriesData?.map((country) => (
                  <MenuItem key={country._id} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="us_city" label={t('city')} disabled={!values.us_country}>
                {citiesData?.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="US_type" label={t('unit of service type')}>
                {unitserviceTypesData?.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="us_sector_type" label={t('sector type')}>
                {SECTOR_TYPES.map((sector) => (
                  <MenuItem key={sector} value={sector}>
                    {t(sector)}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
          </Card>
        </Grid>

        {/* ── Admin account ────────────────────────────────────────────── */}
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('admin')}
            </Typography>

            <Stack spacing={2}>
              <RHFTextField name="em_name_english" label={t('name english')} />
              <RHFTextField name="em_name_arabic" label={t('name arabic')} />

              <RHFSelect name="em_nationality" label={t('nationality')}>
                {countriesData?.map((country) => (
                  <MenuItem key={country._id} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="em_phone" label={t('phone')} />
              <RHFTextField name="em_identification_num" label={t('identification number')} />

              <RHFTextField name="email" label={t('email')} />
              <RHFTextField name="userName" label={t('username')} />
              <RHFTextField name="password" label={t('password')} type="password" />
              <RHFTextField
                name="confirmPassword"
                label={t('confirm password')}
                type="password"
              />
            </Stack>
          </Card>
        </Grid>

        {/* ── Trial ────────────────────────────────────────────────────── */}
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('demo trial')}
            </Typography>

            <Stack spacing={2}>
              <RHFTextField
                name="days"
                label={t('days')}
                type="number"
                inputProps={{ min: 1, max: 365 }}
                helperText={t('The account expires automatically after this many days.')}
              />
            </Stack>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {t('New demo account')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
