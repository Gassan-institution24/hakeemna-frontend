import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import { Box, Stack } from '@mui/system';
import {
  Card,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';
import { fDateTime } from 'src/utils/format-time';

import { useGetOnemedicalreports } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify/iconify';
import FormProvider, { RHFUpload, RHFTextField } from 'src/components/hook-form';

export default function MdicalreportPage() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const { medicalreports, refetch } = useGetOnemedicalreports(id);
  const [ImgFiles, setImgFiles] = useState([]);
  const medicalReportDialog = useBoolean();
  const navigate = useNavigate();
  const medicalReportSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    file: Yup.array(),
    entrance_mangament: Yup.string(),
    description: Yup.string().required(t('Description is required')),
    department: Yup.string(),
    medical_report: Yup.string(),
  });
  const defaultValues = {
    file: [],
    description: '',
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(medicalReportSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  useEffect(() => {
    if (medicalreports) {
      reset({
        file: medicalreports.file || [],
        description: medicalreports.description || '',
      });
    }
  }, [medicalreports, reset]);

  const onSubmit = async (submitdata) => {
    try {
      const formData = new FormData();

      Object.keys(submitdata).forEach((key) => {
        if (Array.isArray(submitdata[key])) {
          submitdata[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, submitdata[key]);
        }
      });

      ImgFiles.forEach((file, index) => {
        formData.append(`file[${index}]`, file);
      });

      await axiosInstance.patch(`/api/examination/${id}`, submitdata);

      enqueueSnackbar('Prescription updated successfully', { variant: 'success' });
      navigate(-1);
      refetch();
      reset();
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating data', { variant: 'error' });
    }
  };

  const fuser = (fuserSize) => {
    const allowedExtensions = ['.jpeg', '.png', '.jpg', '.gif'];

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
    const fileValidator = fuser(acceptedFiles.reduce((acc, file) => acc + file.size, 0));

    const isValidFiles = acceptedFiles.every(
      (file) => fileValidator.validateFile(file.name) && fileValidator.validateSize(file.size)
    );

    if (isValidFiles) {
      const newFiles = acceptedFiles;
      setImgFiles((currentFiles) => [...currentFiles, ...newFiles]);
      setValue('file', [...values.file, ...newFiles]);
    } else {
      enqueueSnackbar(t('Invalid file type or size'), { variant: 'error' });
    }
  };

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.file.filter((file) => file !== inputFile);
      setValue('file', filtered);
      setImgFiles(filtered);
    },
    [setValue, values.file]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('file', []);
    setImgFiles([]); // Clear image files state
  }, [setValue]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack
          component={Card}
          sx={{
            p: 3,
            width: '80%',
            display: 'grid',
            gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' },
          }}
        >
          <Box>
            <Typography variant="h3">{medicalreports?.patient?.name_english}</Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('Date')}:&nbsp; &nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>
                {fDateTime(medicalreports?.created_at)}
              </span>
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('Dr.')}&nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>
                {medicalreports?.employee?.name_english}
              </span>{' '}
              &nbsp; added medical report
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('description')}:&nbsp;&nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>
                {medicalreports?.description}
              </span>{' '}
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
              <Iconify icon="icon-park:back" />
              &nbsp; {t('Back')}
            </Button>
          </Box>
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}>
              {medicalreports?.file?.map((file, i) => (
                <Image key={i} src={file} sx={{ m: 1 }} />
              ))}
            </Box>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={medicalReportDialog.onTrue}>
              <Iconify icon="icon-park:edit-two" />
              &nbsp; {t('Update')}
            </Button>
          </Box>
        </Stack>
      </Box>

      <Dialog open={medicalReportDialog.value} onClose={medicalReportDialog.onFalse}>
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
            <RHFTextField
              lang="en"
              multiline
              name="description"
              label={t('description')}
              sx={{ mb: 2 }}
            />
            <RHFUpload
              multiple
              autoFocus
              fullWidth
              name="file"
              margin="dense"
              sx={{ mb: 2 }}
              variant="outlined"
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={medicalReportDialog.onFalse}>
              {t('Cancel')}
            </Button>
            <Button type="submit" loading={isSubmitting} variant="contained">
              {t('Upload')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}
