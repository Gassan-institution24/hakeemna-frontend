import * as Yup from 'yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  Box,
  Table,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  TableContainer,
} from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';
import { fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetAnalyses, useGetPatientMedicalAnalyses } from 'src/api';

import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFUpload, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';

export default function MedicalAnalysis() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const dialog = useBoolean();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();

  const { analysisData, refetch } = useGetPatientMedicalAnalyses(id);
  const { analysesData } = useGetAnalyses();

  const [filtersbyname, setFiltersbyname] = useState();

  const dataFiltered = applyFilter({
    inputData: analysisData,
    filtersbyname,
  });

  const oldMedicalReportsSchema = Yup.object().shape({
    file: Yup.mixed(),
    name: Yup.string().required('File name is required'),
    note: Yup.string().nullable(),
    analysis: Yup.array(),
  });

  const defaultValues = {
    file: null,
    name: '',
    note: '',
    patient: id,
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service._id,
    employee: user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id,
    analysis: [],
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(oldMedicalReportsSchema),
    defaultValues,
  });

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = (acceptedFile) => {
    const newFile = acceptedFile;
    setValue('file', newFile);
  };

  const handleShowFile = (file) => {
    const link = document.createElement('a');
    link.href = file;
    link.textContent = file;
    link.target = '_blank';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    try {
      await axios.post(endpoints.patientMedicalAnalysis.all, formData);
      enqueueSnackbar('uploaded sucessfully');
      dialog.onFalse();
      reset();
      refetch();
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="success"
        onClick={dialog.onTrue}
        sx={{ gap: 1, mb: 5, display: { md: 'inline-flex', xs: 'none' } }}
      >
        {t('Upload medical analysis')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      <Button
        variant="outlined"
        color="success"
        onClick={dialog.onTrue}
        sx={{ gap: 1, mb: 5, m: 1, display: { md: 'none', xs: 'inline-flex' } }}
      >
        {t('new')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      <TextField
        onChange={(e) => setFiltersbyname(e.target.value)}
        name="name"
        sx={{ mb: 5, float: { md: 'right', xs: 'left' } }}
        placeholder="Search..."
      />

      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ mb: 2 }}>{t('upload medical analysis')}</DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <RHFTextField lang="en" name="name" label={t('File name')} sx={{ mb: 2 }} />

              <RHFMultiSelect
                label={t('analyses types')}
                fullWidth
                name="analysis"
                options={analysesData}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                sx={{ mb: 2 }}
              />

              <RHFUpload
                multiple
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
            <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
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
          <TableBody>
            {dataFiltered?.map((info, i) => (
              <TableRow key={i}>
                <TableCell>
                  {info?.name && info.name.length > 10
                    ? `${info.name.substring(0, 10)}...`
                    : info?.name}
                </TableCell>
                <TableCell>
                  {info?.analysis
                    ?.map((one) => (curLangAr ? one.name_arabic : one.name_english || ''))
                    .join(', ')
                    ?.substring(0, 20)}
                </TableCell>
                <TableCell>{fDateAndTime(info?.created_at)}</TableCell>
                <TableCell>{info.note}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleShowFile(info.file)}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  >
                    {t('file')} &nbsp; <Iconify icon="ph:file" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
