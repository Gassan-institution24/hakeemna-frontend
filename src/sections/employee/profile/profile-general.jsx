import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { matchIsValidTel } from 'mui-tel-input';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Chip, MenuItem, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import axios, { endpoints } from 'src/utils/axios';

// import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetCountries, useGetSpecialties, useGetActiveEmployeeTypes } from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadBox,
  RHFPhoneNumber,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
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

  // const { user } = useAuthContext();

  const { countriesData } = useGetCountries();
  const { specialtiesData } = useGetSpecialties();
  const { employeeTypesData } = useGetActiveEmployeeTypes();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const UpdateUserSchema = Yup.object().shape({
    employee_type: Yup.string().required(t('required field')),
    email: Yup.string().required(t('required field')),
    name_english: Yup.string().required(t('required field')),
    name_arabic: Yup.string(),
    nationality: Yup.string().required(t('required field')),
    profrssion_practice_num: Yup.string().required(t('required field')),
    identification_num: Yup.string().required(t('required field')),
    tax_num: Yup.string(),
    phone: Yup.string()
      .required(t('required field'))
      .test('is-valid-phone', t('Invalid phone number'), (value) => matchIsValidTel(value)),
    mobile_num: Yup.string(),
    speciality: Yup.string().required(t('required field')),
    gender: Yup.string().required(t('required field')),
    birth_date: Yup.date().required(t('required field')),
    Bachelor_year_graduation: Yup.number(),
    University_graduation_Bachelor: Yup.string(),
    University_graduation_Specialty: Yup.string(),
    about_me: Yup.string(),
    scanned_identity: Yup.mixed().nullable(),
    signature: Yup.mixed().nullable(),
    stamp: Yup.mixed().nullable(),
    picture: Yup.mixed().nullable(),
    languages: Yup.array().required(t('required field')),
  });

  const defaultValues = {
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
    Bachelor_year_graduation: employeeData?.Bachelor_year_graduation || '',
    University_graduation_Bachelor: employeeData?.University_graduation_Bachelor || '',
    University_graduation_Specialty: employeeData?.University_graduation_Specialty || '',
    scanned_identity: employeeData?.scanned_identity || null,
    signature: employeeData?.signature || null,
    stamp: employeeData?.stamp || null,
    picture: employeeData?.picture || null,
    about_me: employeeData?.about_me || '',
    languages: employeeData?.languages || [],
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleDrop = useCallback(
    (name, acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue(name, newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((value, index) => {
            formData.append(`${key}[${index}]`, value);
          });
        } else if (data[key] !== defaultValues[key]) {
          formData.append(key, data[key]);
        }
      });
      await axios.patch(endpoints.employees.one(employeeData._id), formData);
      enqueueSnackbar(t('updated successfully!'));
      refetch();
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      console.error(error);
    }
  });

  // const handleEnglishInputChange = (event) => {
  //   // Validate the input based on English language rules
  //   const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow letters and spaces

  //   if (englishRegex.test(event.target.value)) {
  //     methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
  //   }
  // };

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
                disabled
                variant="filled"
                name="identification_num"
                label={`${t('ID number')} :`}
              />
              <RHFTextField
                disabled
                variant="filled"
                name="profrssion_practice_num"
                label={`${t('profrssion practice number')} :`}
              />
              <RHFTextField
                disabled
                type="email"
                variant="filled"
                name="email"
                label={`${t('email')} :`}
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
              <RHFTextField name="name_english" label={`${t('Full name in English')} *`} />
              <RHFTextField name="name_arabic" label={t('Full name in Arabic')} />
              <RHFSelect
                label={`${t('nationality')} *`}
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
              <RHFTextField type="number" name="tax_num" label={t('tax number')} />
              <RHFPhoneNumber name="mobile_num" label={t('alternative mobile number')} />
              <RHFSelect
                label={`${t('specialty')} *`}
                fullWidth
                name="speciality"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {specialtiesData.map((specialty, idx) => (
                  <MenuItem lang="ar" value={specialty._id} key={idx}>
                    {curLangAr ? specialty.name_arabic : specialty.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                label={`${t('gender')} *`}
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
              <RHFSelect
                label={`${t('employee type')} *`}
                fullWidth
                name="employee_type"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {employeeTypesData.map((type, idx) => (
                  <MenuItem lang="ar" value={type._id} key={idx}>
                    {curLangAr ? type.name_arabic : type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                type="number"
                name="Bachelor_year_graduation"
                label={t('bachelor year graduation')}
              />
              <RHFTextField
                name="University_graduation_Bachelor"
                label={t('university graduation bachelor')}
              />
              <RHFTextField
                name="University_graduation_Specialty"
                label={t('university graduation specialty')}
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
              label={`${t('languages')} *`}
              multiple
              disableCloseOnSelect
              options={languages.filter(
                (option) => !values.languages.some((item) => option === item)
              )}
              getOptionLabel={(option) => option}
              renderOption={(props, option, idx) => (
                <li {...props} key={idx} value={option}>
                  {option}
                </li>
              )}
              onChange={(event, newValue) => {
                // setSelectedEmployees(newValue);
                methods.setValue('languages', newValue, { shouldValidate: true });
              }}
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
            <RHFTextField multiline sx={{ mt: 3 }} rows={2} name="address" label={t('address')} />
            <RHFTextField multiline sx={{ mt: 3 }} rows={3} name="about_me" label={t('about me')} />

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
