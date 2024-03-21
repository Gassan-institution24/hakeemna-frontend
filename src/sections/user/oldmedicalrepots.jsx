import JsPdf from 'jspdf';
import * as Yup from 'yup';
import React, { useState, useEffect } from 'react';
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
  Button,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';
import { fDate } from 'src/utils/format-time';

import { useGetSpecialties } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';

export default function OldMedicalReports() {
  const dialog = useBoolean();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [ImgFiles, setImgFiles] = useState([]);
  const [Filesdata, setFilesdata] = useState([]);
  const [FileToDelete, setFileToDelete] = useState([]);
  const [checkChange, setCheckChange] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { specialtiesData } = useGetSpecialties();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/oldmedicalreports');
        setFilesdata(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const delteeFile = async () => {
    try {
      await axios.patch(`/api/oldmedicalreports/${FileToDelete}`, {
        Activation: 'Inactive',
      });
      enqueueSnackbar(
        `${curLangAr ? 'تم حذف التقرير بنجاح' : 'Medical report deleted successfully'}`,
        { variant: 'success' }
      );
      const response = await axios.get('/api/oldmedicalreports');
      setFilesdata(response.data);
    } catch (error) {
      enqueueSnackbar(`${curLangAr ? 'حدث خطأ ما, الرجاء المحاوله لاحقا' : 'Unable to delete'}`, {
        variant: 'error',
      });
    }
  };
  const oldMedicalReportsSchema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    file: Yup.array().required(),
    name: Yup.string().required('File name is required'),
    note: Yup.string(),
    agree: Yup.boolean().required(),
    specialty: Yup.string().required(),
  });

  const defaultValues = {
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
      setValue(newFiles);
      setImgFiles((currentFiles) => [...currentFiles, ...newFiles]);
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
      console.log(Object.fromEntries(formData), 'sdsd');
      await axios.post('/api/oldmedicalreports', formData);
      enqueueSnackbar('medical report uploaded successfully', { variant: 'success' });
      dialog.onFalse();
      const response = await axios.get('/api/oldmedicalreports');
      setFilesdata(response.data);
      reset();
      setCheckChange(!checkChange);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const downloadAsPDF = (report) => {
    // Create a new PDF instance
    const pdf = new JsPdf();

    // Add report details to the PDF
    pdf.text(`File Name: ${report.name}`, 10, 10);
    pdf.text(`Specialty: ${report.specialty.name_english}`, 10, 20);
    pdf.text(`Date: ${fDate(report.date)}`, 10, 30);
    if (report.note) {
      pdf.text(`Note: ${report.note}`, 10, 40);
    }

    // Save the PDF
    pdf.save(`${report.name}.pdf`);
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
                    delteeFile();
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
      {Filesdata?.map((info, i) => (
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

                <TableCell>{fDate(info?.date)}</TableCell>
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
                    onClick={() => {
                      setFileToDelete(info?._id);
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
