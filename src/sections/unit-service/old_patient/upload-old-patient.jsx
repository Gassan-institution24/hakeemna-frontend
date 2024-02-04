import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Tesseract from 'tesseract.js';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { MenuItem, TextField } from '@mui/material';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';
import { tablePaginationClasses } from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import axiosHandler from 'src/utils/axios-handler';

import {
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { Upload, UploadBox } from 'src/components/upload';
import { useSettingsContext } from 'src/components/settings';

import { useGetCountries, useGetEmployeeTypes, useGetSpecialties } from 'src/api/tables';
import axios, { endpoints } from 'src/utils/axios';
import { useLocales, useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUpload,
  RHFUploadBox,
} from 'src/components/hook-form';

import ExistEmployeesRow from './old-patients-row';

// ----------------------------------------------------------------------

export default function UploadOldPatient({ refetch }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const table = useTable({ defaultRowsPerPage: 10 });

  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const [results, setResults] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    middle_name: Yup.string(),
    family_name: Yup.string().required('family name is required'),
    identification_num: Yup.string(),
    phone: Yup.string().required('Phone is required'),
    files: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
      employee: user?.employee?._id,
      first_name: '',
      middle_name: '',
      family_name: '',
      identification_num: '',
      phone: '',
      files: [],
    }),
    [user?.employee]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = getValues();
  console.log('getValues', getValues());

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'files') {
          data[key].forEach((file, index) => {
            formData.append(`files[${index}]`, file); // Append each file with a unique key
          });
        } else {
          formData.append(key, data[key]);
        }
      });
      console.log('data', data);
      console.log('formData', formData);
      await axios.post(endpoints.tables.newOldPatient, formData);
      refetch();
      reset();
      enqueueSnackbar('Uploaded success!');
      // router.push(paths.unitservice.tables.employeetypes.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Uploaded failed!', { variant: 'error' });
    }
  });

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_-]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      setValue(event.target.name, event.target.value);
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      setValue(event.target.name, event.target.value);
    }
  };

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      console.log('acceptedFiles', acceptedFiles);
      const files = values.files || uploadedFiles;
      console.log('files', files);

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      console.log('newFiles', newFiles);

      // Concatenate the new files with the existing ones
      const updatedFiles = [...files, ...newFiles];

      setUploadedFiles(updatedFiles);
      setValue('files', updatedFiles, {
        shouldValidate: true,
      });
    },
    [setValue, values.files, uploadedFiles]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Box
          sx={{ mb: 3 }}
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
          }}
        >
          <RHFTextField
            lang="ar"
            onChange={handleEnglishInputChange}
            name="first_name"
            label={t('first name')}
          />
          <RHFTextField
            lang="ar"
            onChange={handleEnglishInputChange}
            name="middle_name"
            label={t("middle name")}
          />
          <RHFTextField
            lang="ar"
            onChange={handleEnglishInputChange}
            name="family_name"
            label={t("family name")}
          />
          <RHFTextField lang="ar" type="email" name="email" label={t('email')} />
          <RHFTextField
            lang="ar"
            onChange={handleEnglishInputChange}
            name="identification_num"
            label={t('ID number')}
          />
          <RHFTextField
            lang="ar"
            onChange={handleEnglishInputChange}
            name="phone"
            label={t('phone')}
            type="number"
          />
        </Box>
        <RHFUpload
          multiple
          name="files"
          maxSize={3145728}
          onDrop={handleDropMultiFile}
          onRemove={(inputFile) => {
            setValue('files', values.files && values.files?.filter((file) => file !== inputFile), {
              shouldValidate: true,
            });
            setUploadedFiles(uploadedFiles.filter((file) => file !== inputFile));
          }}
          onRemoveAll={() => {
            setValue('files', [], { shouldValidate: true });
            setUploadedFiles([]);
          }}
          onUpload={onSubmit}
        />
      </Card>
    </FormProvider>
  );
}
UploadOldPatient.propTypes = {
  refetch: PropTypes.func,
};
