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

import { useLocales, useTranslate } from 'src/locales';
import { useGetOnedoctorreports } from 'src/api/doctor_report';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify/iconify';
import FormProvider, { RHFUpload, RHFTextField } from 'src/components/hook-form';

export default function MdicalreportPage() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const { doctorreports, refetch } = useGetOnedoctorreports(id);
  const [ImgFiles, setImgFiles] = useState([]);
  const medicalReportDialog = useBoolean();
  const navigate = useNavigate();
  const doctorreportschema = Yup.object().shape({
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
    mode: 'all',
    resolver: yupResolver(doctorreportschema),
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
    if (doctorreports) {
      reset({
        file: doctorreports.file || [],
        description: doctorreports.description || '',
      });
    }
  }, [doctorreports, reset]);

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

      await axiosInstance.patch(`/api/doctorreport/${id}`, submitdata);

      enqueueSnackbar( t('Doctor Report updated successfully'), { variant: 'success' });
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
            p: 4,
            width: '85%',
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              pb: 2,
              borderBottom: '1px solid #eee',
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              {t('Doctor Report Details')}
            </Typography>

            <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
              {t('Date')} : {fDateTime(doctorreports?.created_at)}
            </Typography>
          </Box>

          {/* Doctor */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {t('doctor')} :
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {curLangAr
                  ? doctorreports?.employee?.name_arabic
                  : doctorreports?.employee?.name_english}
              </Typography>
            </Box>
          </Box>
          {/* Patient */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {t('patient')} :
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {curLangAr
                  ? doctorreports?.unit_service_patient?.name_arabic ||
                    doctorreports?.unit_service_patient?.name_english
                  : doctorreports?.unit_service_patient?.name_english ||
                    doctorreports?.unit_service_patient?.name_arabic}
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          {doctorreports?.description && (
            <Box
              sx={{
                mb: 4,
                p: 2,
                bgcolor: '#fafafa',
                borderLeft: '4px solid #4CAF50',
                borderRadius: 1,
              }}
            >
              <Typography fontWeight={600} mb={0.5}>
                {t('description')}
              </Typography>
              <Typography color="text.secondary">{doctorreports?.description}</Typography>
            </Box>
          )}

          {/* Attachments */}
          {doctorreports?.file?.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>{t('Attachments')}</Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' },
                  gap: 1,
                }}
              >
                {doctorreports?.file?.map((file, i) => (
                  <Image key={i} src={file} sx={{ borderRadius: 1 }} />
                ))}
              </Box>
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="text" onClick={() => navigate(-1)}>
              <Iconify icon="icon-park:back" />
              &nbsp; {t('Back')}
            </Button>

            <Button variant="outlined" onClick={medicalReportDialog.onTrue}>
              <Iconify icon="icon-park:edit-two" />
              &nbsp; {t('Update')}
            </Button>
          </Box>
        </Stack>
      </Box>

      <Dialog open={medicalReportDialog.value} onClose={medicalReportDialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'success.main', position: 'relative', top: '10px' }}>
            {curLangAr ? 'تعديل التقرير الطبي' : 'update medical report'}
          </DialogTitle>
          <DialogContent>
            <RHFTextField
              lang="en"
              multiline
              name="description"
              label={t('description')}
              sx={{ mb: 2, mt: 2 }}
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
