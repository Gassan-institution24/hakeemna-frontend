import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image as PdfImage,
} from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grow from '@mui/material/Grow';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import { alpha } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import { DatePicker } from '@mui/x-date-pickers';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Button, MenuItem, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';
import { fDate } from 'src/utils/format-time';

import { useGetSpecialties } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image/image';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';

import File from './imges/File.jpg';

export default function OldMedicalReports() {
  const popover = usePopover();
  const dialog = useBoolean();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [files, setFiles] = useState([]);
  const [filesPdf, setfilesPdf] = useState([]);
  console.log(filesPdf);
  const [filesPdftodelete, setfilesPdftodelete] = useState([]);
  const [checkChange, setCheckChange] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { specialtiesData } = useGetSpecialties();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/oldmedicalreports');
        setfilesPdf(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const delteeFile = async () => {
    try {
      await axios.patch(`/api/oldmedicalreports/${filesPdftodelete._id}`, {
        Activation: 'Inactive',
      });
      enqueueSnackbar(
        `${curLangAr ? 'تم حذف التقرير بنجاح' : 'Medical report deleted successfully'}`,
        { variant: 'success' }
      );
      const response = await axios.get('/api/oldmedicalreports');
      setfilesPdf(response.data);
    } catch (error) {
      enqueueSnackbar(`${curLangAr ? 'حدث خطأ ما, الرجاء المحاوله لاحقا' : 'Unable to delete'}`, {
        variant: 'error',
      });
    }
  };
  const styles = StyleSheet.create({
    icon: {
      color: 'blue',
      position: 'relative',
      top: '3px',
    },
    image: {
      width: '90%',
      height: '90%',
      marginTop: 15,
      marginLeft: 30,
    },
    page: {
      backgroundColor: 'aliceblue',
      border: 1,
    },
    text: {
      fontSize: 12,
      color: 'gray',
    },
    gridContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
    },
    gridContainer2: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: '10px',
      borderBottom: 1,
      gap: 132,
    },
    line: {
      textDecoration: 'none',
    },
    gridFooter: {
      borderTop: 1,
      padding: '10px',
    },
  });
  // const router = useRouter();
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

  const MedicalreportsnPDF = useCallback(
    ({ info }) => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View>
            <View style={styles.gridContainer}>
              <Text style={styles.text}>
                <Text style={{ color: 'black', fontSize: '14px', justifyContent: 'space-between' }}>
                  Test Type:
                </Text>{' '}
                {info.type}
              </Text>
              <Text style={styles.text}>
                <Text style={{ color: 'black', fontSize: '14px', justifyContent: 'space-between' }}>
                  Test Date:
                </Text>{' '}
                {fDate(info.date)}
              </Text>
              <Text style={styles.text}>
                <Text style={{ color: 'black', fontSize: '14px', justifyContent: 'space-between' }}>
                  Date:
                </Text>{' '}
                {fDate(info.created_at)}
              </Text>
            </View>
            <View style={styles.gridContainer2}>
              <Text style={styles.text}>
                <Text style={{ color: 'black', fontSize: '14px', justifyContent: 'space-between' }}>
                  Test name:
                </Text>{' '}
                {info.name}
              </Text>
              <Text style={styles.text}>
                <Text style={{ color: 'black', fontSize: '14px', justifyContent: 'space-between' }}>
                  Specialty:
                </Text>{' '}
                {info.specialty}
              </Text>
            </View>
            <View>
              <PdfImage src={info?.file} style={styles.image} />
            </View>
            <View style={styles.gridFooter}>
              <Text style={styles.text}>
                <Text style={{ color: 'black', fontSize: '14px', justifyContent: 'space-between' }}>
                  Note:
                </Text>{' '}
                {info.note}
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    ),
    [styles]
  );
  // console.log(info,"dfdfdf")
  MedicalreportsnPDF.propTypes = {
    info: PropTypes.shape({
      type: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      file: PropTypes.array,
      name: PropTypes.string,
      note: PropTypes.string,
      specialty: PropTypes.string,
      created_at: PropTypes.string.isRequired,
    }),
  };
  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(oldMedicalReportsSchema),
    defaultValues,
  });
  const {
    // setValue,
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const fuser = (fuserSize) => {
    const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.pdf'];

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
      const newFiles = acceptedFiles.map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
      }));
      setFiles('file', newFiles);
    } else {
      // Handle invalid file type or size
      enqueueSnackbar('Invalid file type or size', { variant: 'error' });
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    if (files) {
      formData.append('medicalreports', files);
    }
    try {
      await axios.post('/api/oldmedicalreports', formData);
      enqueueSnackbar('medical report uploaded successfully', { variant: 'success' });
      dialog.onFalse();
      const response = await axios.get('/api/oldmedicalreports');
      setfilesPdf(response.data);
      reset();
      setCheckChange(!checkChange);

      // console.log('data', data);
      // console.log('formData', formData);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
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
              label={t('Type*')}
              fullWidth
              name="type"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 1.5 }}
            >
              {TYPE.map((test) => (
                <MenuItem value={test} key={test._id} sx={{ mb: 1 }}>
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
              {specialtiesData.map((test) => (
                <MenuItem value={test?._id} key={test._id} sx={{ mb: 1 }}>
                  {test?.name_english}
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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { md: '1fr 1fr 1fr 1fr', xs: '1fr 1fr' },
          gap: 4,
        }}
      >
        {filesPdf.map((info, i) => (
          <Box>
            <Box>
              <Image
                src={File}
                sx={{
                  width: { md: '80px', xs: '50px' },
                  height: { md: '80px', xs: '50px' },
                  mb: '15px',
                }}
              />
              <IconButton
                onClick={(event) => {
                  popover.onOpen(event);
                  setfilesPdftodelete(info);
                }}
                sx={{ position: 'absolute' }}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
              <ListItemText>
                {info.type} &nbsp;
                {/* {t('File')} */}File
              </ListItemText>
            </Box>

            <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              arrow="left-bottom"
              sx={{ boxShadow: 'none', width: 'auto' }}
            >
              <PDFDownloadLink
                key={i}
                document={<MedicalreportsnPDF info={filesPdf} />}
                fileName={`${user?.patient.first_name} ${info.type} MediacalReport.pdf`}
                style={styles.line}
              >
                <MenuItem
                  sx={{ color: 'rgb(41, 41, 41)' }}
                  onClick={() => {
                    popover.onClose();
                  }}
                >
                  <Iconify icon="heroicons-solid:folder-download" />
                  {t('Download')}
                </MenuItem>
              </PDFDownloadLink>
              <MenuItem
                onClick={() => {
                  setShowAlert(true);
                  popover.onClose();
                }}
                onClose={popover.onClose}
                sx={{ color: 'red' }}
              >
                <Iconify icon="material-symbols:delete-outline" />
                {t('Delete')}
              </MenuItem>
            </CustomPopover>
          </Box>
        ))}
      </Box>
    </>
  );
}
