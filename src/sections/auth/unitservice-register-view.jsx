import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

import Link from '@mui/material/Link';
import Step from '@mui/material/Step';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Dialog,
  Tooltip,
  Checkbox,
  MenuItem,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_SIGNUP } from 'src/config-global';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetCountries,
  useGetSpecialties,
  useGetCountryCities,
  useGetActiveUSTypes,
} from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const steps = [t('service unit'), t('admin'), t('account')];

  const { register } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  // const [selectedCountry, setSelectedCountry] = useState('');
  const [page, setPage] = useState(0);
  // const [cities, setCities] = useState([]);
  // const [us_phone, setUSphone] = useState();
  const [em_phone, setEMphone] = useState();

  const { countriesData } = useGetCountries();
  const { unitserviceTypesData } = useGetActiveUSTypes();
  const { specialtiesData } = useGetSpecialties();

  const searchParams = useSearchParams();

  const [agree, setAgree] = useState(false);

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();
  const dialog = useBoolean(true);
  const policyDialog = useBoolean();

  const RegisterSchema = Yup.object().shape({
    us_name_arabic: Yup.string().required('Service unit name is required'),
    us_name_english: Yup.string().required('Service unit name is required'),
    // us_email: Yup.string()
    //   .required('Service unit email is required')
    //   .email('Service unit email must be a valid email address'),
    us_identification_num: Yup.string().required('Service unit ID number is required'),
    us_country: Yup.string().required('Service unit country is required'),
    us_city: Yup.string().required('Service unit city is required'),
    US_type: Yup.string().required('Service unit type is required'),
    us_speciality: Yup.string().nullable(),
    us_sector_type: Yup.string().required('Service unit sector is required'),
    // us_phone: Yup.string().required('Service unit phone is required'),

    em_first_name: Yup.string().required('Employee first name is required'),
    em_middle_name: Yup.string().required('Employee middle name is required'),
    em_family_name: Yup.string().required('Employee family name is required'),
    em_nationality: Yup.string().required('Employee nationality is required'),
    em_identification_num: Yup.string().required('Employee ID number is required'),
    em_profrssion_practice_num: Yup.string().required(
      'Employee prefession practice number is required'
    ),
    // em_type: Yup.string().required('Employee type is required'),
    em_phone: Yup.string().required('Employee phone is required'),
    em_speciality: Yup.string().nullable(),

    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().min(8, 'Password must be at least 8 character'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .min(8, 'Confirm password must be at least 8 characters'),
  });

  const defaultValues = {
    us_name_arabic: '',
    us_name_english: '',
    // us_email: '',
    us_identification_num: '',
    us_country: null,
    us_city: null,
    US_type: null,
    us_speciality: null,
    us_sector_type: '',
    // us_phone: '',
    em_first_name: '',
    em_middle_name: '',
    em_family_name: '',
    em_nationality: null,
    em_identification_num: '',
    em_profrssion_practice_num: '',
    // em_type: '',
    em_phone: '',
    em_speciality: null,
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();

  const { tableData } = useGetCountryCities(values.us_country);

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_-]*$/; // Range for Arabic characters
    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('us_country', selectedCountryId, { shouldValidate: true });
    // setSelectedCountry(selectedCountryId);
    // setCities(tableData.filter((data)=>data?.country?._id === event.target.value))
  };

  const onSubmit = handleSubmit(async (data) => {
    // console.log(data);
    try {
      // console.log(data);
      await register?.({
        role: 'admin',
        userName: `${data.em_first_name} ${data.em_family_name}`,
        ...data,
      });

      router.push(paths.auth.verify(data.email) || returnTo || PATH_AFTER_SIGNUP);
    } catch (error) {
      console.error(error);
      // reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });
  // useEffect(() => {
  //   setCities(
  //     selectedCountry
  //       ? tableData.filter((data) => data?.country?._id === selectedCountry)
  //       : tableData
  //   );
  // }, [tableData, selectedCountry]);
  useEffect(() => {
    if (Object.keys(errors).length) {
      // console.log(errors);
      setErrorMsg(
        Object.keys(errors)
          .map((key, idx) => errors?.[key]?.message)
          .join('<br>')
      );
    }
  }, [errors]);
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 3, position: 'relative' }}>
      <Typography variant="h4">
        {curLangAr ? 'التسجيل كوحدة خدمة' : 'Sign up as service unit'}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography sx={{ mb: 3 }} variant="body2">
          {t('Already have an account?')}
        </Typography>
        <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
          {t('Sign in')}
        </Link>
      </Stack>
      <Stepper activeStep={page}>
        {steps.map((label, index, idx) => {
          const stepProps = {};
          const labelProps = { lang: 'ar' };
          return (
            <Step key={idx} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        mt: 2,
        typography: 'caption',
        // textAlign: 'center',
      }}
      lang="ar"
    >
      <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />
      {t('I agree to ')}
      <Link
        onClick={policyDialog.onTrue}
        sx={{ cursor: 'pointer' }}
        underline="always"
        color="text.primary"
      >
        {t('Terms of Service')}
      </Link>
      {t(' and ')}
      <Link
        onClick={policyDialog.onTrue}
        sx={{ cursor: 'pointer' }}
        underline="always"
        color="text.primary"
      >
        {t('Privacy Policy')}
      </Link>
    </Typography>
  );

  const renderForm = (
    <Stack spacing={2}>
      {!!errorMsg && (
        <Alert severity="error">
          <div> {errorMsg} </div>
        </Alert>
      )}
      {/* <Alert severity="info">Service unit information</Alert> */}
      <Tooltip placement="top" title="Service unit name in english">
        <RHFTextField
          lang="ar"
          onChange={handleEnglishInputChange}
          name="us_name_english"
          label={`${t('name english')} *`}
        />
      </Tooltip>
      <Tooltip placement="top" title="Service unit name in arabic">
        <RHFTextField
          lang="ar"
          onChange={handleArabicInputChange}
          name="us_name_arabic"
          label={`${t('name arabic')} *`}
        />
      </Tooltip>
      <Tooltip placement="top" title="Identification number of service unit">
        <RHFTextField lang="ar" name="us_identification_num" label={`${t('ID number')} *`} />
      </Tooltip>
      {/* <Tooltip placement="top" title="Phone number of service unit">
        <MuiTelInput
          forceCallingCode
          label={`${t('phone')} *`}
          value={us_phone}
          onChange={(newPhone) => {
            matchIsValidTel(newPhone);
            setUSphone(newPhone);
            methods.setValue('us_phone', newPhone);
          }}
        />
      </Tooltip> */}

      {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Tooltip placement="top" title="email address of service unit">
          <RHFTextField lang="ar" name="us_email" label={`${t('email')} *`} />
        </Tooltip>
      </Stack> */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Tooltip placement="top" title="country which service unit placed">
          <RHFSelect
            lang="ar"
            onChange={handleCountryChange}
            name="us_country"
            label={`${t('country')} *`}
          >
            {countriesData.map((country, idx) => (
              <MenuItem key={idx} value={country._id}>
                {curLangAr ? country.name_arabic : country.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
        </Tooltip>
        <Tooltip placement="top" title="city which service unit placed">
          <RHFSelect lang="ar" name="us_city" label={`${t('city')} *`}>
            {tableData.map((city, idx) => (
              <MenuItem key={idx} value={city._id}>
                {curLangAr ? city.name_arabic : city.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
        </Tooltip>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Tooltip placement="top" title="type of the service unit">
          <RHFSelect lang="ar" name="US_type" label={`${t('service unit type')} *`}>
            {unitserviceTypesData.map((type, idx) => (
              <MenuItem key={idx} value={type._id}>
                {curLangAr ? type.name_arabic : type.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
        </Tooltip>
        <Tooltip placement="top" title="unit service speciality">
          <RHFSelect lang="ar" name="us_speciality" label={`${t('speciality')} *`}>
            {specialtiesData.map((specialty, idx) => (
              <MenuItem key={idx} value={specialty._id}>
                {curLangAr ? specialty.name_arabic : specialty.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
        </Tooltip>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Tooltip placement="top" title="service unit sector type">
          <RHFSelect lang="ar" name="us_sector_type" label={t('sector type')}>
            <MenuItem value="public">{t('Public')}</MenuItem>
            <MenuItem value="private">{t('private')}</MenuItem>
            <MenuItem value="non profit organization">{t('non profit organization')}</MenuItem>
          </RHFSelect>
        </Tooltip>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        variant="contained"
        type="submit"
        onClick={() => setPage((prev) => prev + 1)}
      >
        {t('Next Step')}{' '}
        {curLangAr ? (
          <Iconify width={20} className="arrow" icon="eva:arrow-ios-back-fill" />
        ) : (
          <Iconify width={20} className="arrow" icon="eva:arrow-ios-forward-fill" />
        )}
      </LoadingButton>
      <Box sx={{ display: 'flex' }}>
        <Button
          color="inherit"
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
          // sx={{ m: 1 }}
        >
          {t('back')}
        </Button>
      </Box>
    </Stack>
  );
  const renderFormEmployee = (
    <Stack spacing={2}>
      {!!errorMsg && (
        <Alert severity="error">
          <div> {errorMsg} </div>
        </Alert>
      )}
      {/* <Alert severity="info">Employee information</Alert> */}

      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <Tooltip placement="top" title="admin first name">
          <RHFTextField
            lang="ar"
            onChange={handleEnglishInputChange}
            name="em_first_name"
            label={`${t('first name')} *`}
          />
        </Tooltip>
        <Tooltip placement="top" title="admin middle name - father name -">
          <RHFTextField
            lang="ar"
            onChange={handleEnglishInputChange}
            name="em_middle_name"
            label={`${t('middle name')} *`}
          />
        </Tooltip>
        <Tooltip placement="top" title="admin family name">
          <RHFTextField
            lang="ar"
            onChange={handleEnglishInputChange}
            name="em_family_name"
            label={`${t('family name')} *`}
          />
        </Tooltip>
        <Tooltip placement="top" title="speciality of admin">
          <RHFSelect lang="ar" name="em_speciality" label={t('speciality')}>
            {specialtiesData.map((specialty, idx) => (
              <MenuItem key={idx} value={specialty._id}>
                {curLangAr ? specialty.name_arabic : specialty.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
        </Tooltip>
        {/* <RHFSelect name="em_type" label="Employee type">
          {employeeTypesData.map((type, idx)  => (
            <MenuItem key={idx} value={type._id}>
              {type.name_english}
            </MenuItem>
          ))}
        </RHFSelect> */}
      </Box>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(1, 1fr)',
        }}
      >
        <Tooltip placement="top" title="admin nationality">
          <RHFSelect lang="ar" name="em_nationality" label={`${t('nationality')} *`}>
            {countriesData.map((country, idx) => (
              <MenuItem key={idx} value={country._id}>
                {curLangAr ? country.name_arabic : country.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
        </Tooltip>
        <Tooltip placement="top" title="admin identification number">
          <RHFTextField lang="ar" name="em_identification_num" label={`${t('ID number')} *`} />
        </Tooltip>
        <Tooltip placement="top" title="admin proffession practice number">
          <RHFTextField
            lang="ar"
            name="em_profrssion_practice_num"
            label={`${t('profrssion practice number')} *`}
          />
        </Tooltip>
        <Tooltip placement="top" title="admin phone number">
          <MuiTelInput
            label={`${t('phone')} *`}
            forceCallingCode
            defaultCountry='JO'
            value={em_phone}
            onChange={(newPhone) => {
              matchIsValidTel(newPhone);
              setEMphone(newPhone);
              methods.setValue('em_phone', newPhone);
            }}
          />
        </Tooltip>
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        variant="contained"
        type="submit"
        onClick={() => setPage((prev) => prev + 1)}
      >
        {t('Next Step')}{' '}
        {curLangAr ? (
          <Iconify width={20} className="arrow" icon="eva:arrow-ios-back-fill" />
        ) : (
          <Iconify width={20} className="arrow" icon="eva:arrow-ios-forward-fill" />
        )}
      </LoadingButton>
      <Box sx={{ display: 'flex' }}>
        <Button
          color="inherit"
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
          // sx={{ m: 1 }}
        >
          {t('back')}
        </Button>
      </Box>
    </Stack>
  );
  const renderFormAuth = (
    <Stack spacing={2}>
      {!!errorMsg && (
        <Alert severity="error">
          <div> {errorMsg} </div>
        </Alert>
      )}
      {/* <Alert severity="info">Sign in information</Alert> */}
      <Tooltip placement="top" title="admin email address to sign in">
        <RHFTextField lang="ar" name="email" label={`${t('email')} *`} />
      </Tooltip>
      <Tooltip placement="top" title="admin password to sign in">
        <RHFTextField
          lang="ar"
          name="password"
          label={`${t('password')} *`}
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
      </Tooltip>
      <Tooltip placement="top" title="admin confirm password to sign in">
        <RHFTextField
          lang="ar"
          name="confirmPassword"
          label={`${t('confirm password')} *`}
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
      </Tooltip>
      {renderTerms}

      <LoadingButton
        fullWidth
        lang="ar"
        color="inherit"
        size="large"
        type="submit"
        disabled={!agree}
        variant="contained"
        loading={isSubmitting}
      >
        {t('create account')}
      </LoadingButton>
      <Box sx={{ display: 'flex' }}>
        <Button
          color="inherit"
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
          // sx={{ m: 1 }}
        >
          {t('back')}
        </Button>
      </Box>
    </Stack>
  );

  return (
    <>
      {renderHead}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {page === 0 && renderForm}
        {page === 1 && renderFormEmployee}
        {page === 2 && renderFormAuth}
      </FormProvider>

      <Dialog open={dialog.value} onClose={dialog.onFalse} scroll="paper">
        <DialogTitle sx={{ pb: 2 }}>Subscribe</DialogTitle>

        <DialogContent dividers="paper">
          <DialogContentText tabIndex={-1}>
            {[...new Array(50)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join('\n')}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={dialog.onFalse}>Cancel</Button>

          <Button variant="contained" onClick={dialog.onFalse}>
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={policyDialog.value} onClose={policyDialog.onFalse} scroll="paper">
        <DialogTitle sx={{ pb: 2 }}>Subscribe</DialogTitle>

        <DialogContent dividers="paper">
          <DialogContentText tabIndex={-1}>
            {[...new Array(50)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join('\n')}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={policyDialog.onFalse}>Cancel</Button>

          <Button variant="contained" onClick={policyDialog.onFalse}>
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
