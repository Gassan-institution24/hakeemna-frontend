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
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetDepartmentActiveEmployeeEngs } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ departmentData, currentTable }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { id } = useParams();

  const { user } = useAuthContext();

  const { employeesData } = useGetDepartmentActiveEmployeeEngs(departmentData._id);

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // console.log('employeesData', employeesData);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    employees: Yup.array().min(1, 'Choose at least one option'),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service: id || departmentData.unit_service._id,
      department: departmentData._id,
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      employees: currentTable?.employees.map((info, idx) => info.employee) || [],
    }),
    [currentTable, departmentData, id]
  );

  const methods = useForm({
    mode: 'onTouched',
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
      if (currentTable) {
        await axiosInstance.patch(endpoints.work_groups.one(currentTable._id), data);
        socket.emit('updated', {
          data,
          user,
          link: paths.superadmin.unitservices.departments.workGroups.root(id, departmentData._id),
          msg: `updated work group <strong>${data.name_english || ''}</strong> in <strong>${
            departmentData.name_english
          }</strong> department`,
        });
      } else {
        await axiosInstance.post(endpoints.work_groups.all, data);
        socket.emit('created', {
          data,
          user,
          link: paths.superadmin.unitservices.departments.workGroups.root(id, departmentData._id),
          msg: `created work group <strong>${data.name_english || ''}</strong> in <strong>${
            departmentData.name_english
          }</strong> department`,
        });
      }
      reset();
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
      router.push(
        paths.superadmin.unitservices.departments.workGroups.root(id, departmentData._id)
      );
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.pathname });
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
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
              renderOption={(props, option, idx) => (
                <li {...props} key={idx} value={option._id}>
                  {curLangAr?option.employee?.name_arabic:option.employee.name_english}
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
                    key={index}
                    label={curLangAr?option.employee?.name_arabic:option.employee.name_english}
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
            <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
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
