import * as Yup from 'yup';
import { decode } from 'he';
import PropTypes from 'prop-types';
import { matchIsValidTel } from 'mui-tel-input';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Chip,
  Button,
  Divider,
  Tooltip,
  MenuItem,
  Typography,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';
import {
  useGetKeywords,
  useGetCountries,
  // useGetCurrencies,
  useGetSpecialties,
  useGetEmployeeEngagement,
  useGetEmployeeWorkGroups,
} from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import PageSelector from 'src/components/pageSelector';
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
  const router = useRouter();
  const [page, setPage] = useState('information');
  const employeeEng = employeeData?.employee_engagements?.[employeeData.selected_engagement];
  const { data: employeeEngData } = useGetEmployeeEngagement(employeeEng?._id);
  const { workGroupsData } = useGetEmployeeWorkGroups(employeeEng?._id);

  const { data: employeeEngagementData } = useGetEmployeeEngagement(employeeEng?._id);

  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });
  const { specialtiesData } = useGetSpecialties({ select: 'name_english name_arabic' });
  // const { currencies } = useGetCurrencies();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const pages = [
    { label: t('General Information'), active: page === 'information' },
    { label: t('Profession Practice Profile'), active: page === 'profile' },
    { label: t('Verification Document'), active: page === 'verification' },
  ];

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
    identification_num: Yup.string(),
    tax_num: Yup.string(),
    phone: Yup.string()
      .required(t('required field'))
      .test('is-valid-phone', t('Invalid phone number'), (value) => matchIsValidTel(value)),
    mobile_num: Yup.string(),
    speciality: Yup.string().nullable(),
    gender: Yup.string(),
    birth_date: Yup.mixed(),
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

  const defaultValues = useMemo(
    () => ({
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
      fees: employeeEngagementData?.fees || 0,
      fees_after_discount: employeeEngagementData?.fees_after_discount || 0,
      // currency:
      //   user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.currency ||
      //   currencies?.[0]?._id,
    }),
    [employeeEngagementData, employeeData]
  );

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
    reset(defaultValues);
  }, [defaultValues, reset]);

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
      await axios.patch(endpoints.employee_engagements.one(employeeEng?._id), {
        fees: data.fees,
        fees_after_discount: data.fees_after_discount,
        currency: data?.currency,
      });
      enqueueSnackbar(t('updated successfully!'));
      refetch();
      router.push(
        paths.pages.doctor(
          `${employeeEng._id}_${employeeData?.[t('name_english')]?.replace(
            / /g,
            '-'
          )}_${employeeData?.speciality?.[t('name_english')]?.replace(/ /g, '-')}`
        )
      );
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
  const handleBack = () => {
    if (page === 'profile') setPage('information');
    if (page === 'verification') setPage('profile');
  };
  const handleNext = async () => {
    if (page === 'information') {
      setPage('profile');
    }
    if (page === 'profile') {
      setPage('verification');
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <PageSelector pages={pages} />
        <br />
        {page === 'information' && (
          <Box sx={{ px: 3 }}>
            <Typography mb={2} variant="h6">
              {t('General Information')}
            </Typography>
            <Box
              mt={4}
              rowGap={3}
              columnGap={2}
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
            >
              <Box sx={{ width: '100%', flex: 1 }}>
                <RHFUploadAvatar
                  maxSize={3145728}
                  name="picture"
                  onDrop={(acceptedFiles) => handleDrop('picture', acceptedFiles)}
                />
              </Box>
              <Box sx={{ width: '100%', flex: 2 }}>
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
                    name="name_english"
                    onChange={handleEnglishInputChange}
                    label={t('Full name in English')}
                  />
                  <RHFTextField
                    name="name_arabic"
                    onChange={handleArabicInputChange}
                    label={t('Full name in Arabic')}
                  />
                </Box>
                <Typography variant="caption" sx={{ fontSize: 11 }} color="primary.main">
                  {t(
                    'If you want your name to appear with a title (such as: Doctor, Consultant, etc.), in this case you must write the title and then your full name (for example: Consultant Muhammad Ahmad Ali).'
                  )}
                </Typography>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  sx={{ mt: 3 }}
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  }}
                >
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
                  <Controller
                    name="birth_date"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label={t('birth date')}
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
                  <RHFSelect
                    disabled
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
                </Box>
              </Box>
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              sx={{ width: '100%', mt: 4 }}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField type="email" name="email" label={`${t('email')} :`} />
              <RHFPhoneNumber name="phone" label={t('phone number')} />
              <RHFPhoneNumber name="mobile_num" label={t('alternative mobile number')} />
              <RHFTextField name="identification_num" label={`${t('National ID number')} :`} />
              <RHFTextField
                name="profrssion_practice_num"
                label={`${t('profrssion practice number')} :`}
              />
              <RHFTextField type="number" name="tax_num" label={t('tax number')} />
            </Box>
            <Divider flexItem sx={{ borderStyle: 'solid', py: 3 }} />
            <Typography my={2} variant="h6">
              {t('Job Position Information')}
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              sx={{ width: '100%', mt: 4 }}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Stack direction="row" gap={2}>
                <Typography variant="subtitle2">{t('employee type')}:</Typography>
                <Typography variant="body2">
                  {employeeData?.employee_type?.[curLangAr ? 'name_arabic' : 'name_english']}
                </Typography>
              </Stack>
              {!!employeeEngData?.department && (
                <Stack direction="row" gap={2}>
                  <Typography variant="subtitle2">{t('department')}:</Typography>
                  <Typography variant="body2">
                    {employeeEngData?.department?.[curLangAr ? 'name_arabic' : 'name_english']}
                  </Typography>
                </Stack>
              )}
              {workGroupsData.length > 0 && (
                <Stack direction="row" gap={2}>
                  <Typography variant="subtitle2">{t('work groups')}:</Typography>
                  <Typography variant="body2">
                    {workGroupsData
                      .map((one) => one?.[curLangAr ? 'name_arabic' : 'name_english'])
                      .join(', ')}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>
        )}
        {page === 'profile' && (
          <>
            <Typography variant="h6">{t('Professional definition elements')}</Typography>
            <Typography variant="body1">
              {t("This information will appear in your profile on the platform's home page.")}
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              sx={{ mt: 2 }}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
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
              <RHFTextField
                type="number"
                name="fees"
                label={t('Examination price')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{t('JOD')}</InputAdornment>,
                }}
              />
              <Tooltip
                title={t(
                  'If you want to promote yourself and make a discount on the price of the examination, please write the price of the new examination'
                )}
              >
                <span>
                  <RHFTextField
                    type="number"
                    name="fees_after_discount"
                    label={t('Examination price after discount')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{t('JOD')}</InputAdornment>,
                    }}
                  />
                </span>
              </Tooltip>
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
            <Divider flexItem sx={{ borderStyle: 'solid', pt: 2 }} />
            <Typography sx={{ my: 2 }} variant="h6">
              {t('Introduction')}
            </Typography>
            <RHFEditor
              lang="en"
              name="about_me"
              label={t('english about me')}
              sx={{ mt: 2, textTransform: 'lowercase' }}
            />
            <RHFEditor
              lang="ar"
              name="arabic_about_me"
              label={t('arabic about me')}
              sx={{ mt: 2, textTransform: 'lowercase' }}
            />

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
          </>
        )}
        {page === 'verification' && (
          <Box sx={{ p: 1, px: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6">{t('Personal Authentication Elements')}</Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFUploadBox
                sx={{
                  mx: 'auto',
                }}
                name="scanned_identity"
                label={t('Personal ID or Syndicate membership')}
                onDrop={(acceptedFiles) => handleDrop('scanned_identity', acceptedFiles)}
              />
            </Box>
            <Divider flexItem sx={{ borderStyle: 'solid' }} />
            <Typography variant="h6">
              {t('Character authentication elements in documents')}
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <Tooltip
                title={t(
                  'This signature is what will appear on documents issued by you, such as a prescription document and a medical report.'
                )}
              >
                <span>
                  <RHFUploadBox
                    sx={{
                      mx: 'auto',
                    }}
                    name="signature"
                    label={t('signature')}
                    onDrop={(acceptedFiles) => handleDrop('signature', acceptedFiles)}
                  />
                </span>
              </Tooltip>
              <Tooltip
                title={t(
                  'This stamp is what will appear on documents issued by you, such as a prescription document and a medical report.'
                )}
              >
                <span>
                  <RHFUploadBox
                    sx={{
                      mx: 'auto',
                    }}
                    name="stamp"
                    label={t('stamp')}
                    onDrop={(acceptedFiles) => handleDrop('stamp', acceptedFiles)}
                  />
                </span>
              </Tooltip>
            </Box>
          </Box>
        )}

        <Stack spacing={3} direction="row" justifyContent="flex-end" gap={2} sx={{ mt: 3 }}>
          {page !== 'information' && (
            <Button variant="contained" color="warning" onClick={handleBack}>
              {t('Back')}
            </Button>
          )}
          {page !== 'verification' && (
            <Button variant="contained" color="secondary" onClick={handleNext}>
              {t('Next')}
            </Button>
          )}
          {page === 'verification' && (
            <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
              {t('save changes')}
            </LoadingButton>
          )}
        </Stack>
      </Card>
    </FormProvider>
  );
}
AccountGeneral.propTypes = {
  employeeData: PropTypes.object,
  refetch: PropTypes.func,
};
