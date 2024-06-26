import JsPdf from 'jspdf';
import * as Yup from 'yup';
import { addDays } from 'date-fns';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import { DatePicker } from '@mui/x-date-pickers';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  Table,
  Paper,
  Button,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  Box,
} from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';
import { fDateAndTime } from 'src/utils/format-time';

// import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetAnalyses, useGetPatientMedicalAnalyses } from 'src/api';

import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';

export default function MedicalAnalysis() {
  const today = new Date();

  const { id } = useParams();
  const { user } = useAuthContext()

  // Calculate max date as today's date
  const maxDate = addDays(today, 0); // You can adjust the offset if needed
  const dialog = useBoolean();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [ImgFiles, setImgFiles] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { analysisData, refetch } = useGetPatientMedicalAnalyses(id);
  const { analysesData } = useGetAnalyses()

  const [filtersbyname, setFiltersbyname] = useState();

  const dataFiltered = applyFilter({
    inputData: analysisData,
    filtersbyname,
  });

  const oldMedicalReportsSchema = Yup.object().shape({
    file: Yup.array().required(),
    name: Yup.string().required('File name is required'),
    note: Yup.string().nullable(),
    analyses_types: Yup.array(),
  });

  const defaultValues = {
    file: [],
    name: '',
    note: '',
    patient: id,
    unit_service: user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service._id,
    employee: user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id,
    analyses_types: [],
  };

  const methods = useForm({
    mode: 'onTouched',
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

    const isValidSize = (fileSize) => fileSize <= 3145728;

    return {
      validateSize: isValidSize,
    };
  };
  const handleDrop = (acceptedFiles) => {
    const fileValidator = fuser(acceptedFiles.reduce((acc, file) => acc + file.size, 0));

    const isValidFiles = acceptedFiles.every(
      (file) =>
        // const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        fileValidator.validateSize(file.size)
    );

    if (isValidFiles) {
      // setFiles(acceptedFiles); // Save the files in state
      const newFiles = acceptedFiles;
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
      ImgFiles.forEach((f) => formData.append('file', f));
    }
    try {
      await axios.post(endpoints.patientMedicalAnalysis.all, formData);
      await axios.post(endpoints.history.all, {
        patient: id,
        name_english: 'a medical analyses has been added',
        name_arabic: 'تم اضافة تحليل طبي',
        sub_english: `medical analysis`,
        sub_arabic: `تحليل طبي`,
      });
      enqueueSnackbar('uploaded sucessfully');
      dialog.onFalse();
      reset();
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

  const closing = () => {
    // setShowAlert(false);
    dialog.onFalse();
  };

  const opening = () => {
    // setShowAlert(false);
    dialog.onTrue();
  };
  const downloadAsPDF = (report) => {
    // setShowAlert(false);
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
    try {
      const response = await axios.get(`/uploaded-files/patients/old_medical_reports/${url}`, {
        responseType: 'blob',
      });
      const blob = response.data;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      // Handle error
      console.error('Error fetching image:', error);
      throw error; // Rethrow the error if needed
    }
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
      <Button
        variant="outlined"
        color="success"
        onClick={opening}
        sx={{ gap: 1, mb: 5, display: { md: 'inline-flex', xs: 'none' } }}
      >
        {t('Upload medical analysis')}
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
        // onClick={() => setShowAlert(false)}
        sx={{ mb: 5, float: { md: 'right', xs: 'left' } }}
        placeholder="Search..."
      />

      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ mb: 2 }}>
            {t('upload medical analysis')}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <RHFTextField lang="en" name="name" label={t('File name')} sx={{ mb: 2 }} />

              <RHFMultiSelect
                label={t('analyses types')}
                fullWidth
                name="analyses_types"
                options={analysesData}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                sx={{ mb: 2 }}
              />

              <RHFUpload
                multiple
                autoFocus
                fullWidth
                name="file"
                sx={{ mb: 2 }}
                variant="outlined"
                onDrop={handleDrop}
              />

              <RHFTextField lang="en" name="note" label={t('More information')} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closing} variant="outlined" color="inherit">
              {t('Cancel')}
            </Button>
            <Button type="submit" loading={isSubmitting} variant="contained">
              {t('Upload')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <TableContainer
        component={Paper}
        sx={{ border: '1px solid lightgray', borderRadius: '6px', mb: 2 }}
      >
        <Table sx={{ mb: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell> {t('File Name')}</TableCell>
              <TableCell> {t('analysis types')}</TableCell>
              <TableCell> {t('Date')}</TableCell>
              <TableCell> {t('Note')}</TableCell>
              <TableCell> {t('Options')}</TableCell>
            </TableRow>
          </TableHead>
          {dataFiltered?.map((info, i) => (
            <TableBody key={i}>
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

                <TableCell>{fDateAndTime(info?.created_at)}</TableCell>
                {info?.note && (
                  <TableCell>
                    {info.note}
                  </TableCell>
                )}
                <TableCell>
                  <Button onClick={() => downloadAsPDF(info)} variant="outlined" sx={{ mr: 1 }}>
                    {t('Download')} &nbsp; <Iconify icon="flat-color-icons:download" />
                  </Button>
                  {/* <Button
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
                  </Button> */}
                </TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>
      </TableContainer>
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
