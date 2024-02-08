import * as Yup from 'yup';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { socket } from 'src/socket';
import { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';

import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import axiosHandler from 'src/utils/axios-handler';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUSDepartments, useGetUSEmployees } from 'src/api/tables';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const { employeesData } = useGetUSEmployees(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const { departmentsData } = useGetUSDepartments(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    department: Yup.string().required('department is required'),
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    employees: Yup.array().min(1, 'Choose at least one option'),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
      department: currentTable?.department?._id || null,
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      employees: currentTable?.employees || [],
    }),
    [currentTable, user?.employee]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
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

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const address = await axios.get('https://geolocation-db.com/json/');
      if (currentTable) {
        await axiosHandler({
          method: 'PATCH',
          path: endpoints.tables.workgroup(currentTable._id),
          data: {
            modifications_nums: (currentTable.modifications_nums || 0) + 1,
            ip_address_user_modification: address.data.IPv4,
            user_modification: user._id,
            ...data,
          },
        });
        socket.emit('updated', {
          user,
          link: paths.unitservice.tables.workgroups.root,
          msg: `updated a work group <strong>${data.name_english}</strong>`,
        })
      } else {
        await axiosHandler({
          method: 'POST',
          path: endpoints.tables.workgroups,
          data: {
            ip_address_user_creation: address.data.IPv4,
            user_creation: user._id,
            ...data,
          },
        });
        socket.emit('created', {
          user,
          link: paths.unitservice.tables.workgroups.root,
          msg: `created a work group <strong>${data.name_english}</strong>`,
        })
      }
      reset();
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
      router.push(paths.unitservice.tables.workgroups.root);
      console.info('DATA', data);
    } catch (error) {
      socket.emit('error', {
        error,
        user,
        link: `/dashboard/unitservices/${data.unit_service}/systemerrors`,
        msg: `creating or updating a new work group ${data.name_english} into ${data.unit_service}`,
      });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {/* <Grid container spacing={3}> */}
      <Grid xs={12} maxWidth="md">
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
          >
            <RHFTextField
              lang="ar"
              onChange={handleEnglishInputChange}
              name="name_english"
              label={`${t('name english')} *`}
            />
            <RHFTextField
              lang="ar"
              onChange={handleArabicInputChange}
              name="name_arabic"
              label={`${t('name arabic')} *`}
            />
            <RHFSelect name="department" label={t('department')}>
              {departmentsData.map((department) => (
                <MenuItem key={department._id} value={department._id}>
                  {curLangAr ? department.name_arabic : department.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            {/* <Stack spacing={1.5}> */}
            {/* <Typography variant="subtitle2">Working schedule</Typography> */}
            <RHFAutocomplete
              name="employees"
              label={`${t('employees')} *`}
              multiple
              disableCloseOnSelect
              options={employeesData.filter(
                (option) => !selectedEmployees.some((item) => isEqual(option, item))
              )}
              getOptionLabel={(option) => option._id}
              renderOption={(props, option) => (
                <li {...props} key={option._id} value={option._id}>
                  {option.employee.first_name} {option.employee.middle_name}{' '}
                  {option.employee.family_name}
                </li>
              )}
              onChange={(event, newValue) => {
                setSelectedEmployees(newValue);
                methods.setValue('employees', newValue, { shouldValidate: true });
              }}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option._id}
                    label={option.employee.first_name}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />
            {/* </Stack> */}
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!currentTable ? t('create') : t('save changes')}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
      {/* </Grid> */}
    </FormProvider>
  );
}

TableNewEditForm.propTypes = {
  currentTable: PropTypes.object,
  departmentData: PropTypes.object,
};
