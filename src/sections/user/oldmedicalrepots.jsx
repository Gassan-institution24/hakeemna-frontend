import * as Yup from 'yup';
import React, { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// import Box from '@mui/material/Box';
// import { Stack } from '@mui/system';
import Link from '@mui/material/Link';
import Grow from '@mui/material/Grow';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import { alpha } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import { DatePicker } from '@mui/x-date-pickers';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {  Button, MenuItem, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';
// import { fDate } from 'src/utils/format-time';/

import { useGetSpecialties } from 'src/api';
// import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';

export default function OldMedicalReports() {
  const dialog = useBoolean();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [files, setFiles] = useState([]);
  const [checkChange, setCheckChange] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // const { user } = useAuthContext();
  const { specialtiesData } = useGetSpecialties();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('/api/oldmedicalreports');
  //       setfilesPdf(response.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  // const delteeFile = async () => {
  //   try {
  //     await axios.patch(`/api/oldmedicalreports/${filesPdftodelete._id}`, {
  //       Activation: 'Inactive',
  //     });
  //     enqueueSnackbar(
  //       `${curLangAr ? 'تم حذف التقرير بنجاح' : 'Medical report deleted successfully'}`,
  //       { variant: 'success' }
  //     );
  //     const response = await axios.get('/api/oldmedicalreports');
  //     setfilesPdf(response.data);
  //   } catch (error) {
  //     enqueueSnackbar(`${curLangAr ? 'حدث خطأ ما, الرجاء المحاوله لاحقا' : 'Unable to delete'}`, {
  //       variant: 'error',
  //     });
  //   }
  // };

  const oldMedicalReportsSchema = Yup.object().shape({
    type: Yup.string().required(),
    date: Yup.date().required('Date is required'),
    file: Yup.array().required(),
    name: Yup.string().required('File name is required'),
    note: Yup.string(),
    agree: Yup.boolean().required(),
    specialty: Yup.string().required(),
  });

  const TYPE = ['Blod Test', 'X-ray Test', 'Health Check Test', 'Heart examination Test'];

  const defaultValues = {
    type: '',
    date: '',
    file: [],
    name: '',
    note: '',
    agree: !checkChange,
    specialty: '',
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(oldMedicalReportsSchema),
    defaultValues,
  });
  const {
    setValue,
    control,
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const fuser = (fuserSize) => {
    const allowedExtensions = ['.jpeg', '.png', '.jpg', '.gif', '.pdf'];

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
    console.log(acceptedFiles, 'acceptedFiles');

    const fileValidator = fuser(acceptedFiles.reduce((acc, file) => acc + file.size, 0));

    const isValidFiles = acceptedFiles.every(
      (file) =>
        // const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        fileValidator.validateFile(file.name) && fileValidator.validateSize(file.size)
    );

    if (isValidFiles) {
      // setFiles(acceptedFiles); // Save the files in state
      const newFiles = acceptedFiles;
      console.log(newFiles, 'newfiles');
      setValue(newFiles)
      setFiles((currentFiles) => [...currentFiles, ...newFiles]);
    } else {
      // Handle invalid file type or size
      enqueueSnackbar(t('Invalid file type or size'), { variant: 'error' });
    }
  };

  const values = watch();

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      // console.log('acceptedFiles', acceptedFiles);
      const test = values.file || files;
      // console.log('files', files);

      const newFiles = acceptedFiles.map((file, idx) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
  

      setFiles([...test, ...newFiles]);
      setValue('file', files, {
        shouldValidate: true,
      });
    },
    [setValue, values.file, files]
  );


  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    console.log(files, 'files');

    if (files) {
      files.forEach((f) => formData.append('medicalreports[]', f));
    }
    try {
      console.log(Object.fromEntries(formData), 'sdsd');
      await axios.post('/api/oldmedicalreports', formData);
      enqueueSnackbar('medical report uploaded successfully', { variant: 'success' });
      dialog.onFalse();
      // const response = await axios.get('/api/oldmedicalreports');
      // setfilesPdf(response.data);
      reset();
      setCheckChange(!checkChange);

      console.log('data', data);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };



  return (
    <>
      {showAlert && (
        <Grow in={showAlert} timeout={600}>
          <Alert
            severity="info"
            variant="filled"
            sx={{ width: '50%', mb: 2 }}
            action={
              <>
                <Button
                  color="inherit"
                  size="small"
                  variant="outlined"
                  sx={{
                    mr: 1,
                    border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.48)}`,
                  }}
                  onClick={handleAlertClose}
                >
                  Cancel
                </Button>

                <Button
                  size="small"
                  color="info"
                  variant="contained"
                  sx={{
                    bgcolor: 'info.dark',
                  }}
                  onClick={() => {
                    setShowAlert(false);
                    // delteeFile();
                  }}
                >
                  Confirm
                </Button>
              </>
            }
          >
            Please confirm the delettion
          </Alert>
        </Grow>
      )}
      <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ gap: 1, mb: 5 }}>
        {t('Upload Your Perscription')}
        <Iconify icon="mingcute:add-line" />
      </Button>

      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
            {t('IMPORTANT')}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 5, fontSize: 14 }}>
              {curLangAr
                ? 'لا ينبغي أن يتم تفسير النتائج وتقييمها بشكل فردي، بل بحضور الطبيب الذي يتم استشارته بشأن تلك النتائج مع مراعاة السياق الطبي الكامل لحالة المريض'
                : 'The interpretation and evaluation of the results should not be done individually, but rather in the presence of a physician who is consulted on those results and taking into account the full medical context of the patient’s condition.'}
            </Typography>
            <RHFTextField lang="en" name="name" label={t('File name*')} sx={{ mb: 1.5 }} />
            <RHFSelect
              label={t('Type*')}
              fullWidth
              name="type"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 1.5 }}
            >
              {TYPE.map((test, idx) => (
                <MenuItem value={test} key={idx} sx={{ mb: 1 }}>
                  {test}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              label={t('Specialty*')}
              fullWidth
              name="specialty"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 1 }}
            >
              {specialtiesData.map((test, idx) => (
                <MenuItem value={test?._id} key={idx} sx={{ mb: 1 }}>
                  {curLangAr ? test?.name_arabic : test?.name_english}
                </MenuItem>
              ))}
            </RHFSelect>

            <Controller
              name="date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  sx={{ mb: 1 }}
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
            <RHFUpload
              autoFocus
              fullWidth
              name="file"
              margin="dense"
              sx={{ mb: 1 }}
              variant="outlined"
              onDrop={handleDrop}
              // onRemove={(inputFile) => {
              //   setValue('files', values.files && values.files?.filter((file) => file !== inputFile), {
              //     shouldValidate: true,
              //   });
              //   setUploadedFiles(uploadedFiles.filter((file) => file !== inputFile));
              // }}
              // onRemoveAll={() => {
              //   setValue('files', [], { shouldValidate: true });
              //   setUploadedFiles([]);
              // }}
              // onUpload={onSubmit}
              multiple
            />

            <RHFTextField lang="en" name="note" label={t('More information')} />
          </DialogContent>
          <Checkbox
            size="small"
            name="agree"
            color="success"
            sx={{ position: 'relative', top: 5, left: 25 }}
            onChange={() => {
              setCheckChange(!checkChange);
            }}
          />
          <Typography
            sx={{
              color: 'text.secondary',
              mt: { md: -2.5, xs: -2.3 },
              ml: curLangAr ? { md: -31, xs: -5 } : { md: -19.5, xs: 4 },
              typography: 'caption',
              textAlign: 'center',
              fontSize: { md: 12, xs: 10 },
            }}
          >
            {t('I reed the ')}
            <Link underline="always" color="text.primary">
              {t(' Privacy Policy')}
            </Link>
            {t('And agree to ')}
            <Link underline="always" color="text.primary">
              {t('Terms of Service ')}
            </Link>
            .
          </Typography>
          <DialogActions>
            <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
              {t('Cancel')}
            </Button>
            {checkChange === false ? (
              <Button type="submit" loading={isSubmitting} variant="contained" disabled>
                {t('Upload')}
              </Button>
            ) : (
              <Button type="submit" loading={isSubmitting} variant="contained">
                {t('Upload')}
              </Button>
            )}
          </DialogActions>
        </FormProvider>
      </Dialog>


  
    </>
  );
}
