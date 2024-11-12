import * as Yup from 'yup';
import { decode } from 'he';
import PropTypes from 'prop-types';
import { useEffect, useCallback, useMemo } from 'react';
import { matchIsValidTel } from 'mui-tel-input';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Chip, MenuItem, Typography, InputAdornment } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetKeywords,
  useGetCountries,
  // useGetCurrencies,
  useGetSpecialties,
  useGetActiveEmployeeTypes,
} from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFUploadBox,
  RHFPhoneNumber,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

import Others from './other';
import Certifications from './certifications';
import ProfessionalMembership from './professional-membership';
// ----------------------------------------------------------------------

const languages = [
  'English',
  'العربية', // Arabic
  'Français', // French
  'Deutsch', // German
  'Español', // Spanish
  'Italiano', // Italian
  '中文', // Chinese (Mandarin)
  'हिन्दी', // Hindi
  'Português', // Portuguese
  'বাংলা', // Bengali
  'Pусский', // Russian
  '日本語', // Japanese
  'Język polski', // Polish
  'Bahasa Indonesia', // Indonesian
  'Türkçe', // Turkish
  '한국어', // Korean
  'فارسی', // Persian (Farsi)
  'Tiếng Việt', // Vietnamese
  'ไทย', // Thai
  'Nederlands', // Dutch
  'Svenska', // Swedish
  'עברית', // Hebrew
  'Dansk', // Danish
  'Ελληνικά', // Greek
  'Suomi', // Finnish
  'Magyar', // Hungarian
  'Čeština', // Czech
  'Filipino', // Filipino (Tagalog)
  'Română', // Romanian
  'Bahasa Melayu', // Malay
  'Українська', // Ukrainian
  'Kiswahili', // Swahili
  'ភាសាខ្មែរ', // Khmer (Cambodian)
  'తెలుగు', // Telugu
  'Bahasa Jawa', // Javanese
  'ಕನ್ನಡ', // Kannada
  'ਪੰਜਾਬੀ', // Punjabi
  'മലയാളം', // Malayalam
  'اردو', // Urdu
  'සිංහල', // Sinhala
  'ગુજરાતી', // Gujarati
  'தமிழ்', // Tamil
  'བོད་སྐད་', // Tibetan
  'Монгол хэл', // Mongolian
  'isiZulu', // Zulu
  'isiXhosa', // Xhosa
  'Igbo', // Igbo
  'Hausa', // Hausa
  'Yorùbá', // Yoruba
];

export default function AccountGeneral({ employeeData, refetch }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });
  const { specialtiesData } = useGetSpecialties({ select: 'name_english name_arabic' });
  const { employeeTypesData } = useGetActiveEmployeeTypes();
  // const { currencies } = useGetCurrencies();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const UpdateUserSchema = Yup.object().shape({
    employee_type: Yup.string().required(t('required field')),
    email: Yup.string().required(t('required field')),
    title: Yup.string(),
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
    nationality: Yup.string().required(t('required field')),
    profrssion_practice_num: Yup.string(),
    identification_num: Yup.string()
      .required(t('required field'))
      .min(8, `${t('must be at least')} 8`)
      .max(15, `${t('must be at most')} 15`),
    tax_num: Yup.string(),
    phone: Yup.string()
      .required(t('required field'))
      .test('is-valid-phone', t('Invalid phone number'), (value) => matchIsValidTel(value)),
    mobile_num: Yup.string(),
    speciality: Yup.string().nullable(),
    gender: Yup.string().required(t('required field')),
    birth_date: Yup.mixed().required(t('required field')),
    Bachelor_year_graduation: Yup.number(),
    University_graduation_Bachelor: Yup.string(),
    University_graduation_Specialty: Yup.string(),
    about_me: Yup.string(),
    arabic_about_me: Yup.string(),
    scanned_identity: Yup.mixed().nullable(),
    signature: Yup.mixed().nullable(),
    stamp: Yup.mixed().nullable(),
    picture: Yup.mixed().nullable(),
    languages: Yup.array().required(t('required field')),
    certifications: Yup.array(),
    memberships: Yup.array(),
    other: Yup.array(),
    keywords: Yup.array(),
    arabic_keywords: Yup.array(),
    fees: Yup.number().required(t('required field')),
    fees_after_discount: Yup.number(),
    // currency: Yup.string().required(t('required field')),
  });

  const defaultValues = useMemo(() => ({
    employee_type: employeeData?.employee_type?._id || null,
    email: employeeData?.email || '',
    name_english: employeeData?.name_english || '',
    name_arabic: employeeData?.name_arabic || '',
    nationality: employeeData?.nationality?._id || '',
    profrssion_practice_num: employeeData?.profrssion_practice_num || '',
    identification_num: employeeData?.identification_num || '',
    tax_num: employeeData?.tax_num || '',
    phone: employeeData?.phone || '',
    mobile_num: employeeData?.mobile_num || '',
    speciality: employeeData?.speciality?._id || null,
    gender: employeeData?.gender || '',
    birth_date: employeeData?.birth_date || null,
    // Bachelor_year_graduation: employeeData?.Bachelor_year_graduation || '',
    // University_graduation_Bachelor: employeeData?.University_graduation_Bachelor || '',
    // University_graduation_Specialty: employeeData?.University_graduation_Specialty || '',
    scanned_identity: employeeData?.scanned_identity || null,
    signature: employeeData?.signature || null,
    stamp: employeeData?.stamp || null,
    picture: employeeData?.picture || null,
    about_me: employeeData?.about_me ? decode(employeeData?.about_me) : '',
    arabic_about_me: employeeData?.arabic_about_me ? decode(employeeData?.arabic_about_me) : '',
    languages: employeeData?.languages || [],
    arabic_keywords: employeeData?.arabic_keywords || [],
    keywords: employeeData?.keywords || [],
    memberships: employeeData?.memberships?.length
      ? employeeData?.memberships
      : [{ name: '', institution: '' }],
    other: employeeData?.other?.length ? employeeData?.other : [{ kind: '', name: '' }],
    certifications: employeeData?.certifications?.length
      ? employeeData?.certifications
      : [
        {
          name: '',
          institution: '',
          year: null,
        },
      ],
    fees: user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.fees || 0,
    fees_after_discount: user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.fees_after_discount || 0,
    // currency:
    //   user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.currency ||
    //   currencies?.[0]?._id,
  }), [user?.employee, employeeData]);
  
  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key, idx) =>
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
      );
    }
  }, [errors, enqueueSnackbar]);

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const values = watch();

  const { keywordsData } = useGetKeywords();
  // const { arabicKeywordsData } = useGetArabicKeywrds();

  const handleDrop = useCallback(
    async (name, acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue(name, newFile, { shouldValidate: true });
        try {
          const formData = new FormData();
          formData.append(name, newFile);
          await axios.patch(
            endpoints.employees.one(employeeData._id),
            // ...data,
            formData
          );
          enqueueSnackbar(t('updated successfully!'));
          refetch();
        } catch (error) {
          // error emitted in backend
          enqueueSnackbar(
            curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
            {
              variant: 'error',
            }
          );
          console.error(error);
        }
      }
    },
    // eslint-disable-next-line
    [setValue, curLangAr, employeeData, enqueueSnackbar, refetch, values, t]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const dataToSubmit = data;
      delete dataToSubmit.picture;
      delete dataToSubmit.scanned_identity;
      delete dataToSubmit.signature;
      delete dataToSubmit.stamp;
      await axios.patch(endpoints.employees.one(employeeData._id), dataToSubmit);
      await axios.patch(
        endpoints.employee_engagements.one(
          user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
        ),
        { fees: data.fees, fees_after_discount: data.fees_after_discount, currency: data?.currency }
      );
      enqueueSnackbar(t('updated successfully!'));
      refetch();
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      console.error(error);
    }
  });

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* img */}
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 5, height: { md: '100%' }, pb: { xs: 5 }, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              // helperText={
              //   <Typography
              //     variant="caption"
              //     sx={{
              //       mt: 3,
              //       mx: 'auto',
              //       display: 'block',
              //       textAlign: 'center',
              //       color: 'text.disabled',
              //     }}
              //   >
              //     max size of {fData(3145728)}
              //   </Typography>
              // }
              maxSize={3145728}
              name="picture"
              onDrop={(acceptedFiles) => handleDrop('picture', acceptedFiles)}
            />
            <Box
              rowGap={3}
              columnGap={2}
              sx={{ mt: 5 }}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField
                variant="filled"
                name="name_english"
                onChange={handleEnglishInputChange}
                label={t('Full name in English')}
                helperText={t('should include title like : doctor, specialist,...')}
              />
              <RHFTextField
                variant="filled"
                name="name_arabic"
                onChange={handleArabicInputChange}
                label={t('Full name in Arabic')}
                helperText={t('should include title like : doctor, specialist,...')}
              />
              <RHFSelect
                disabled
                variant="filled"
                label={t('nationality')}
                fullWidth
                name="nationality"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {countriesData.map((country, idx) => (
                  <MenuItem lang="ar" key={idx} value={country._id}>
                    {curLangAr ? country.name_arabic : country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <TextField
                // disabled
                variant="filled"
                name="identification_num"
                label={`${t('ID number')} :`}
                value={values.identification_num}
              />
              <TextField
                // disabled
                variant="filled"
                name="profrssion_practice_num"
                label={`${t('profrssion practice number')} :`}
              // value={values.profrssion_practice_num}
              />
              <TextField
                // disabled
                type="email"
                variant="filled"
                name="email"
                label={`${t('email')} :`}
                value={values.email}
              />
              <RHFPhoneNumber name="phone" label={t('phone number')} />
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                <Box>
                  <RHFUploadBox
                    sx={{
                      mx: 'auto',
                    }}
                    name="scanned_identity"
                    label={t('scanned ID')}
                    onDrop={(acceptedFiles) => handleDrop('scanned_identity', acceptedFiles)}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      mx: 'auto',
                      mb: 1,
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {t('scanned ID')}
                  </Typography>
                  {values.scanned_identity && <Iconify icon="flat-color-icons:ok" />}
                </Box>
                <Box>
                  <RHFUploadBox
                    sx={{
                      mx: 'auto',
                    }}
                    name="signature"
                    label={t('signature')}
                    onDrop={(acceptedFiles) => handleDrop('signature', acceptedFiles)}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      mx: 'auto',
                      mb: 1,
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {t('signature')}
                  </Typography>
                  {values.signature && <Iconify icon="flat-color-icons:ok" />}
                </Box>
                <Box>
                  <RHFUploadBox
                    sx={{
                      mx: 'auto',
                    }}
                    name="stamp"
                    label={t('stamp')}
                    onDrop={(acceptedFiles) => handleDrop('stamp', acceptedFiles)}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      mx: 'auto',
                      mb: 1,
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {t('stamp')}
                  </Typography>
                  {values.stamp && <Iconify icon="flat-color-icons:ok" />}
                </Box>
              </Box>
              <RHFTextField
                type="number"
                name="fees"
                label={t('fees')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">JOD</InputAdornment>,
                }}
              />
              <RHFTextField
                type="number"
                name="fees_after_discount"
                label={t('fees after discount')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">JOD</InputAdornment>,
                }}
              />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3, pt: 5 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField type="number" name="tax_num" label={t('tax number')} />
              <RHFPhoneNumber name="mobile_num" label={t('alternative mobile number')} />
              <RHFAutocomplete
                name="speciality"
                label={t('speciality')}
                options={specialtiesData.map((speciality) => speciality._id)}
                getOptionLabel={(option) =>
                  specialtiesData.find((one) => one._id === option)?.[
                  curLangAr ? 'name_arabic' : 'name_english'
                  ]
                }
                renderOption={(props, option, idx) => (
                  <li lang="ar" {...props} key={idx} value={option}>
                    {
                      specialtiesData.find((one) => one._id === option)?.[
                      curLangAr ? 'name_arabic' : 'name_english'
                      ]
                    }
                  </li>
                )}
              />
              <RHFSelect
                label={t('gender')}
                fullWidth
                name="gender"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                <MenuItem lang="ar" value="male">
                  {t('male')}
                </MenuItem>
                <MenuItem lang="ar" value="female">
                  {t('female')}
                </MenuItem>
              </RHFSelect>
              <RHFAutocomplete
                name="employee_type"
                label={t('employee type')}
                options={employeeTypesData.map((one) => one._id)}
                getOptionLabel={(option) =>
                  employeeTypesData.find((one) => one._id === option)?.[
                  curLangAr ? 'name_arabic' : 'name_english'
                  ]
                }
                renderOption={(props, option, idx) => (
                  <li lang="ar" {...props} key={idx} value={option}>
                    {
                      employeeTypesData.find((one) => one._id === option)?.[
                      curLangAr ? 'name_arabic' : 'name_english'
                      ]
                    }
                  </li>
                )}
              />
              <Controller
                name="birth_date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label={t('birth date')}
                    // sx={{ flex: 1 }}
                    value={new Date(values.birth_date ? values.birth_date : '')}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>
            <RHFAutocomplete
              sx={{ mt: 3 }}
              name="languages"
              label={t('languages')}
              multiple
              disableCloseOnSelect
              options={languages.filter(
                (option) => !values.languages.some((item) => option === item)
              )}
              getOptionLabel={(option) => option}
              renderOption={(props, option, idx) => (
                <li lang="ar" {...props} key={idx} value={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />
            {/* <RHFTextField multiline sx={{ mt: 3 }} rows={2} name="address" label={t('address')} /> */}
            <RHFEditor
              lang="en"
              name="about_me"
              label={t('english about me')}
              sx={{ mt: 2, textTransform: 'lowercase' }}
            />
            <RHFEditor
              lang="en"
              name="arabic_about_me"
              label={t('arabic about me')}
              sx={{ mt: 2, textTransform: 'lowercase' }}
            />
            {/* <RHFTextField
              multiline
              sx={{ mt: 3 }}
              rows={3}
              name="about_me"
              label={t('english about me')}
              onChange={handleEnglishInputChange}
            />
            <RHFTextField
              multiline
              sx={{ mt: 3 }}
              rows={3}
              name="arabic_about_me"
              label={t('arabic about me')}
              onChange={handleArabicInputChange}
            /> */}

            <Certifications />
            <ProfessionalMembership />
            <Others />

            <RHFAutocomplete
              sx={{ mb: 3 }}
              name="keywords"
              label={t('keywords')}
              multiple
              freeSolo
              disableCloseOnSelect
              placeholder={t('type then press enter to create new')}
              options={keywordsData.filter(
                (option) => !values.keywords.some((item) => option === item)
              )}
              getOptionLabel={(option) => option}
              renderOption={(props, option, idx) => (
                <li lang="ar" {...props} key={idx} value={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />
            {/* <RHFAutocomplete
              sx={{ mb: 3 }}
              name="arabic_keywords"
              label={t('arabic keywords')}
              multiple
              freeSolo
              disableCloseOnSelect
              options={arabicKeywordsData.filter(
                (option) => !values.keywords.some((item) => option === item)
              )}
              getOptionLabel={(option) => option}
              renderOption={(props, option, idx) => (
                <li lang='ar' {...props} key={idx} value={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {t('save changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
AccountGeneral.propTypes = {
  employeeData: PropTypes.object,
  refetch: PropTypes.func,
};
