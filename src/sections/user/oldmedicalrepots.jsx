import JsPdf from 'jspdf';
import * as Yup from 'yup';
import { addDays } from 'date-fns';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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
import {
  Table,
  Paper,
  Stack,
  Button,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';
import { fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetSpecialties, useGetPatintoldmedicalreports } from 'src/api';

import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';

export default function OldMedicalReports() {
  // Inside the OldMedicalReports component
  const today = new Date(); // Get today's date

  // Calculate max date as today's date
  const maxDate = addDays(today, 0); // You can adjust the offset if needed
  const dialog = useBoolean();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [ImgFiles, setImgFiles] = useState([]);
  const [FileToDelete, setFileToDelete] = useState([]);
  const [checkChange, setCheckChange] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { specialtiesData } = useGetSpecialties({ select: 'name_english name_arabic' });
  const { oldmedicalreportsdata, refetch } = useGetPatintoldmedicalreports(user?.patient?._id);
  const [spName, setspName] = useState();
  const handleHover = (id) => {
    setHoveredButtonId(id);
  };
  const [filtersbyname, setFiltersbyname] = useState();

  const dataFiltered = applyFilter({
    inputData: oldmedicalreportsdata,
    filtersbyname,
  });

  const handleMouseOut = () => {
    setHoveredButtonId(null);
  };
  const handleViewClick = (id) => {
    router.push(paths.dashboard.user.oldmedicalreportsview(id));
  };

  const delteeFile = async () => {
    try {
      await axios.patch(`/api/oldmedicalreports/${FileToDelete?._id}`, {
        Activation: 'Inactive',
      });
      enqueueSnackbar(
        `${curLangAr ? 'تم حذف التقرير بنجاح' : 'Medical report deleted successfully'}`,
        { variant: 'success' }
      );
      refetch();
    } catch (error) {
      enqueueSnackbar(`${curLangAr ? 'حدث خطأ ما, الرجاء المحاوله لاحقا' : 'Unable to delete'}`, {
        variant: 'error',
      });
    }
  };
  const oldMedicalReportsSchema = Yup.object().shape({
    date: Yup.mixed().required('Date is required'),
    file: Yup.array().required(),
    name: Yup.string().required('File name is required'),
    note: Yup.string().nullable(),
    agree: Yup.boolean().required(),
    specialty: Yup.string().required(),
  });

  const defaultValues = {
    date: '',
    file: [],
    name: '',
    note: '',
    patient: user?.patient?._id,
    agree: !checkChange,
    specialty: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(oldMedicalReportsSchema),
    defaultValues,
  });
  const {
    setValue,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

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
      (file) =>
        // const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        fileValidator.validateFile(file.name) && fileValidator.validateSize(file.size)
    );

    if (isValidFiles) {
      // setFiles(acceptedFiles); // Save the files in state
      const newFiles = acceptedFiles;
      console.log('newFiles', newFiles);
      setImgFiles((currentFiles) => [...currentFiles, ...newFiles]);
      setValue('file', [...values.file, ...newFiles]);
    } else {
      // Handle invalid file type or size
      enqueueSnackbar(t('Invalid file type or size'), { variant: 'error' });
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    if (ImgFiles) {
      ImgFiles.forEach((f) => formData.append('medicalreports[]', f));
    }
    try {
      await axios.post('/api/oldmedicalreports', formData);
      // await axios.post(endpoints.history.all, {
      //   patient: user?.patient?._id,
      //   name_english: 'a medical report has been created',
      //   name_arabic: 'تم انشاء تقرير طبي',
      //   sub_english: `${spName} medical report`,
      //   sub_arabic: ` تقرير طبي لتخصص ال ${spName}`,
      //   actual_date: data?.date,
      // });
      enqueueSnackbar('medical report uploaded successfully', { variant: 'success' });
      dialog.onFalse();
      reset();
      setCheckChange(!checkChange);
      refetch();
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const closing = () => {
    setShowAlert(false);
    dialog.onFalse();
  };

  const opening = () => {
    setShowAlert(false);
    dialog.onTrue();
  };
  const downloadAsPDF = (report) => {
    setShowAlert(false);
    // Create a new PDF instance
    const pdf = new JsPdf();

    // Load Arabic font
    pdf.addFont('/fonts/IBMPlexSansArabic-Regular.ttf', 'ArabicFont', 'normal');

    // Set font to the loaded Arabic font
    pdf.setFont('ArabicFont');

    // Add report details to the PDF
    pdf.text(`File Name: ${report.name}`, 10, 10);
    pdf.text(`Specialty: ${report.specialty.name_english}`, 10, 20);
    pdf.text(`Date: ${fDateAndTime(report.date)}`, 10, 30);
    pdf.text(`Note: `, 10, 40);

    if (report.note) {
      const maxLength = 50; // Maximum characters per line
      let startY = 40;
      let remainingText = report.note;
      while (remainingText.length > 0) {
        const currentLine = remainingText.substring(0, maxLength);
        pdf.text(`${currentLine}`, 25, startY);
        startY += 10; // Increment the y-position for the next line
        remainingText = remainingText.substring(maxLength);
      }
    }
    addImagesToPDF(pdf, report.file).then((modifiedPdf) => {
      modifiedPdf.save(`${report.name}.pdf`);
    });
  };

  const fetchImageAsBase64 = async (url) => {
    const response = await fetch(
      `http://localhost:3000/uploaded-files/patients/old_medical_reports/${url}`
    );
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const addImagesToPDF = async (doc, imageUrls) => {
    const imagePromises = imageUrls.map((url) => fetchImageAsBase64(url));
    const images = await Promise.all(imagePromises);

    images.forEach((base64data, index) => {
      doc.addImage(base64data, 'JPEG', 10, index * 10 + 60, 180, 200);
      if (index < imageUrls.length - 1) {
        doc.addPage();
      }
    });

    return doc;
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
                  {t('Cancel')}
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
                    delteeFile();
                  }}
                >
                  {t('Confirm')}
                </Button>
              </>
            }
          >
            {t('Please confirm the delettion of ')}
            {FileToDelete?.name}
          </Alert>
        </Grow>
      )}
      <Button
        variant="outlined"
        color="success"
        onClick={opening}
        sx={{ gap: 1, mb: 5, display: { md: 'inline-flex', xs: 'none' } }}
      >
        {t('Upload Your old medical report')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      <Button
        variant="outlined"
        color="success"
        onClick={opening}
        sx={{ gap: 1, mb: 5, m: 1, display: { md: 'none', xs: 'inline-flex' } }}
      >
        {t('new')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      <TextField
        onChange={(e) => setFiltersbyname(e.target.value)}
        name="name"
        onClick={() => setShowAlert(false)}
        sx={{ mb: 5, float: { md: 'right', xs: 'left' } }}
        placeholder="Search..."
      />

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
            <RHFTextField name="name" label={t('File name*')} sx={{ mb: 2 }} />

            <RHFSelect
              label={t('Specialty*')}
              fullWidth
              name="specialty"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 2 }}
            >
              {specialtiesData.map((test, idx) => (
                <MenuItem
                  lang="ar"
                  value={test?._id}
                  key={idx}
                  sx={{ mb: 1 }}
                  onClick={() => setspName(test?.name_english)}
                >
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
                  label={t('Date of making the medical report*')}
                  maxDate={maxDate}
                  sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
              variant="outlined"
              onDrop={handleDrop}
              multiple
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
            />

            <RHFTextField name="note" label={t('More information')} />
          </DialogContent>
          <Stack direction="row" gap={1} alignItems="center" sx={{ mx: 4 }}>
            <Checkbox
              size="small"
              name="agree"
              color="success"
              onChange={() => {
                setCheckChange(!checkChange);
              }}
            />
            <Typography
              sx={{
                color: 'text.secondary',
                typography: 'caption',
                textAlign: 'center',
                fontSize: { md: 12, xs: 10 },
              }}
            >
              {t('I have read and agreed to these ')}&nbsp;
              <Link underline="always" color="text.primary">
                {t('Terms of Service ')}&nbsp;
              </Link>
              {t('And the ')}&nbsp;
              <Link underline="always" color="text.primary">
                {t('Privacy Policy')}
              </Link>
              .
            </Typography>
          </Stack>
          <DialogActions>
            <Button onClick={closing} variant="outlined" color="inherit">
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

      {dataFiltered?.map((info, i) => (
        <TableContainer
          component={Paper}
          key={i}
          sx={{ border: '1px solid lightgray', borderRadius: '6px', mb: 2 }}
        >
          <Table sx={{ mb: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell> {t('File Name')}</TableCell>
                <TableCell> {t('Specialty')}</TableCell>
                <TableCell> {t('Date')}</TableCell>
                {info?.note ? <TableCell> {t('Note')}</TableCell> : ''}

                <TableCell> {t('Options')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  {info?.name && info.name.length > 10
                    ? `${info.name.substring(0, 10)}...`
                    : info?.name}
                </TableCell>

                {curLangAr ? (
                  <TableCell>{info?.specialty?.name_arabic.substring(0, 12) || ''}</TableCell>
                ) : (
                  <TableCell>{info?.specialty?.name_english.substring(0, 12) || ''}</TableCell>
                )}

                <TableCell>{fDateAndTime(info?.date)}</TableCell>
                {info?.note && (
                  <TableCell>
                    {info.note.length > 7 ? `${info.note.substring(0, 7)}...` : info.note}
                  </TableCell>
                )}
                <TableCell>
                  <Button onClick={() => downloadAsPDF(info)} variant="outlined" sx={{ mr: 1 }}>
                    {t('Download')} &nbsp; <Iconify icon="flat-color-icons:download" />
                  </Button>
                  <Button
                    sx={{ mr: 1 }}
                    onMouseOver={() => handleHover(info?._id)}
                    onMouseOut={handleMouseOut}
                    onClick={() => handleViewClick(info?._id)}
                  >
                    {t('View')} &nbsp;{' '}
                    <Iconify
                      icon={hoveredButtonId === info?._id ? 'emojione:eye' : 'tabler:eye-closed'}
                    />
                  </Button>

                  <Button
                    onClick={() => {
                      setFileToDelete(info);
                      setShowAlert(true);
                    }}
                  >
                    {t('Delete')} &nbsp; <Iconify icon="flat-color-icons:delete-database" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </>
  );
}
function applyFilter({ inputData, filtersbyname }) {
  if (!filtersbyname) {
    return inputData;
  }

  if (filtersbyname) {
    inputData = inputData?.filter(
      (data) =>
        (data?.name && data?.name.toLowerCase().indexOf(filtersbyname?.toLowerCase()) !== -1) ||
        data?._id === filtersbyname ||
        JSON.stringify(data.code) === filtersbyname
    );
  }

  return inputData;
}
