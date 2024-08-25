import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { matchIsValidTel } from 'mui-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Button,
  Dialog,
  MenuItem,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_SIGNUP } from 'src/config-global';
import { useLocales, useTranslate } from 'src/locales';
import { useGetCountries, useGetCountryCities } from 'src/api';

import Iconify from 'src/components/iconify';
import Privacypolicy from 'src/components/terms_conditionAndPrivacy_policy/privacyPolicy';
import TermsAndCondition from 'src/components/terms_conditionAndPrivacy_policy/termsAndCondition';
import FormProvider, {
  RHFSelect,
  RHFUpload,
  RHFTextField,
  RHFDatePicker,
  RHFPhoneNumber,
} from 'src/components/hook-form';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function JwtRegisterView({ afterSignUp, onSignIn, setPatientId }) {
  const { register, authenticated } = useAuthContext();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { enqueueSnackbar } = useSnackbar()

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [curPage, setCurPage] = useState(0)

  const router = useRouter();
  const termsDialog = useBoolean(false);
  const policyDialog = useBoolean(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [identification, setIdentification] = useState();
  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    name_english: Yup.string()
      .required(t('required field'))
      .test('at-least-three-words', t('must be at least three words'), (value) => {
        if (!value) return false; // If no value, fail the validation
        const words = value.trim().split(/\s+/); // Split the input by spaces
        return words.length >= 3; // Return true if there are at least three words
      }),
    name_arabic: Yup.string()
      .required(t('required field'))
      .test('at-least-three-words', t('must be at least three words'), (value) => {
        if (!value) return false; // If no value, fail the validation
        const words = value.trim().split(/\s+/); // Split the input by spaces
        return words.length >= 3; // Return true if there are at least three words
      }),
    email: Yup.string().required(t('required field')).email(t('required field')),
    password: Yup.string().required(t('required field')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null])
      .min(8, t('at least 8 ')),
    identification_num: Yup.string().required(t('required field')),
    scanned_identification: Yup.mixed().required(t('required field')),
    mobile_num1: Yup.string()
      .required(t('required field'))
      .test('is-valid-phone', t('Invalid phone number'), (value) => matchIsValidTel(value)),
    gender: Yup.string().required(t('required field')),
    birth_date: Yup.date()
      .required(t('required field'))
      .test('is-adult', 'You must be at least 18 years old', (value) => {
        const oldage = new Date();
        const minDate = new Date(oldage.getFullYear() - 18, oldage.getMonth(), oldage.getDate());
        return value <= minDate;
      }),
    nationality: Yup.string().required(t('required field')),
    country: Yup.string().required(t('required field')),
    city: Yup.string().required(t('required field')),
  });

  const defaultValues = {
    name_english: '',
    name_arabic: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile_num1: '',
    identification_num: '',
    scanned_identification: null,
    gender: '',
    birth_date: today,
    country: null,
    nationality: null,
    city: null,
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { tableData } = useGetCountryCities(values.country, { select: 'name_english name_arabic' });

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    setValue('country', selectedCountryId, { shouldValidate: true });
    // setSelectedCountry(selectedCountryId);
    // setCities(tableData.filter((data)=>data?.country?._id === event.target.value))
  };

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-()]*$/; // Range for Arabic characters
    if (arabicRegex.test(event.target.value)) {
      setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };
  const onSubmit = handleSubmit(async (data) => {
    try {
      data.email = data.email?.toLowerCase()
      const formData = new FormData()
      formData.append('identification', identification[0])
      Object.keys(data).forEach((key) => {
        if (key !== 'scanned_identification') {
          if (Array.isArray(data[key])) {
            data[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      const patient = await register?.(formData);
      if (afterSignUp) {
        setPatientId(patient?.patient?._id);
        enqueueSnackbar(t('appointment booked successfully'))
        afterSignUp();
      } else {
        router.push(paths.auth.verify(data.email) || returnTo || PATH_AFTER_SIGNUP);
      }
    } catch (error) {
      console.error(error);
      // reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const handleDrop = (acceptedFiles) => {
    setIdentification(acceptedFiles)
    if (acceptedFiles && acceptedFiles.length > 0) {
      const newFile = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
      setValue('scanned_identification', newFile);
    }
  };

  useEffect(() => {
    if (authenticated) {
      router.push(paths.dashboard.root)
    }
  }, [authenticated, router])

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      {/* <Hidden smUp>
        <span>
          <Language />
        </span>
      </Hidden> */}

      <Typography variant="h4">{t('Get started absolutely free')} </Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> {t('Already have an account?')} </Typography>

        {onSignIn ? (
          <Link onClick={() => onSignIn()} component={RouterLink} variant="subtitle2">
            {t('login')}
          </Link>
        ) : (
          <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
            {t('login')}
          </Link>
        )}
      </Stack>

      {!onSignIn && <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">
          <Link href="/" component={RouterLink} variant="subtitle2">
            {t('Home page')}
          </Link>
        </Typography>
      </Stack>}
    </Stack>
  );

  const renderTerms = (
    <>
      {curPage === 1 && <>
        <Box sx={{ display: 'flex', mt: 2 }}>
          <Button
            color="inherit"
            disabled={curPage === 0}
            onClick={() => setCurPage(0)}
            sx={{ mt: -1.5 }}
          >
            {t('back')}
          </Button>
        </Box>
        <Dialog open={termsDialog.value}>
          <DialogContent dividers>
            <DialogContentText tabIndex={-1}>
              <TermsAndCondition />
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" onClick={termsDialog.onFalse}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        {/* ----------------------------- */}
        <Dialog open={policyDialog.value}>
          <DialogContent dividers>
            <DialogContentText tabIndex={-1}>
              <Privacypolicy />
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" onClick={policyDialog.onFalse}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        {/* ----------------------------- */}
        <Typography
          component="div"
          sx={{
            color: 'text.secondary',
            mt: 2.5,
            typography: 'caption',
            textAlign: 'center',
          }}
        >
          {t('By signing up, I agree to ')}
          <Link underline="always" color="success.main" onClick={termsDialog.onTrue}>
            {t('Terms of Service ')}
          </Link>
          {t('and ')}
          <Link underline="always" color="success.main" onClick={policyDialog.onTrue}>
            {t('Privacy Policy')}
          </Link>
          .
        </Typography>

      </>}
      {curPage === 0 &&
        <LoadingButton
          sx={{ mt: 4 }}
          fullWidth
          disabled={
            values.name_english.trim().split(/\s+/)?.length < 3 ||
            values.name_arabic.trim().split(/\s+/)?.length < 3 ||
            !values.identification_num ||
            !values.mobile_num1 ||
            !values.nationality ||
            !values.country ||
            !values.city ||
            !matchIsValidTel(values.mobile_num1) ||
            !values.gender ||
            !values.birth_date
          }
          color="inherit"
          size="large"
          variant="contained"
          onClick={() => setCurPage(1)}
        >
          {t('Next Step')}{' '}
          {curLangAr ? (
            <Iconify width={20} className="arrow" icon="eva:arrow-ios-back-fill" />
          ) : (
            <Iconify width={20} className="arrow" icon="eva:arrow-ios-forward-fill" />
          )}
        </LoadingButton>
      }
    </>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        {curPage === 0 &&
          <>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField
                name="name_english"
                label={t('name in english')}
                onChange={handleEnglishInputChange}
              />
              <RHFTextField
                name="name_arabic"
                label={t('name in arabic')}
                onChange={handleArabicInputChange}
              />
            </Stack>

            <RHFTextField name="identification_num" label={t('Identification number')} />
            <RHFPhoneNumber name="mobile_num1" label={t('mobile number')} />
            <RHFSelect name="nationality" label={t('nationality')}>
              {countriesData?.map((country, idx) => (
                <MenuItem lang="ar" key={idx} value={country?._id}>
                  {curLangAr ? country?.name_arabic : country?.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFSelect onChange={handleCountryChange} name="country" label={t('country')}>
                {countriesData?.map((country, idx) => (
                  <MenuItem lang="ar" key={idx} value={country?._id}>
                    {curLangAr ? country?.name_arabic : country?.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="city" label={t('City')}>
                {tableData?.map((city, idx) => (
                  <MenuItem lang="ar" key={idx} value={city?._id}>
                    {curLangAr ? city?.name_arabic : city?.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFSelect name="gender" label={t('Gender')}>
                <MenuItem lang="ar" value="male">
                  {t('male')}
                </MenuItem>
                <MenuItem lang="ar" value="female">
                  {t('female')}
                </MenuItem>
              </RHFSelect>
              <RHFDatePicker name="birth_date" label={t('Date of birth')} />
            </Stack>
          </>}
        {curPage === 1 &&
          <>
            <RHFTextField name="email" label={t('Email address')} />
            <RHFTextField
              name="password"
              label={t('Password')}
              type={password.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <RHFTextField
              name="confirmPassword"
              label={t('Confirm Password')}
              type={password.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Stack gap={1}>
              <Typography variant='subtitle2'>{t('identification scan')}</Typography>
              <RHFUpload name='scanned_identification' onDrop={handleDrop} label={t('identification photo')} />
              <Typography variant='caption'>{t('the scanned image should be clear and able to read')}</Typography>
            </Stack>

            <LoadingButton
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {t('create account')}
            </LoadingButton>
          </>}
      </Stack>
    </FormProvider>
  );

  return (
    <>
      {renderHead}

      {renderForm}

      {renderTerms}
    </>
  );
}
JwtRegisterView.propTypes = {
  afterSignUp: PropTypes.func,
  onSignIn: PropTypes.func,
  setPatientId: PropTypes.func,
};
