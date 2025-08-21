import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import {
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
import { useGetOneEntranceManagement, useGetEntranceExaminationReports } from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFUpload, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function Medicalreport() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });
  const [hoveredButtonId, setHoveredButtonId] = useState(null);

  const router = useRouter();

  const { medicalreportsdata, refetch } = useGetEntranceExaminationReports(id);

  const medicalReportDialog = useBoolean();
  const { user } = useAuthContext();
  const MedicalReportsSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    unit_service: Yup.string(),
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
    service_unit: Entrance?.service_unit?._id,
    unit_service: Entrance?.service_unit?._id,
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
      service_unit: Entrance?.service_unit,
      entrance_mangament: Entrance?._id,
      unit_service: Entrance?.service_unit?._id,
      file: [],
    });
  }, [user, Entrance, reset]);
  const removemedicalrepoort = async (IdToremove2) => {
    await axiosInstance.delete(endpoints.medicalreports.one(IdToremove2));
    const historyId = localStorage.getItem('historyId');
    await axiosInstance.patch(endpoints.history.remove_id(historyId), {
          type: 'medicalReport',
          id: IdToremove2,
        });

    enqueueSnackbar('Feild removed successfully', { variant: 'success' });
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
    router.push(paths.employee.Mediaclreport(idd));
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
      
      
      // await axiosInstance.post(endpoints.history.all, {
      //   patient: Entrance?.patient?._id,
      //   work_group: Entrance?.work_group,
      //   unit_service_patient: Entrance?.unit_service_patient,
      //   name_english: 'A medical report has been added',
      //   name_arabic: 'تم ارفاق تقرير طبي',
      //   sub_english: `Medical report from ${Entrance?.service_unit?.name_english}`,
      //   sub_arabic: `تقرير طبي من ${Entrance?.service_unit?.name_arabic}`,
      //   actual_date: Entrance?.created_at,
      //   title: 'medical report',
      //   medical_report: true,
      //   service_unit: Entrance?.service_unit?._id,
      // });
      
      const medicalReport = await axiosInstance.post('/api/examination', formData);
      const historyId = localStorage.getItem('historyId');
      await axiosInstance.patch(endpoints.history.one(historyId), {
        medical_report: true,
        medicalReportId: medicalReport?.data?.data?.examinationreports?._id,
      });
      await axiosInstance.patch(`/api/entrance/${id}`, {
        medical_report_status: true,
      });

      enqueueSnackbar('Medical report uploaded successfully', { variant: 'success' });
      refetch();
      medicalReportDialog.onFalse();

      reset();
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error uploading data', { variant: 'error' });
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
      <Button variant="outlined" color="success" onClick={medicalReportDialog.onTrue} sx={{ m: 2 }}>
        {t('Add medical report')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      {medicalreportsdata?.map((info, i) => (
        <Typography
          key={i}
          variant="h6"
          sx={{
            bgcolor: '#fff',
            m: 2,
            border: 2,
            borderRadius: 2,
            borderColor: '#EDEFF2',
            p: 2,
          }}
        >
          {curLangAr
            ? `قام ${info?.employee?.name_arabic} باضافة تقرير طبي جديد`
            : `${info?.employee?.name_english} has add ${info?.description} medical report`}
          <br />
          <Button onClick={() => removemedicalrepoort(info?._id)}>
            {t('Remove')} &nbsp; <Iconify icon="flat-color-icons:delete-database" />
          </Button>
          <Button
            onMouseOver={() => handleHover(info?._id)}
            onMouseOut={handleMouseOut}
            onClick={() => handleViewClick(info?._id)}
            sx={{ m: 1 }}
          >
            {t('View')} &nbsp;{' '}
            <Iconify icon={hoveredButtonId === info?._id ? 'emojione:eye' : 'tabler:eye-closed'} />
          </Button>
        </Typography>
      ))}
      <Dialog open={medicalReportDialog.value} onClose={medicalReportDialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'success.main', position: 'relative', top: '10px' }}>
            {curLangAr ? 'اضافة تقرير طبي  ' : 'add medical report'}
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
