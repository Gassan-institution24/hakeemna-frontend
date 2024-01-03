import * as Yup from 'yup';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { MenuItem,Typography, Button} from '@mui/material';
import FormProvider, { RHFTextField, RHFSelect, RHFUploadAvatar, RHFSwitch } from 'src/components/hook-form';
import { useGetCities, useGetCountries } from 'src/api/tables';
import axiosHandler from 'src/utils/axios-handler';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';


// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState();
  const { countriesData } = useGetCountries();
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const { tableData } = useGetCities();
  const { user } = useAuthContext();
  const router = useRouter();
  const UpdateUserSchema = Yup.object().shape({
    first_name: Yup.string(),
    last_name: Yup.string(),
    email: Yup.string(),
    mobile_num1: Yup.string(),
    mobile_num2: Yup.string(),
    nationality: Yup.string(),
    country: Yup.string(),
    city: Yup.string(),
    address: Yup.string(),
    sport_exercises: Yup.string(),
    smoking: Yup.string(),
  });
  const DATAFORMAP = ['not smoker', 'light smoker', 'heavy smoker'];
  const SECDATAFORMAP = ['0', 'once a week', 'twice a week', '3-4 times a week', 'often'];

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('country', selectedCountryId, { shouldValidate: true });
    setSelectedCountry(selectedCountryId);
  };

  useEffect(() => {
    setCities(
      selectedCountry
        ? tableData.filter((data) => data?.country?._id === selectedCountry)
        : tableData
    );
  }, [tableData, selectedCountry]);
  const defaultValues = {
    first_name: user?.patient?.first_name || '',
    last_name: user?.patient?.last_name || '',
    email: user?.email || '',
    mobile_num1: user?.patient?.mobile_num1 || '',
    mobile_num2: user?.patient?.mobile_num2 || '',
    nationality: user?.patient?.nationality || null,
    country: user?.patient?.country?._id || null,
    city: user?.patient?.city?._id || null,
    address: user?.patient?.address || '',
    sport_exercises: user?.patient?.sport_exercises || '',
    smoking: user?.patient?.smoking || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (info) => {
    try {
      const response = await axiosHandler({
        setError,
        method: 'PATCH',
        path: `/api/patient/${user.patient._id}`,
        data: info,
      });

      if (response) {
        enqueueSnackbar('Profile updated successfully', { variant: 'success' });
        router.push(paths.dashboard.user.profile);
      }
    } catch (err) {
      setError(err.message);
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* img */}
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of  
                  {/* {fuser(3145728)} */}
                </Typography>
              }
            />

            {/* <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            /> */}

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete Profile
            </Button>
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
              <RHFTextField name="first_name" label="First Name" />
              <RHFTextField name="last_name" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="mobile_num1" label="Phone Number" />
              <RHFTextField name="mobile_num2" label="Phone Number" />
              <RHFTextField name="address" label="Address" />

              <RHFSelect
                label="nationality"
                fullWidth
                name="nationality"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {countriesData.map((nationality) => (
                  <MenuItem key={nationality._id} value={nationality._id}>
                    {nationality.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label="country"
                fullWidth
                name="country"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                onChange={handleCountryChange}
              >
                {countriesData.map((country) => (
                  <MenuItem key={country._id} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label="city"
                fullWidth
                name="city"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {cities.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label="Sport Exercises"
                fullWidth
                name="sport_exercises"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {SECDATAFORMAP.map((test) => (
                  <MenuItem value={test} key={test}>
                    {test}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label="Smoking"
                fullWidth
                name="smoking"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {DATAFORMAP.map((test) => (
                  <MenuItem value={test} key={test._id}>
                    {test}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
