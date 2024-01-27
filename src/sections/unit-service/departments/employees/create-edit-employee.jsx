import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';

import { useGetCountries, useGetEmployeeTypes, useGetSpecialties } from 'src/api/tables';
import { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import axios from 'axios';
import Iconify from 'src/components/iconify';
import axiosHandler from 'src/utils/axios-handler';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable, departmentData }) {
  const router = useRouter();

  const { user } = useAuthContext();

  console.log('user', user);
  console.log('currr', currentTable);
  const { countriesData } = useGetCountries();
  const { employeeTypesData } = useGetEmployeeTypes();
  const { specialtiesData } = useGetSpecialties();

  console.log('countriesData', countriesData);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    // unit_service: Yup.string().required('Unit Service is required'),
    // department: Yup.string(),
    employee_type: Yup.string().required('Employee Type is required'),
    email: Yup.string().required('email is required'),
    first_name: Yup.string().required('First name is required'),
    second_name: Yup.string(),
    family_name: Yup.string().required('Family name is required'),
    nationality: Yup.string().required('Nationality is required'),
    address: Yup.string(),
    phone: Yup.string().required('phone is required'),
    speciality: Yup.string().required('speciality is required'),
    gender: Yup.string().required('gender is required'),
    birth_date: Yup.string(),
    password: Yup.string().required('password is required'),
    confirmPassword: Yup.string().required('confirmPassword is required'),
  });

  const defaultValues = useMemo(
    () => ({
      // unit_service: currentTable?.unit_service || '',
      // department: currentTable?.department || '',
      unit_service:
        user?.employee?.employee_engagements[user.employee.selected_engagement]?.unit_service
          ?._id || departmentData.unit_service._id,
      department: departmentData._id,
      employee_type: currentTable?.employee_type || '',
      email: currentTable?.email || '',
      first_name: currentTable?.first_name || '',
      second_name: currentTable?.second_name || '',
      family_name: currentTable?.family_name || '',
      nationality: currentTable?.nationality || '',
      address: currentTable?.address || '',
      phone: currentTable?.phone || '079',
      speciality: currentTable?.speciality || '',
      gender: currentTable?.gender || '',
      birth_date: currentTable?.birth_date || '',
      password: currentTable?.password || '',
      confirmPassword: currentTable?.confirmPassword || '',
    }),
    [
      currentTable,
      departmentData,
      user.employee,
    ]
  );

  const password = useBoolean();

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
      console.log('data', data);
      const address = await axios.get('https://geolocation-db.com/json/');
      if (currentTable) {
        await axiosHandler({
          method: 'PATCH',
          path: endpoints.tables.hospital(currentTable._id),
          data: {
            role: 'employee',
            modifications_nums: (currentTable.modifications_nums || 0) + 1,
            ip_address_user_modification: address.data.IPv4,
            user_modification: user._id,
            ...data,
          },
        });
      } else {
        await axiosHandler({
          method: 'POST',
          path: endpoints.auth.register,
          data: {
            ip_address_user_creation: address.data.IPv4,
            user_creation: user._id,
            role: 'employee',
            userName: `${data.first_name} ${data.family_name}`,
            ...data,
          },
        });
      }
      reset();
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      router.push(paths.unitservice.departments.employees.root(departmentData._id));
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
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
                lang="en"
                onChange={handleEnglishInputChange}
                name="first_name"
                label="First name"
              />
              <RHFTextField
                lang="en"
                onChange={handleEnglishInputChange}
                name="second_name"
                label="Second name"
              />
              <RHFTextField
                lang="en"
                onChange={handleEnglishInputChange}
                name="family_name"
                label="Family name"
              />
              <RHFTextField
                lang="en"
                onChange={handleEnglishInputChange}
                name="address"
                label="Address"
              />
              <RHFTextField name="phone" label="Phone" type="number" />

              <RHFSelect name="nationality" label="Nationality">
                {countriesData.map((nationality) => (
                  <MenuItem key={nationality._id} value={nationality._id}>
                    {nationality.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="employee_type" label="Employee Type">
                {employeeTypesData.map((employee_type) => (
                  <MenuItem key={employee_type._id} value={employee_type._id}>
                    {employee_type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="speciality" label="Speciality">
                {specialtiesData.map((speciality) => (
                  <MenuItem key={speciality._id} value={speciality._id}>
                    {speciality.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="gender" label="Gender">
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </RHFSelect>
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              mt={3}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="email" label="Email" />
              <RHFTextField
                name="password"
                label="Password"
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="confirmPassword"
                label="Confirm Password"
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentTable ? 'Create' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

TableNewEditForm.propTypes = {
  currentTable: PropTypes.object,
  departmentData: PropTypes.object,
};
