import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { matchIsValidTel } from 'mui-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

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
  Hidden,
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
  useGetEmployeeTypes,
} from 'src/api';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown/markdown';
import FormProvider, {
  RHFSelect,
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFPhoneNumber,
  RHFAutocomplete,
  // RHFSelectCard,
} from 'src/components/hook-form';
import Language from 'src/layouts/common/language-home-page';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { register } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(0);

  const { countriesData } = useGetCountries();
  const { unitserviceTypesData } = useGetActiveUSTypes();
  const { specialtiesData } = useGetSpecialties();
  const { employeeTypesData } = useGetEmployeeTypes();
  // const { freeSubscriptionsData } = useGetFreeSubscriptions();

  const searchParams = useSearchParams();

  const [agree, setAgree] = useState(false);

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();
  const dialog = useBoolean(true);
  const policyDialog = useBoolean();

  const RegisterSchema = Yup.object().shape({
    US_type: Yup.string().required(t('required field')),
    employees_number: Yup.string().required(t('required field')),

    us_name_arabic: Yup.string().required(t('required field')),
    us_name_english: Yup.string().required(t('required field')),
    // us_email: Yup.string()
    //   .required('unit of service email is required')
    //   .email('unit of service email must be a valid email address'),
    us_identification_num: Yup.string().required(t('required field')),
    us_country: Yup.string().nullable().required(t('required field')),
    us_city: Yup.string().required(t('required field')),
    // us_speciality: Yup.string().nullable(),
    us_sector_type: Yup.string().required(t('required field')),
    // us_phone: Yup.string().required('unit of service phone is required'),

    em_name_english: Yup.string()
      .required(t('required field'))
      .test('at-least-three-words', t('must be at least three words'), (value) => {
        if (!value) return false; // If no value, fail the validation
        const words = value.trim().split(/\s+/); // Split the input by spaces
        return words.length >= 3; // Return true if there are at least three words
      }),
    em_name_arabic: Yup.string()
      .required(t('required field'))
      .test('at-least-three-words', t('must be at least three words'), (value) => {
        if (!value) return false; // If no value, fail the validation
        const words = value.trim().split(/\s+/); // Split the input by spaces
        return words.length >= 3; // Return true if there are at least three words
      }),
    em_nationality: Yup.string().required(t('required field')),
    em_gender: Yup.string().required(t('required field')),
    em_identification_num: Yup.string()
      .required(t('required field'))
      .min(8, `${t('must be at least')} 8`)
      .max(15, `${t('must be at most')} 15`),
    em_profrssion_practice_num: Yup.string(),
    em_type: Yup.string().required(t('required field')),
    em_phone: Yup.string()
      .required(t('required field'))
      .test('is-valid-phone', t('Invalid phone number'), (value) => matchIsValidTel(value)),
    em_speciality: Yup.string().nullable(),
    visibility_US_page: Yup.bool(),
    visibility_online_appointment: Yup.bool(),

    email: Yup.string()
      .required(t('required field'))
      .email(t('Email must be a valid email address')),
    password: Yup.string().min(8, `${t('must be at least')} 8`),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('Passwords must match'))
      .min(8, `${t('must be at least')} 8`),
  });

  const defaultValues = {
    employees_number: '',
    us_name_arabic: '',
    us_name_english: '',
    // us_email: '',
    us_identification_num: '',
    us_country: '',
    us_city: '',
    US_type: '',
    // us_speciality: null,
    us_sector_type: '',
    // us_phone: '',
    em_name_english: '',
    em_name_arabic: '',
    em_nationality: '',
    em_identification_num: '',
    em_profrssion_practice_num: '',
    em_type: '',
    em_gender: '',
    em_phone: '',
    em_speciality: null,
    visibility_US_page: false,
    visibility_online_appointment: false,

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
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();

  const { tableData } = useGetCountryCities(values.us_country);

  const steps = [
    curLangAr
      ? unitserviceTypesData.find((type) => type._id === values.US_type)?.name_arabic
      : unitserviceTypesData.find((type) => type._id === values.US_type)?.name_english,
    t('manager'),
    t('account'),
  ];

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-()]*$/; // Range for Arabic characters
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

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('us_country', selectedCountryId, { shouldValidate: true });
    // setSelectedCountry(selectedCountryId);
    // setCities(tableData.filter((data)=>data?.country?._id === event.target.value))
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.({
        role: 'admin',
        userName: data.em_name_english,
        ...data,
      });

      router.push(paths.auth.verify(data.email) || returnTo || PATH_AFTER_SIGNUP);
    } catch (error) {
      console.error(error);
      // reset();

      setErrorMsg(curLangAr ? error.arabic_message || error.message : error.message);
    }
  });
  useEffect(() => {
    setErrorMsg();
    if (Object.keys(errors).length) {
      setErrorMsg(
        Object.keys(errors)
          .map((key, idx) => t(`${key}: ${errors?.[key]?.message || 'error'}`))
          .join('<br>')
      );
    }
  }, [errors, t]);
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 3, position: 'relative' }}>
    <Hidden smUp>
        <span>
          <Language />
        </span>
      </Hidden>

      <Typography variant="h4">
        {curLangAr ? 'التسجيل كوحدة خدمة' : 'Sign up as unit of service'}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography sx={{ mb: 3 }} variant="body2">
          {t('Already have an account?')}
        </Typography>
        <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
          {t('login')}
        </Link>
      </Stack>
      {values.US_type !== null && (
        <Stepper activeStep={page}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = { lang: 'ar' };
            return (
              <Step key={index} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}
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
    >
      <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />
      {t('I agree to')}
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
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: errorMsg }} />
        </Alert>
      )}
      {/* <Alert severity="info">unit of service information</Alert> */}
      {curLangAr && (
        // <Tooltip placement="top" title="unit of service name in arabic">
        <RHFTextField
          onChange={handleArabicInputChange}
          name="us_name_arabic"
          label={t('Arabic name of unit of service')}
          placeholder="عيادة الدكتور أحمد"
        />
        // </Tooltip>
      )}
      {/* <Tooltip placement="top" title="unit of service name in english"> */}
      <RHFTextField
        onChange={handleEnglishInputChange}
        name="us_name_english"
        label={t('English name of unit of service')}
        placeholder="Dr.Ahmad Clinic"
      />
      {/* </Tooltip> */}
      {!curLangAr && (
        // <Tooltip placement="top" title="unit of service name in arabic">
        <RHFTextField
          onChange={handleArabicInputChange}
          name="us_name_arabic"
          label={t('Arabic name of unit of service')}
          placeholder="عيادة الدكتور أحمد"
        />
        // </Tooltip>
      )}
      {/* <Tooltip placement="top" title="Identification number of unit of service"> */}
      <RHFTextField
        name="us_identification_num"
        label={t('The national number of the unit of service')}
      />
      {/* </Tooltip> */}
      {/* <Tooltip placement="top" title="Phone number of unit of service">
        <MuiTelInput
          forceCallingCode
          label={t('phone')}
          value={us_phone}
          onChange={(newPhone) => {
            matchIsValidTel(newPhone);
            setUSphone(newPhone);
            methods.setValue('us_phone', newPhone);
          }}
        />
      </Tooltip> */}

      {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Tooltip placement="top" title="email address of unit of service">
          <RHFTextField  name="us_email" label={t('email')} />
        </Tooltip>
      </Stack> */}
      {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}> */}
      {/* <Tooltip placement="top" title="country which unit of service placed"> */}
      <RHFSelect onChange={handleCountryChange} name="us_country" label={t('region ( country )')}>
        {countriesData.map((country, idx) => (
          <MenuItem lang="ar" key={idx} value={country._id}>
            {curLangAr ? country.name_arabic : country.name_english}
          </MenuItem>
        ))}
      </RHFSelect>
      {/* </Tooltip> */}
      {/* <Tooltip placement="top" title="city which unit of service placed"> */}
      <RHFSelect name="us_city" label={t('region ( city )')}>
        {tableData.map((city, idx) => (
          <MenuItem lang="ar" key={idx} value={city._id}>
            {curLangAr ? city.name_arabic : city.name_english}
          </MenuItem>
        ))}
      </RHFSelect>
      {/* </Tooltip> */}
      {/* </Stack> */}

      {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}> */}
      {/* <Tooltip placement="top" title="type of the unit of service">
          <RHFSelect  name="US_type" label={t('unit of service type')}>
            {unitserviceTypesData.map((type, idx) => (
              <MenuItem lang="ar"  key={idx} value={type._id}>
                {curLangAr ? type.name_arabic : type.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
        </Tooltip> */}
      {/* <Tooltip placement="top" title="unit of service speciality">
          <RHFSelect  name="us_speciality" label={t('speciality')}>
            {specialtiesData.map((specialty, idx) => (
              <MenuItem lang="ar"  key={idx} value={specialty._id}>
                {curLangAr ? specialty.name_arabic : specialty.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
        </Tooltip> */}
      {/* <Tooltip placement="top" title="unit of service sector type"> */}
      <RHFSelect name="us_sector_type" label={t('sector type')}>
        <MenuItem lang="ar" value="public">
          {t('Public')}
        </MenuItem>
        <MenuItem lang="ar" value="private">
          {t('private')}
        </MenuItem>
        <MenuItem lang="ar" value="non profit organization">
          {t('non profit organization')}
        </MenuItem>
      </RHFSelect>
      {/* </Tooltip> */}
      {/* </Stack> */}
      <LoadingButton
        sx={{ mt: 4 }}
        fullWidth
        disabled={
          !values.us_name_arabic ||
          !values.us_name_english ||
          !values.us_sector_type ||
          !values.us_city ||
          !values.us_country ||
          !values.us_identification_num
        }
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
          sx={{ mt: -1.5 }}
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
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: errorMsg }} />
        </Alert>
      )}
      {/* <Alert severity="info">Employee information</Alert> */}

      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(1, 1fr)',
        }}
      >
        {curLangAr && (
          // <Tooltip placement="top" title="admin middle name - father name -">
          <RHFTextField
            onChange={handleArabicInputChange}
            name="em_name_arabic"
            label={t('Manager full name in Arabic')}
            placeholder="أحمد سالم القناص"
          />
          // {/* </Tooltip> */}
        )}
        {/* <Tooltip placement="top" title="admin first name"> */}
        <RHFTextField
          onChange={handleEnglishInputChange}
          name="em_name_english"
          label={t('Manager full name in English')}
          placeholder="Ahmad Salem Al-kanas"
        />
        {/* </Tooltip> */}
        {!curLangAr && (
          // <Tooltip placement="top" title="admin middle name - father name -">
          <RHFTextField
            onChange={handleArabicInputChange}
            name="em_name_arabic"
            label={t('Manager full name in Arabic')}
            placeholder="أحمد سالم القناص"
          />
          // </Tooltip>
        )}
        {/* <Tooltip placement="top" title="admin family name">
          <RHFTextField
            
            onChange={handleEnglishInputChange}
            name="em_family_name"
            label={t('family name')}
          />
        </Tooltip> */}
        <RHFAutocomplete
          name="em_type"
          label={t('employee type')}
          options={employeeTypesData.map((one) => one._id)}
          getOptionLabel={(option) =>
            employeeTypesData.find((one) => one._id === option)?.[
              curLangAr ? 'name_arabic' : 'name_english'
            ]
          }
          renderOption={(props, option, idx) => (
            <li {...props} key={idx} value={option}>
              {
                employeeTypesData.find((one) => one._id === option)?.[
                  curLangAr ? 'name_arabic' : 'name_english'
                ]
              }
            </li>
          )}
        />
        {employeeTypesData
          .find((type) => type._id === values.em_type)
          ?.name_english?.toLowerCase() === 'doctor' && (
          // <Tooltip placement="top" title="speciality of admin">
          <RHFAutocomplete
            name="em_speciality"
            label={`${t('speciality')} *`}
            options={specialtiesData.map((speciality) => speciality._id)}
            getOptionLabel={(option) =>
              specialtiesData.find((one) => one._id === option)?.[
                curLangAr ? 'name_arabic' : 'name_english'
              ]
            }
            renderOption={(props, option, idx) => (
              <li {...props} key={idx} value={option}>
                {
                  specialtiesData.find((one) => one._id === option)?.[
                    curLangAr ? 'name_arabic' : 'name_english'
                  ]
                }
              </li>
            )}
          />
          // </Tooltip>
        )}
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
        {/* <Tooltip placement="top" title="admin nationality"> */}
        <RHFSelect name="em_nationality" label={t('nationality')}>
          {countriesData.map((country, idx) => (
            <MenuItem lang="ar" key={idx} value={country._id}>
              {curLangAr ? country.name_arabic : country.name_english}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFSelect name="em_gender" label={t('gender')}>
          {['male', 'female'].map((gender, idx) => (
            <MenuItem lang="ar" key={idx} value={gender}>
              {t(gender)}
            </MenuItem>
          ))}
        </RHFSelect>
        {/* </Tooltip> */}
        {/* <Tooltip placement="top" title="admin identification number"> */}
        <RHFTextField name="em_identification_num" label={t('identification number of manager')} />
        {/* </Tooltip> */}
        {employeeTypesData
          .find((type) => type._id === values.em_type)
          ?.name_english?.toLowerCase() === 'doctor' && (
          // <Tooltip placement="top" title="admin proffession practice number">
          <RHFTextField name="em_profrssion_practice_num" label={t('profession practice number')} />
          // </Tooltip>
        )}
        {/* <Tooltip placement="top" title="admin phone number"> */}
        <RHFPhoneNumber name="em_phone" label={t('phone number')} />
        <div>
          <RHFCheckbox
            sx={{ px: 2 }}
            name="visibility_US_page"
            onChange={() => setValue('visibility_US_page', !values.visibility_US_page)}
            label={
              <Typography sx={{ fontSize: 12 }}>
                {t('visible on unit of service online page')}
              </Typography>
            }
          />
          <RHFCheckbox
            sx={{ px: 2 }}
            name="visibility_online_appointment"
            onChange={() =>
              setValue('visibility_online_appointment', !values.visibility_online_appointment)
            }
            label={
              <Typography sx={{ fontSize: 12 }}>{t('visible on online appointments')}</Typography>
            }
          />
        </div>
      </Box>

      <LoadingButton
        sx={{ mt: 4 }}
        fullWidth
        disabled={
          !values.em_gender ||
          !values.em_name_arabic ||
          !values.em_name_english ||
          !values.em_identification_num ||
          !values.em_nationality ||
          !values.em_type ||
          !values.em_phone ||
          !matchIsValidTel(values.em_phone) ||
          values.em_name_arabic.trim().split(/\s+/)?.length < 3 ||
          values.em_name_english.trim().split(/\s+/)?.length < 3
        }
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
          sx={{ mt: -1.5 }}
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
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: errorMsg }} />
        </Alert>
      )}
      {curLangAr && (
        // <Tooltip placement="top" title="admin middle name - father name -">
        <RHFTextField
          disabled
          // onChange={handleArabicInputChange}
          name="em_name_arabic"
          // label={t('Manager full name in Arabic')}
          // placeholder="أحمد سالم القناص"
        />
        // {/* </Tooltip> */}
      )}
      {/* <Tooltip placement="top" title="admin first name"> */}
      <RHFTextField
        disabled
        // onChange={handleEnglishInputChange}
        name="em_name_english"
        // label={t('Manager full name in English')}
        // placeholder="Ahmad Salem Al-kanas"
      />
      {/* </Tooltip> */}
      {!curLangAr && (
        // <Tooltip placement="top" title="admin middle name - father name -">
        <RHFTextField
          disabled
          // onChange={handleArabicInputChange}
          name="em_name_arabic"
          // label={t('Manager full name in Arabic')}
          // placeholder="أحمد سالم القناص"
        />
        // </Tooltip>
      )}
      {/* <Tooltip placement="top" title="admin email address to sign in"> */}
      <RHFTextField name="email" label={t('email')} />
      {/* </Tooltip> */}
      {/* <Tooltip placement="top" title="admin password to sign in"> */}
      <RHFTextField
        name="password"
        label={t('password')}
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
      {/* </Tooltip> */}
      {/* <Tooltip placement="top" title="admin confirm password to sign in"> */}
      <RHFTextField
        name="confirmPassword"
        label={t('confirm password')}
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
      {/* <Typography color="primary" variant="body2">
        {t('Select Free Subscription')}
      </Typography>
      <RHFSelectCard name="free_subscription" options={freeSubscriptionsData} /> */}
      {/* </Tooltip> */}
      {renderTerms}

      <LoadingButton
        sx={{ mt: 4 }}
        fullWidth
        disabled={!values.email || !values.password || !values.confirmPassword || !agree}
        color="inherit"
        size="large"
        type="submit"
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
          sx={{ mt: -1.5 }}
        >
          {t('back')}
        </Button>
      </Box>
    </Stack>
  );

  const htmlContentAR = `
<br/>
<br/>

<p>تنقسم هذة المرحلة إلى 3 خطوات </p>
<br/>
<ul>
<li> <strong> الخطوة الأولى: </strong>  تتطلب من المستخدم بيانات ومعلومات وحدة الخدمة مثل : الرقم الوطني للمنشأة  </li>
<li> <strong> الخطوة الثانية: </strong> تتطلب من المستخدم معلومات مدير العيادة مثل : الرقم الوطني و رقم ممارسة المهنة .. </li>
<li> <strong> المرحلة الثالثة: </strong> تتطلب معلومات الدخول للصفحة مثل: البريد الالكتروني و كلمة المرور </li>
</ul>

<br/>
<br/>
<br/>
<p>لإنشاء وحدة خدمة جديدة سوف تحتاج :</p>

<br/>

<ul>
  <li>
    الرقم الوطني للمنشأة
  </li>
  <li>
    الرقم الوطني لإدارة المنشأة
  </li>
  <li>
    رقم ممارسة المهنة لمدير المنشأة (ان كان طبيبا)
  </li>
</ul>
`;
  const htmlContent = `
<br/>
<br/>

<p>You will create a new account for a "unit of service" (institution related to the healthcare sector), this process includes in 3 separate steps:</p>
<br/>
<ul>
<li> <strong> first step: </strong> You should write down required information about the new institution (like: name, and national number of the institution). </li>
<li> <strong> second step: </strong> You should register your personal information as a supervisor of the "new healthcare institution" in "Hakeemna.com" system, in this step you create a new user account  that has the role of ¨Admin¨and has a full access to all data related with the new institution in this system. Note:You should determine the function/ role of the "admin/ supervisor" in the "Hakeemna.com" system, where it could be manager, secretary, accountant, doctor, nurse,  or any other role.</li>
<li> <strong> third step: </strong> You should add login information for this Admin/supervisor user (unique email and password).</li>
</ul>

<br/>
<br/>
<br/>
<p>To create a  "unit of service" account, it is required to have the next information :</p>

<br/>

<ul>
  <li>
    The national number of the  new "unit of service"  (healthcare  institution) . 
  </li>
  <li>
    The personal identification number of the admin/supervisor of the  new "unit of service" (healthcare  institution) . 
  </li>
  <li>
    The profession practice (license) number of the  admin/supervisor (If it is mandatory to obtain this license to could practice the profession)
  </li>
</ul>
`;

  return (
    <>
      {renderHead}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {page === 0 && renderForm}
        {page === 1 && renderFormEmployee}
        {page === 2 && renderFormAuth}

        <Dialog open={dialog.value} scroll="paper">
          <DialogTitle sx={{ pb: 2 }}>{t('welcome to our community')}</DialogTitle>

          <DialogContent dividers>
            <div tabIndex={-1}>
              <Markdown children={curLangAr ? htmlContentAR : htmlContent} />
            </div>
            <span style={{ display: 'block', padding: 0.75, color: 'green', fontSize: 12 }}>
              {t('select your unit of service type')}
            </span>
            <RHFSelect sx={{ pb: 2 }} name={t('US_type')}>
              {unitserviceTypesData.map((type, idx) => (
                <MenuItem lang="ar" key={idx} value={type._id}>
                  {curLangAr ? type.name_arabic : type.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            <span style={{ display: 'block', padding: 0.75, color: 'green', fontSize: 12 }}>
              {t('select the approximate number of your employees')}
            </span>
            <RHFRadioGroup
              row
              name="employees_number"
              spacing={3}
              options={[
                { value: '3', label: `1-3 ${t('employees')}` },
                { value: '5', label: `3-10 ${t('employees')}` },
                { value: '10', label: t('more than 10 employees') },
              ]}
            />
          </DialogContent>

          <DialogActions>
            {/* <Button onClick={dialog.onFalse}>Cancel</Button> */}

            <Button
              disabled={!values.employees_number || !values.US_type}
              variant="contained"
              onClick={dialog.onFalse}
            >
              {t('I understand')}
            </Button>
          </DialogActions>
        </Dialog>
      </FormProvider>
      <Dialog open={policyDialog.value} onClose={policyDialog.onFalse} scroll="paper">
        <DialogTitle sx={{ pb: 2 }}>Subscribe</DialogTitle>

        <DialogContent dividers>
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
