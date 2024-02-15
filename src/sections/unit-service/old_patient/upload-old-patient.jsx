import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import FormProvider, { RHFUpload, RHFTextField } from 'src/components/hook-form';

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
  // console.log('getValues', getValues());

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
      // console.log('data', data);
      // console.log('formData', formData);
      await axios.post(endpoints.tables.newOldPatient, formData);
      socket.emit('updated', {
        user,
        link: paths.unitservice.oldPatient,
        msg: `uploaded an old patient data`,
      });
      refetch();
      reset();
      enqueueSnackbar('Uploaded success!');
      // router.push(paths.unitservice.tables.employeetypes.root);
      console.info('DATA', data);
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.href });
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
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
      // console.log('acceptedFiles', acceptedFiles);
      const files = values.files || uploadedFiles;
      // console.log('files', files);

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      // console.log('newFiles', newFiles);

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
            label={`${t('first name')} *`}
          />
          <RHFTextField
            lang="ar"
            onChange={handleEnglishInputChange}
            name="middle_name"
            label={t('middle name')}
          />
          <RHFTextField
            lang="ar"
            onChange={handleEnglishInputChange}
            name="family_name"
            label={`${t('family name')} *`}
          />
          <RHFTextField lang="ar" type="email" name="email" label={`${t('email')} *`} />
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
