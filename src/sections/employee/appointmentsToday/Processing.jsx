import * as Yup from 'yup';
import { useParams } from 'react-router';
import { useTheme } from '@emotion/react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import { alpha } from '@mui/material/styles';
import {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
} from '@mui/lab';
import {
  Box,
  Card,
  Paper,
  Button,
  Dialog,
  Divider,
  Checkbox,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  useMediaQuery,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetPatient,
  useGetMedRecord,
  useGetOneEntranceManagement,
  useGetEntranceExaminationReports,
} from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFUpload, RHFTextField } from 'src/components/hook-form';

import Rooms from './rooms';
import History from './history';
import TabsView from './tabs-view';
import CheckList from './checkList';
import SickLeave from './sickLeave';
import Prescription from './prescription';
import ServicesProvided from './servicesProvided';
import Adjustabledocument from './adjustabledocument';

export default function Processing() {
  const { user } = useAuthContext();
  const params = useParams();
  const { id } = params;
  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });
  const { medicalreportsdata, refetch } = useGetEntranceExaminationReports(id);
  const { medRecord } = useGetMedRecord(Entrance?.service_unit?._id, Entrance?.patient?._id);
  const { data } = useGetPatient(Entrance?.patient?._id);
  const medicalReportDialog = useBoolean();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [ImgFiles, setImgFiles] = useState([]);
  const [privatSt, setprivate] = useState(false);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const PrescriptionsSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    file: Yup.array(),
    entrance_mangament: Yup.string(),
    description: Yup.string(),
    department: Yup.string(),
    Drugs_report: Yup.string(),
    medical_report: Yup.string(),
    private: Yup.boolean(),
  });

  const defaultValues = {
    employee: user?.employee?._id,
    patient: Entrance?.patient?._id,
    entrance_mangament: Entrance?._id,
    service_unit: Entrance?.service_unit,
    file: [],
    private: privatSt,
  };
  const [itemsToShow, setItemsToShow] = useState(2);

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(PrescriptionsSchema),
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
      service_unit: Entrance?.service_unit,
      entrance_mangament: Entrance?._id,
      file: [],
      // private: privatSt,
    });
  }, [user, Entrance, reset]);

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
  }, [setValue]);

  const removemedicalrepoort = async (IdToremove2) => {
    await axiosInstance.patch(endpoints.medicalreports.one(IdToremove2), {
      Activation: false,
    });

    enqueueSnackbar('Feild removed successfully', { variant: 'success' });
    refetch();
    reset();
  };

  const privateOrNotFunction = () => {
    enqueueSnackbar('private medical report can only seen by you', { variant: 'warning' });
    setprivate(!privatSt);
    setValue('private', !privatSt);
  };

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

      if (ImgFiles) {
        ImgFiles.forEach((file, index) => {
          formData.append(`file[${index}]`, file);
        });

        await axiosInstance.post(endpoints.history.all, {
          patient: Entrance?.patient?._id,
          name_english: 'A medical report has been added',
          name_arabic: 'تم ارفاق تقرير طبي',
          sub_english: `Medical report from ${Entrance?.service_unit?.name_english}`,
          sub_arabic: `تقرير طبي من ${Entrance?.service_unit?.name_arabic}`,
          actual_date: Entrance?.created_at,
          title: 'medical report',
          service_unit: Entrance?.service_unit?._id,
        });

        await axiosInstance.post('/api/examination', formData);

        await axiosInstance.patch(`/api/entrance/${id}`, {
          medical_report_status: true,
        });

        enqueueSnackbar('Medical report uploaded successfully', { variant: 'success' });
        refetch();
        setprivate();
        medicalReportDialog.onFalse();
        reset();
      }
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
  const handleBackClick = (idd) => {
    router.push(paths.employee.recored(idd));
  };
  const firstSequenceNumber =
    medRecord && medRecord.length > 0 ? medRecord[0].sequence_number : null;
  const TIMELINES = [
    {
      key: 0,
      title: (
        <>
          {firstSequenceNumber && (
            <span
              style={{ backgroundColor: '#22C55E', color: 'white', padding: 6, borderRadius: 10 }}
            >
              Visits history {firstSequenceNumber}
            </span>
          )}
          <br />
          <Box sx={{ maxHeight: 400, overflowY: 'auto', overflowX: 'hidden' }}>
            {medRecord?.slice(0, itemsToShow).map((test, i) => (
              <Box key={i}>
                <Button onClick={() => handleBackClick(test?._id)} sx={{ width: '100%', m: 1 }}>
                  {Entrance?.patient?.name_english} was here in {fDateTime(test?.created_at)}
                </Button>
                <Divider />
              </Box>
            ))}
          </Box>
          {medRecord?.length > itemsToShow && (
            <Button
              variant="contained"
              color="success"
              onClick={() => setItemsToShow(itemsToShow + 2)}
              sx={{ m: 2 }}
            >
              {t('Load More')}
            </Button>
          )}
        </>
      ),
      color: 'info',
      icon: <Iconify icon="healthicons:medical-records-outline" width={25} />,
    },
    {
      key: 1,
      title: <History />,
      color: 'primary',
      icon: <Iconify icon="eva:folder-add-fill" width={24} />,
    },
    {
      key: 4,
      title: <Rooms />,
      color: 'info',
      icon: <Iconify icon="cil:room" width={24} />,
    },
    {
      key: 3,
      title: (
        <>
          <span
            style={{ backgroundColor: '#22C55E', color: 'white', padding: 6, borderRadius: 10 }}
          >
            Choose a Check List
          </span>
          <CheckList />
        </>
      ),
      color: 'primary',
      icon: <Iconify icon="octicon:checklist-16" width={23} />,
    },

    {
      key: 5,
      title: 'medical report (optional)',
      color: 'info',

      icon:
        Entrance?.medical_report_status === true ? (
          <Iconify sx={{ color: '#fff' }} icon="icon-park-outline:correct" width={24} />
        ) : (
          <Iconify icon="streamline:checkup-medical-report-clipboard" width={23} />
        ),
    },
    // {
    //   key: 6,
    //   title: 'prescription (optional)',
    //   color: 'primary',
    //   icon:
    //     Entrance?.Drugs_report_status === true ? (
    //       <Iconify sx={{ color: '#fff' }} icon="icon-park-outline:correct" width={24} />
    //     ) : (
    //       <Iconify icon="material-symbols-light:prescriptions-outline" width={24} />
    //     ),
    // },
    // {
    //   key: 7,
    //   title: (
    //     <>
    //       sick leave (optional) <br />
    //       <SickLeave patient={data} service_unit={Entrance?.service_unit?._id} />
    //     </>
    //   ),
    //   color: 'info',
    //   icon: <Iconify icon="pepicons-pencil:leave" width={24} />,
    // },
    {
      key: 8,
      title: (
        <>
          Adjustable document (optional) <br />
          <Adjustabledocument patient={data} />
        </>
      ),
      color: 'primary',
      icon: <Iconify icon="mingcute:document-fill" width={24} />,
    },
    {
      key: 9,
      title: (
        <>
          Services provided
          <br />
          <ServicesProvided patient={data} />
        </>
      ),
      color: 'info',
      icon: <Iconify icon="hugeicons:give-pill" width={25} />,
    },
    {
      key: 10,
      title: (
        <>
         Test
          <br />
          <TabsView />
        </>
      ),
      color: 'info',
      icon: <Iconify icon="hugeicons:give-pill" width={25} />,
    },
  ];

  const renderPrescritption = <Prescription Entrance={Entrance} />;

  const renderMedicalReport = (
    <Card sx={{ mt: 1 }}>
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
          {`${info?.employee?.name_english} has add ${info?.description} medical report`}
          <br />
          <Button onClick={() => removemedicalrepoort(info?._id)}>
            Remove &nbsp; <Iconify icon="flat-color-icons:delete-database" />
          </Button>
          <Button
            onMouseOver={() => handleHover(info?._id)}
            onMouseOut={handleMouseOut}
            onClick={() => handleViewClick(info?._id)}
            sx={{ m: 1 }}
          >
            View &nbsp;{' '}
            <Iconify icon={hoveredButtonId === info?._id ? 'emojione:eye' : 'tabler:eye-closed'} />
          </Button>
        </Typography>
      ))}
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
          <Checkbox
            size="small"
            name="private"
            color="success"
            checked={privatSt}
            sx={{ position: 'relative', top: 5, left: 25 }}
            onChange={privateOrNotFunction}
          />
          <Typography
            sx={{
              color: 'text.secondary',
              mt: { md: -3, xs: -2.3 },
              ml: curLangAr ? { md: -31, xs: -5 } : { md: 8, xs: 4 },
              typography: 'caption',

              fontSize: { md: 15, xs: 10 },
            }}
          >
            Private
          </Typography>
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
    </Card>
  );

  const renderTimelineItems = (item) => (
    <Paper
      sx={{
        p: 3,
        bgcolor: (themee) => alpha(themee.palette.grey[500], 0.12),
        width: '100%',
      }}
    >
      <Typography variant="subtitle2">{item.title}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {item.title === 'medical report (optional)' && renderMedicalReport}
        {item.title === 'prescription (optional)' && renderPrescritption}
      </Typography>
    </Paper>
  );

  return isMobile ? (
    <div>
      {TIMELINES.map((item) => (
        <div key={item.key} style={{ marginBottom: '16px' }}>
          {renderTimelineItems(item)}
        </div>
      ))}
    </div>
  ) : (
    <Timeline position="alternate-reverse">
      {TIMELINES.map((item) => (
        <TimelineItem key={item.key}>
          <TimelineSeparator>
            <TimelineDot color={item.color}>{item.icon}</TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{renderTimelineItems(item)}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
