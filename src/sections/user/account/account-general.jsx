import * as Yup from 'yup';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem, Typography } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetCountries, useGetCountryCities } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral({ data, refetch }) {
  const { user } = useAuthContext();
  const [profilePicture, setProfilePicture] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { countriesData } = useGetCountries();
  const { t } = useTranslate();
  const [em_phone, setEMphone] = useState(data.mobile_num1);
  const [em_phone2, setEMphone2] = useState(data.mobile_num2);
  const handleArabicInputChange = (event) => {
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

  const UpdateUserSchema = Yup.object().shape({
    name_english: Yup.string(),
    name_arabic: Yup.string(),
    email: Yup.string(),
    height: Yup.string(),
    weight: Yup.string(),
    mobile_num1: Yup.string(),
    mobile_num2: Yup.string(),
    is_on_eating_diet: Yup.string(),
    country: Yup.string(),
    city: Yup.string(),
    address: Yup.string(),
    sport_exercises: Yup.string(),
    smoking: Yup.string(),
    profile_picture: Yup.string(),
  });
  const DATAFORMAP = ['not smoker', 'light smoker', 'heavy smoker'];
  const SECDATAFORMAP = ['0', 'once a week', 'twice a week', '3-4 times a week', 'often'];
  const THERDDATAFORMAP = ['Yes', 'No'];

  const defaultValues = {
    name_english: data?.name_english || '',
    name_arabic: data?.name_arabic || '',
    email: data?.email || '',
    height: data?.height || '',
    weight: data?.weight || '',
    mobile_num1: data?.mobile_num1 || '',
    mobile_num2: data?.mobile_num2 || '',
    is_on_eating_diet: user.patient?.is_on_eating_diet || null,
    country: user.patient?.country?._id || null,
    city: user.patient?.city?._id || null,
    address: data?.address || '',
    sport_exercises: data?.sport_exercises || '',
    smoking: data?.smoking || '',
    other_medication_notes: [],
    profile_picture: data?.profile_picture?.replace(/\\/g, '//') || '',
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { tableData } = useGetCountryCities(watch().country);

  const fuser = (fuserSize) => {
    const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif'];

    const isValidFile = (fileName) => {
      const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
      const isExtensionAllowed = allowedExtensions.includes(fileExtension);
      return isExtensionAllowed;
    };
    const isValidSize = (fileSize) => fileSize <= 3145728;

    return {
      validateFile: isValidFile,
      validateSize: isValidSize,
    };
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    const fileValidator = fuser(file.size);

    if (fileValidator.validateFile(file.name) && fileValidator.validateSize(file.size)) {
      setProfilePicture(file);
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setValue('profile_picture', newFile);
    } else {
      enqueueSnackbar(t('Invalid file type or size'), { variant: 'error' });
    }
  };

  const onSubmit = async (profileData) => {
    if (data.other_medication_notes && data.other_medication_notes.length > 0) {
      // Concatenate the new value to the old array
      profileData.other_medication_notes = [
        ...data.other_medication_notes,
        profileData.other_medication_notes,
      ];
    } else {
      // If there is no old value, create a new array with the new value
      profileData.other_medication_notes = [profileData.other_medication_notes];
    }

    // Create a new FormData object
    const formData = new FormData();

    // Append each key-value pair to the formData
    Object.keys(profileData).forEach((key) => {
      formData.append(key, profileData[key]);
    });

    if (profilePicture) {
      formData.append('ter', profilePicture);
    }

    try {
      await axios.patch(`${endpoints.patients.one(user?.patient._id)}`, formData);
      enqueueSnackbar(`${t('Profile updated successfully')}`, { variant: 'success' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* img */}
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, height: { md: '100%' }, pb: { xs: 5 }, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="profile_picture"
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 6,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                    fontSize: 17,
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif *.pdf
                  <br /> max size of 3MB
                </Typography>
              }
            />
          </Card>
        </Grid>
        {/* img */}
        <Grid xs={12} md={8}>
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
                name="name_english"
                label={t('name in english')}
                onChange={handleEnglishInputChange}
              />
  
              <RHFTextField
                name="name_arabic"
                label={t('Name in arabic')}
                onChange={handleArabicInputChange}
              />
     
              <MuiTelInput
                label={`${t('Mobile Number')} *`}
                forceCallingCode
                defaultCountry="JO"
                value={em_phone}
                onChange={(newPhone) => {
                  matchIsValidTel(newPhone);
                  setEMphone(newPhone);
                  methods.setValue('mobile_num1', newPhone);
                }}
              />
              <MuiTelInput
                label={`${t('Alternative Mobile Number')} *`}
                forceCallingCode
                defaultCountry="JO"
                value={em_phone2}
                onChange={(newPhone2) => {
                  matchIsValidTel(newPhone2);
                  setEMphone2(newPhone2);
                  methods.setValue('mobile_num2', newPhone2);
                }}
              />
              <RHFTextField
                name="email"
                label={t('Email Address')}
                // onChange={handleArabicInputChange}
                disabled 
              />

              <RHFSelect
                label={t('residence country')}
                fullWidth
                name="country"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {countriesData.map((country, idx) => (
                  <MenuItem lang="ar" key={idx} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label={t('city')}
                fullWidth
                name="city"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {tableData.map((city, idx) => (
                  <MenuItem lang="ar" key={idx} value={city._id}>
                    {city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="address" label={t('Address')} />
              <RHFTextField
                name="height"
                label={
                  <span>
                    {t('Height')}
                    <span style={{ color: 'green', fontWeight: 600 }}>/</span> {t('cm')}
                  </span>
                }
              />
              <RHFTextField
                name="weight"
                label={
                  <span>
                    {t('Weight')}
                    <span style={{ color: 'green', fontWeight: 600 }}>/</span> {t('kg')}
                  </span>
                }
              />

              <RHFSelect
                label={t('Sport Exercises')}
                fullWidth
                name="sport_exercises"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {SECDATAFORMAP.map((test, idx) => (
                  <MenuItem lang="ar" value={test} key={idx}>
                    {test}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                label={t('On Diet')}
                fullWidth
                name="is_on_eating_diet"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {THERDDATAFORMAP.map((test, idx) => (
                  <MenuItem lang="ar" value={test} key={idx}>
                    {test}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label={t('Smoking')}
                fullWidth
                name="smoking"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {DATAFORMAP.map((test, idx) => (
                  <MenuItem lang="ar" value={test} key={idx}>
                    {test}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="other_medication_notes" label={t('More information')} />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {t('Save Changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
AccountGeneral.propTypes = {
  data: PropTypes.func,
  refetch: PropTypes.func,
};
