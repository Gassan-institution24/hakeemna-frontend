import * as Yup from 'yup';
import { decode } from 'he';
import PropTypes from 'prop-types';
import { matchIsValidTel } from 'mui-tel-input';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Chip,
  Divider,
  Tooltip,
  MenuItem,
  Typography,
  InputAdornment,
} from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';
import {
  useGetKeywords,
  useGetCountries,
  useGetSpecialties,
  // useGetCurrencies,
  useGetEmployeeEngagement,
  useGetEmployeeWorkGroups,
} from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import { isDiallingCodeOnly } from 'src/components/hook-form/rhfPhoneNumberCustom';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFUploadBox,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFPhoneNumberCustom
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

// `section` comes from the profile rail, which already navigates — the form no longer carries
// its own wizard. The old three-step flow had no validation between steps (`handleNext` awaited
// nothing) and only offered Save on the last one, so a bad name entered on step one first
// surfaced as a toast after reaching step three.
/**
 * Drop rows where every value is blank.
 *
 * `certifications`, `memberships` and `other` each seed one empty row so the form has a line to
 * type into. Submitted untouched, that placeholder becomes a real stored record.
 */
const dropEmptyRows = (rows) =>
  (rows || []).filter((row) =>
    Object.values(row || {}).some((value) => value !== '' && value !== null && value !== undefined)
  );

export default function AccountGeneral({ employeeData, refetch, section = 'identity' }) {
  const { enqueueSnackbar } = useSnackbar();
  const employeeEng = employeeData?.employee_engagements?.[employeeData.selected_engagement];
  // One fetch, used for both the readout rows and the fees defaults — it was called twice with
  // the same argument under two names.
  const { data: employeeEngData } = useGetEmployeeEngagement(employeeEng?._id);
  const employeeEngagementData = employeeEngData;
  const { workGroupsData } = useGetEmployeeWorkGroups(employeeEng?._id);

  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });
  const { specialtiesData } = useGetSpecialties({ select: 'name_english name_arabic' });
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';


  const UpdateUserSchema = Yup.object().shape({
    // Not required: employee_type is shown as text (it is assigned by the clinic, not chosen
    // here) and nationality's select is disabled. Requiring a field with no usable input can only
    // block a save with nowhere to fix it.
    employee_type: Yup.string().nullable(),
    // Not required: there is no email input on this form any more (it is the login identity and
    // is changed elsewhere), so requiring it could only block a save with nowhere to fix it. The
    // format tests are kept so a value arriving from the server is still checked before it is
    // sent back.
    email: Yup.string()
      .test(
        'no-capital-letters',
        t('Email must not contain capital letters'),
        (value) => !value || !/[A-Z]/.test(value)
      )
      .test(
        'valid-email',
        t('Invalid email address'),
        (value) =>
          !value ||
          (/^[A-Za-z0-9]/.test(value) &&
            !/\s/.test(value) &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      ),
    title: Yup.string(),
    name_english: Yup.string()
      .required(t('required field'))
      .test('at-least-three-words', t('must be at least three words'), (value) => {
        if (!value) return false; // If no value, fail the validation
        const words = value.trim().split(/\s+/); // Split the input by spaces
        return words.length >= 3; // Return true if there are at least three words
      })
      .test(
        'valid-english-name',
        t('English letters only'),
        (value) =>
          !value ||
          (/^[A-Za-z]/.test(value) &&
            /^[A-Za-z\s.-]+$/.test(value) &&
            /[A-Za-z]$/.test(value) &&
            !/[-.]{2,}/.test(value))
      ),
    name_arabic: Yup.string()
      .required(t('required field'))
      .test('at-least-three-words', t('must be at least three words'), (value) => {
        if (!value) return false; // If no value, fail the validation
        const words = value.trim().split(/\s+/); // Split the input by spaces
        return words.length >= 3; // Return true if there are at least three words
      })
      .test(
        'valid-arabic-name',
        t('Arabic letters only'),
        (value) =>
          !value ||
          (/^[\u0600-\u06FF]/.test(value) &&
            /^[\u0600-\u06FF\s.-]+$/.test(value) &&
            /[\u0600-\u06FF]$/.test(value) &&
            !/[-.]{2,}/.test(value))
      ),
    nationality: Yup.string().nullable(),
    profrssion_practice_num: Yup.string(),
    identification_num: Yup.string(),
    // The input is type="number", and RHFTextField coerces with Number() — so type it as one.
    tax_num: Yup.number().nullable().transform((v) => (Number.isNaN(v) ? null : v)),
    // The control seeds '+962' so its flag button has something to show, which makes an untouched
    // field look filled. Report that as "required" rather than "invalid": the number is missing,
    // not wrong, and telling someone their empty field is invalid sends them looking for a typo.
    // Two tests rather than one, so the message matches the problem: a field holding only the
    // seeded dialling code is EMPTY, not wrong, and "Invalid phone number" would send someone
    // hunting for a typo in a field they never filled in. The first failure is the one reported.
    phone: Yup.string()
      .test('phone-required', t('required field'), (value) => !isDiallingCodeOnly(value))
      .test('phone-valid', t('Invalid phone number'), (value) =>
        isDiallingCodeOnly(value) ? true : matchIsValidTel(value)
      ),
    mobile_num: Yup.string().test('mobile', t('Invalid phone number'), (value) =>
      isDiallingCodeOnly(value) ? true : matchIsValidTel(value)
    ),
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
    formState: { isSubmitting, isDirty },
  } = methods;

  // Guarded on isDirty. handleDrop uploads a file and then refetches, which produces a new
  // defaultValues object and re-ran this reset — so dropping a signature mid-edit discarded
  // every other unsaved field on the form.
  useEffect(() => {
    if (!isDirty) reset(defaultValues);
    // isDirty deliberately omitted: this should run when new data arrives, not the moment the
    // form becomes dirty.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /**
   * Submit was blocked by validation.
   *
   * Every field is validated whether or not its section is on screen, so a bad value somewhere
   * else is the one case where the error genuinely cannot be seen. One toast naming the fields —
   * on submit only, unlike the old effect that fired one per error on every render.
   */
  const onInvalid = (formErrors) => {
    const names = Object.keys(formErrors || {});
    if (!names.length) return;
    enqueueSnackbar(`${t('required field')}: ${names.map((n) => t(n)).join(', ')}`, {
      variant: 'error',
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // The file fields were uploaded on drop; sending them again would post File objects as JSON.
      const {
        // eslint-disable-next-line no-unused-vars -- destructured to omit from the payload
        picture, scanned_identity, signature, stamp,
        ...dataToSubmit
      } = data;

      // The three repeatable lists seed one blank row so the UI has something to show. Left
      // untouched they were saved as [{ name: '', institution: '', year: null }] — a row that
      // renders as an empty certificate forever after.
      dataToSubmit.certifications = dropEmptyRows(data.certifications);
      dataToSubmit.memberships = dropEmptyRows(data.memberships);
      dataToSubmit.other = dropEmptyRows(data.other);

      await axios.patch(endpoints.employees.one(employeeData._id), dataToSubmit);
      // `currency` used to be read off `data` here, but it is in neither the schema nor the
      // defaults, so this always sent `currency: undefined`.
      await axios.patch(endpoints.employee_engagements.one(employeeEng?._id), {
        fees: data.fees,
        fees_after_discount: data.fees_after_discount,
      });
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
  }, onInvalid);

  // Both handlers used to DROP any keystroke failing their regex — the character simply never
  // appeared and nothing said why. Typing a Latin letter into the Arabic name looked like a
  // broken keyboard.
  //
  // The value is accepted now and the schema reports it ("Arabic letters only" /
  // "English letters only") under the field, which is the same rule stated out loud.
  const handleEnglishInputChange = (event) => {
    methods.setValue(event.target.name, event.target.value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleArabicInputChange = (event) => {
    methods.setValue(event.target.name, event.target.value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        {section === 'identity' && (
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
                        // new Date('') is Invalid Date, which MUI renders as a broken field rather than an
                    // empty one. null is how a date picker says "nothing selected".
                    value={values.birth_date ? new Date(values.birth_date) : null}
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
          </Box>
        )}

        {section === 'contact' && (
          <Box sx={{ px: 3 }}>
            <Typography mb={2} variant="h6">
              {t('contact')}
            </Typography>
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
              {/* Email is not edited here. It is the account's login identity and it already
                  shows in the identity banner above, so a second, editable copy in Contact was
                  both duplicated and the wrong place to change it. */}
              <RHFPhoneNumberCustom name="phone" label={t('phone number')} />
              <RHFPhoneNumberCustom name="mobile_num" label={t('alternative mobile number')} />
              <RHFTextField name="identification_num" label={t('National ID number')} />
              <RHFTextField
                name="profrssion_practice_num"
                label={t('profrssion practice number')}
              />
              <RHFTextField type="number" name="tax_num" label={t('tax number')} />
            </Box>
          </Box>
        )}

        {/* Assigned by the clinic, not chosen here — so it is a readout, shown alongside identity. */}
        {section === 'identity' && (
          <Box sx={{ px: 3 }}>
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
        {section === 'professional' && (
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
        {section === 'documents' && (
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
                    showOnDocument
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
                    showOnDocument
                    name="stamp"
                    label={t('stamp')}
                    onDrop={(acceptedFiles) => handleDrop('stamp', acceptedFiles)}
                  />
                </span>
              </Tooltip>
            </Box>
          </Box>
        )}

        {/* Save is always available. It used to appear only on the last step, so editing a name
            meant clicking through two more screens to commit it. */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{
            mt: 3,
            pt: 2,
            position: 'sticky',
            bottom: 0,
            bgcolor: 'background.paper',
            borderTop: (muiTheme) => `1px solid ${muiTheme.palette.divider}`,
          }}
        >
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('save changes')}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
AccountGeneral.propTypes = {
  employeeData: PropTypes.object,
  refetch: PropTypes.func,
  section: PropTypes.oneOf(['identity', 'contact', 'professional', 'documents']),
};
