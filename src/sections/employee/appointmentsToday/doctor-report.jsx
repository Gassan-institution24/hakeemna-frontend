import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetMedRecord, useGetEntranceDoctorReports } from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFUpload, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function Doctorreport( {Entrance} ) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const { medRecord } = useGetMedRecord(
    Entrance?.service_unit?._id,
    Entrance?.patient?._id,
    Entrance?.unit_service_patient
  );

  const [hoveredButtonId, setHoveredButtonId] = useState(null);

  const router = useRouter();

  const { doctorreportsdata, refetch } = useGetEntranceDoctorReports(id);

  const firstSequenceNumber =
    medRecord && medRecord.length > 0 ? medRecord[0].sequence_number : null;
  const doctoReportDialog = useBoolean();
  const { user } = useAuthContext();
  const MedicalReportsSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    file: Yup.array(),
    entrance_mangament: Yup.string(),
    description: Yup.string(),
    department: Yup.string(),
    Drugs_report: Yup.string(),
    medical_report: Yup.string(),
  });

  const defaultValues = {
    employee: user?.employee?._id,
    patient: Entrance?.patient?._id,
    unit_service_patient: Entrance?.unit_service_patient,
    entrance_mangament: Entrance?._id,
    service_unit: Entrance?.service_unit,
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    file: [],
  };
  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(MedicalReportsSchema),
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
    reset({
      employee: user?.employee?._id,
      patient: Entrance?.patient?._id,
      unit_service_patient: Entrance?.unit_service_patient,
      unit_service:
        user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
          ?._id,
      service_unit: Entrance?.service_unit,
      entrance_mangament: Entrance?._id,
      file: [],
    });
  }, [user, Entrance, reset]);

  const removemedicalrepoort = async (IdToremove2) => {
    await axiosInstance.patch(endpoints.doctorreport.one(IdToremove2), {
      Activation: false,
    });

    enqueueSnackbar(t('Feild removed successfully'), { variant: 'success' });
    refetch();
    reset();
  };

  const handleDrop = (acceptedFiles) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png'];
    const maxFileSizeInBytes = 5 * 1024 * 1024;
    const allowedTypesDisplay = allowedTypes.join(', ');
    const maxFileSizeDisplay = '5 MB';

    const invalidFiles = {
      type: [],
      size: [],
    };

    const validFiles = [];

    acceptedFiles.forEach((file) => {
      const isTypeValid = allowedTypes.some((ext) => file.name.toLowerCase().endsWith(ext));
      const isSizeValid = file.size <= maxFileSizeInBytes;

      if (!isTypeValid) invalidFiles.type.push(file.name);
      if (!isSizeValid) invalidFiles.size.push(file.name);

      if (isTypeValid && isSizeValid) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setValue('file', [...values.file, ...validFiles]);
    }

    if (invalidFiles.type.length > 0) {
      enqueueSnackbar(
        `${t('Invalid file type')}, ${t('Allowed types are')}: ${allowedTypesDisplay}`,
        { variant: 'error' }
      );
    }

    if (invalidFiles.size.length > 0) {
      enqueueSnackbar(
        `${t('File size too large')}, ${t('Maximum allowed size is')}: ${maxFileSizeDisplay}`,
        { variant: 'error' }
      );
    }
  };

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.file.filter((file) => file !== inputFile);
      setValue('file', filtered);
    },
    [setValue, values.file]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('file', []);
  }, [setValue]);

  const handleViewClick = (idd) => {
    router.push(paths.employee.Doctorreport(idd));
  };
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

      await axiosInstance.post('/api/doctorreport', formData);

      enqueueSnackbar(t('Doctor Report created successfully'), { variant: 'success' });
      refetch();
      doctoReportDialog.onFalse();
      reset();
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(t('Error uploading data'), { variant: 'error' });
    }
  };

  const handleHover = (hoverdId) => {
    setHoveredButtonId(hoverdId);
  };
  const handleMouseOut = () => {
    setHoveredButtonId(null);
  };

  return (
    <>
      {firstSequenceNumber ? <sapn style={{ color: '#00B8D9' }}>{firstSequenceNumber}</sapn> : ''}

      <br />
      <Button variant="outlined" color="success" onClick={doctoReportDialog.onTrue} sx={{ m: 2 }}>
        {t('Add to patient file')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      {doctorreportsdata?.map((info, i) => (
        <Box
          key={info?._id || i}
          sx={{
            bgcolor: '#fff',
            border: 2,
            borderRadius: 2,
            borderColor: '#EDEFF2',
            p: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {curLangAr ? info?.employee?.name_arabic : info?.employee?.name_english}
            </Typography>
            {info?.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {info.description}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" color="error" onClick={() => removemedicalrepoort(info?._id)}>
              {t('Remove')} &nbsp; <Iconify icon="flat-color-icons:delete-database" />
            </Button>
            <Button
              size="small"
              onMouseOver={() => handleHover(info?._id)}
              onMouseOut={handleMouseOut}
              onClick={() => handleViewClick(info?._id)}
              sx={{ m: 0.5 }}
            >
              {t('View')} &nbsp;
              <Iconify icon={hoveredButtonId === info?._id ? 'emojione:eye' : 'tabler:eye-closed'} />
            </Button>
          </Box>
        </Box>
      ))}
      <Dialog open={doctoReportDialog.value} onClose={doctoReportDialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'success.main', position: 'relative', top: '10px' }}>
            {t('Add to patient file')}
          </DialogTitle>
          <DialogContent>
            <RHFTextField
              lang="en"
              multiline
              name="description"
              label={t('description')}
              rows={10}
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
            <Button variant="outlined" color="inherit" onClick={doctoReportDialog.onFalse}>
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

  Doctorreport.propTypes = {
  Entrance: PropTypes.object,
};
