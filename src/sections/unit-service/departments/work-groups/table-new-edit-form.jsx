import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';

import axios from 'axios';
import axiosHandler from 'src/utils/axios-handler';
import { useAuthContext } from 'src/auth/hooks';
import { useGetDepartmentEmployees } from 'src/api/tables';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ departmentData, currentTable }) {
  const router = useRouter();

  const { user } = useAuthContext();

  const { employeesData } = useGetDepartmentEmployees(departmentData._id);

  console.log('employeesData', employeesData);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    employees: Yup.array().min(1, 'Choose at least one option'),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
          ._id || departmentData.unit_service._id,
      department: departmentData._id,
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      employees: currentTable?.employees || [],
    }),
    [currentTable, departmentData, user?.employee]
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
  console.log('values', methods.getValues());

  const onSubmit = handleSubmit(async (data) => {
    console.log('data', data);
    try {
      const address = await axios.get('https://geolocation-db.com/json/');
      console.log('dataa', {
        ip_address_user_modification: address.data.IPv4,
        user_modification: user._id,
        ...data,
      });
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
      }
      reset();
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      router.push(paths.unitservice.departments.workGroups.root(departmentData._id));
      console.info('DATA', data);
    } catch (error) {
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
              lang="en"
              onChange={handleEnglishInputChange}
              name="name_english"
              label="name english"
            />
            <RHFTextField
              lang="ar"
              onChange={handleArabicInputChange}
              name="name_arabic"
              label="name arabic"
            />
            {/* <Stack spacing={1.5}> */}
            {/* <Typography variant="subtitle2">Working schedule</Typography> */}
            <RHFAutocomplete
              name="employees"
              placeholder="+ employees"
              multiple
              disableCloseOnSelect
              options={employeesData.map((option) => option)}
              getOptionLabel={(option) => option._id}
              renderOption={(props, option) => (
                <li {...props} key={option._id} value={option._id}>
                  {option.employee.first_name} {option.employee.second_name}{' '}
                  {option.employee.family_name}
                </li>
              )}
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
              {!currentTable ? 'Create' : 'Save Changes'}
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
