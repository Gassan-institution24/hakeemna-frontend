import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeActiveWorkGroups } from 'src/api';
import { useSnackbar } from 'src/components/snackbar';
import { useLocales, useTranslate } from 'src/locales';

// Components
import FormProvider, {
  RHFTextField,
  RHFSelect,
  RHFPhoneNumber
} from 'src/components/hook-form';
import { MenuItem } from '@mui/material';
import { useMemo } from 'react';

// ----------------------------------------------------------------------
export default function AddOnePatient() {
  const router = useRouter();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement];
  const { workGroupsData } = useGetEmployeeActiveWorkGroups(employee?._id);

  const handleEnglishInputChange = (event) => {
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow English chars
    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleArabicInputChange = (event) => {
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/; // Only allow Arabic chars
    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const NewPatientSchema = Yup.object().shape({
    name_english: Yup.string()
      .required(t('required field'))
      .test('is-three-words', t('must be at least three words'), (value) =>
        value ? value.trim().split(/\s+/).length === 3 : false
      ),
    name_arabic: Yup.string()
      .required(t('required field'))
      .test('is-three-words', t('must be at least three words'), (value) =>
        value ? value.trim().split(/\s+/).length === 3 : false
      ),
    mobile_num1: Yup.string().required(t('required field')),
    email: Yup.string().email(t('invalid email')).required(t('required field')),
    gender: Yup.string()
      .oneOf(['male', 'female'], t('required field'))
      .required(t('required field')),
    birth_date: Yup.date().nullable(),
    marital_status: Yup.string()
      .oneOf(['single', 'married', 'widowed', 'separated', 'divorced'],t('required field')),
    file_code: Yup.string().required(t('required field')),
    work_group: Yup.string().required(t('work group is required')),
  });

const defaultWorkGroup = useMemo(
  () => workGroupsData?.length > 0 ? workGroupsData[0]?._id : '',
  [workGroupsData]
);

  const defaultValues = useMemo(()=>({
    name_english: '',
    name_arabic: '',
    mobile_num1: '',
    email: '',
    gender: '',
    birth_date: null,
    marital_status: '',
    file_code: '',
    work_group: defaultWorkGroup,
  }), [defaultWorkGroup]);

  const methods = useForm({
    resolver: yupResolver(NewPatientSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(endpoints.usPatients.addOne, [
        {
          ...data,
          unit_service: employee?.unit_service?._id,
          employee: employee?._id,
        },
      ]);

      reset();
      enqueueSnackbar(t('patient created successfully'));
      router.push(paths.unitservice.patients.all);
    } catch (error) {
      enqueueSnackbar(error.message || t('failed to create patient'), { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
      <Card sx={{ pt: "24px",px:"40px",pb:"16px", width: '100%' }}>

        <Typography variant="subtitle1" gutterBottom>
            {t('work group')}
          </Typography>

        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          sx={{ mb: 3 }}>
          <RHFSelect
            name="work_group"
            SelectProps={{ native: false }}
            sx={{ }}
          >
            {workGroupsData?.map((group) => (
              <MenuItem key={group._id} value={group._id}>
                {curLangAr ? group.name_arabic : group.name_english}
              </MenuItem>
            ))}
          </RHFSelect>
        </Box>


        <Typography variant="h6" gutterBottom>
          {t('patient information')}
        </Typography>

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
            label={t('name english')}
            helperText={t('must be at least three words')}
            onChange={(e) => {handleEnglishInputChange(e);}}
          />
          <RHFTextField
            name="name_arabic"
            label={t('name arabic')}
            helperText={t('must be at least three words')}
            onChange={(e) => {handleArabicInputChange(e);}}
          />

          <RHFPhoneNumber name="mobile_num1" label={t('mobile number')} />
          <RHFTextField name="email" label={t('email')} />

          <RHFSelect name="gender" label={t('gender')}>
            <MenuItem lang="ar" value="male">
              {t('male')}
            </MenuItem>
            <MenuItem lang="ar" value="female">
              {t('female')}
            </MenuItem>
          </RHFSelect>


          <RHFSelect name="marital_status" label={t('marital status')}>
            <MenuItem lang="ar" value="single">
              {t('Single')}
            </MenuItem>
            <MenuItem lang="ar" value="married">
              {t('Married')}
            </MenuItem>
            <MenuItem lang="ar" value="widowed">
              {t('Widowed')}
            </MenuItem>
            <MenuItem lang="ar" value="separated">
              {t('Separated')}
            </MenuItem>
            <MenuItem lang="ar" value="divorced">
              {t('Divorced')}
            </MenuItem>
          </RHFSelect>
          <RHFTextField name="file_code" label={t('File code')} />
          <RHFTextField
            name="birth_date"
            type="date"
            label={t('birth date')}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('Create a new patient')}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
