import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import { DatePicker } from '@mui/x-date-pickers';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Iconify from 'src/components/iconify/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { MenuItem, Typography, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';
import axios from 'src/utils/axios';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Image from 'src/components/image/image';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import {
  Page,
  Text,
  View,
  Document,
  PDFDownloadLink,
  StyleSheet,
  Image as PdfImage,
} from '@react-pdf/renderer';
import { useAuthContext } from 'src/auth/hooks';
import { fDate } from 'src/utils/format-time';
import File from '../other/_examples/mui/dialog-view/File.png';

export default function OldMedicalReports() {
  const popover = usePopover();
  const dialog = useBoolean();

  const [files, setFiles] = useState(null);
  const [filesPdf, setfilesPdf] = useState([]);
  const [filesPdftodelete, setfilesPdftodelete] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

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
      await axios.delete(`/api/oldmedicalreports/${filesPdftodelete._id}`);
      enqueueSnackbar('Medical report deleted successfully', { variant: 'success' });
      const response = await axios.get('/api/oldmedicalreports');
      setfilesPdf(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Unable to delete', { variant: 'error' });
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
      justifyContent:'flex-start',
      alignItems: 'center',
      padding: '10px',
      borderBottom: 1,
      gap:132
    },
    line: {
      textDecoration: 'none',
    },
    gridFooter: {
      borderTop: 1,
      padding:'10px'
    },
  });
  const router = useRouter();
  const oldMedicalReportsSchema = Yup.object().shape({
    type: Yup.string().required(),
    date: Yup.date().required('Date is required'),
    file: Yup.string().required(),
    name: Yup.string().required('File name is required'),
    note: Yup.string(),
    specialty: Yup.string().required(),
  });

  const TYPE = ['Blod Test', 'X-ray Test', 'Health Check Test', 'Heart examination Test'];
  const SPECIALTY = ['Bones', 'Heart'];

  const defaultValues = {
    type: '',
    date: '',
    file: '',
    name: '',
    note: '',
    specialty: '',
  };

  const MedicalreportsnPDF = (
    { info } // Destructure info from props
  ) => (
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
  );

  MedicalreportsnPDF.propTypes = {
    info: PropTypes.shape({
      type: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      file: PropTypes.string,
      name: PropTypes.string,
      note: PropTypes.string,
      specialty: PropTypes.string,
      created_at: PropTypes.string.isRequired,
    }),
  };
  const methods = useForm({
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
    const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif', 'pdf'];

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
  // Inside the AccountGeneral component
  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Validate file before setting the profile picture
    const fileValidator = fuser(file.size);

    if (fileValidator.validateFile(file.name) && fileValidator.validateSize(file.size)) {
      setFiles(file); // Save the file in state
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setValue('file', newFile);
    } else {
      // Handle invalid file type or size
      enqueueSnackbar('Invalid file type or size', { variant: 'error' });
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    const filesPath = files ? files.path.replace(/\\/g, '//') : '';
    Object.keys(data).forEach((key) => {
      formData.append(key, key === 'file' ? filesPath : data[key]);
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
      console.log(response.data);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Failed to upload medical report', { variant: 'error' });
    }
  };
  return (
    <>
      <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ gap: 1, mb: 5 }}>
        Upload Your Perscription
        <Iconify icon="mingcute:add-line" />
      </Button>

      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
            IMPORTANT
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 5, fontSize: 14 }}>
              The interpretation and evaluation of the results should not be done individually, but
              rather in the presence of a physician who is consulted on those results and taking
              into account the full medical context of the patient’s condition.
            </Typography>
            <RHFTextField lang="en" name="name" label="File name*" sx={{ mb: 1.5 }} />
            <RHFSelect
              label="Type*"
              fullWidth
              name="type"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 1.5 }}
            >
              {TYPE.map((test) => (
                <MenuItem value={test} key={test._id} sx={{mb:1}}>
                  {test}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              label="Specialty*"
              fullWidth
              name="specialty"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 1 }}
            >
              {SPECIALTY.map((test) => (
                <MenuItem value={test} key={test._id} sx={{mb:1}}>
                  {test}
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
            />
            <RHFTextField lang="en" name="note" label="More information" />
          </DialogContent>

          <DialogActions>
            <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} variant="contained">
              Upload
            </Button>
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
              <ListItemText>{info.type} File</ListItemText>
            </Box>

            <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              arrow="left-bottom"
              sx={{ boxShadow: 'none', width: 'auto' }}
            >
              <PDFDownloadLink
                key={i}
                document={<MedicalreportsnPDF info={info} />}
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
                  Download
                </MenuItem>
              </PDFDownloadLink>
              <MenuItem
                onClick={() => {
                  delteeFile();
                  popover.onClose();
                }}
                onClose={popover.onClose}
                sx={{ color: 'red' }}
              >
                <Iconify icon="material-symbols:delete-outline" />
                Delete
              </MenuItem>
            </CustomPopover>
          </Box>
        ))}
      </Box>
    </>
  );
}
