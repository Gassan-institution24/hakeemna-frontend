/* eslint-disable no-nested-ternary */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Font } from '@react-pdf/renderer';
import { enqueueSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme, useMediaQuery } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import axiosInstance from 'src/utils/axios';
import { fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetAllPatientMedicalAnalyses } from 'src/api/medical_analysis_patient';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFUpload } from 'src/components/hook-form';
import EmptyContent from 'src/components/empty-content/empty-content';

import Back from './imges/back.webp';

Font.register({
  family: 'ArabicFont',
  src: '/fonts/IBMPlexSansArabic-Regular.ttf',
});
const truncateText = (text = '', limit = 20) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}…`;
};

export default function MedicalAnalysis() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const { user } = useAuthContext();
  const { analysisData, refetch } = useGetAllPatientMedicalAnalyses(user?.patient?._id);
  const [selectedId, setSelectedId] = React.useState(null);
  const [openUpload, setOpenUpload] = React.useState(false);
  const [existingFiles, setExistingFiles] = React.useState([]);
  const [previewFile, setPreviewFile] = React.useState(null);

  const handleOpenUpload = (info) => {
    setSelectedId(info._id);
    setExistingFiles(info?.file || []);
    setOpenUpload(true);
  };
  const isArabic = currentLang.value === 'ar';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const methods = useForm({
    defaultValues: {
      file: [],
    },
  });
  const fixURL = (url) => {
    if (!url) return null;
    let newUrl = url.replace(/\\/g, '/');
    newUrl = newUrl.replace('https://localhost', 'http://localhost');
    return newUrl;
  };
  const { handleSubmit, setValue, reset } = methods;

  const handleDrop = React.useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('file', files, { shouldValidate: true });
    },
    [setValue]
  );
  const handleDeleteFile = async (fileUrl) => {
    try {
      await axiosInstance.patch(`/api/medical-analysis-patient/files/delete/${selectedId}`, {
        fileUrl,
      });

      enqueueSnackbar(t('File deleted successfully'), {
        variant: 'success',
      });
      refetch();

      setExistingFiles((prev) => prev.filter((f) => f !== fileUrl));
    } catch (error) {
      enqueueSnackbar('Delete failed', { variant: 'error' });
    }
  };
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      if (!data.file || data.file.length === 0) {
        enqueueSnackbar(t('Please select at least one file'), {
          variant: 'warning',
        });
        return;
      }
      data.file.forEach((file) => {
        formData.append('file', file);
      });

      await axiosInstance.patch(
        `/api/medical-analysis-patient/files/upload/${selectedId}`,
        formData
      );
      refetch();
      enqueueSnackbar(t('Medical analysis uploaded successfully'), {
        variant: 'success',
      });
      reset({ file: [] });
      setExistingFiles([]);
      setSelectedId(null);
      setOpenUpload(false);
    } catch (error) {
      enqueueSnackbar('Upload failed', { variant: 'error' });
    }
  };
  return (
    <>
      {analysisData?.length > 0 ? (
        analysisData.map((info, index) => (
          <Card
            key={index}
            sx={{
              backgroundImage: `url(${Back})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundColor: 'rgba(255,255,255,0.8)',
              position: 'relative',

              direction: isArabic ? 'rtl' : 'ltr',
            }}
          >
            {/* ================= Header ================= */}
            <Stack
              sx={{
                p: 2,
                pb: 1,
                height: 110,
                alignItems: 'flex-end',
                textAlign: 'right',
              }}
            >
              <Avatar
                alt={info?.name_english}
                src={user?.patient?.profile_picture}
                variant="rounded"
                sx={{
                  width: 48,
                  height: 48,
                  mb: 2,
                  alignSelf: 'flex-end',
                }}
              />

              <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{
                  fontWeight: 'bold',
                  width: '100%',
                  direction: isArabic ? 'rtl' : 'ltr',
                }}
              >
                {fDateAndTime(info?.created_at)}
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, max-content)',
                  columnGap: 1.5,
                  rowGap: 1,
                  mt: 2,
                  justifyContent: 'flex-end',
                  justifyItems: 'end',
                  width: '100%',
                }}
              >
                {info?.medical_analysis?.map((analyses, ii) => (
                  <Typography
                    key={ii}
                    sx={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      textAlign: 'right',

                      unicodeBidi: 'plaintext',

                      fontFamily: isArabic ? 'ArabicFont' : 'inherit',
                    }}
                  >
                    {isArabic
                      ? `${
                          isMobile
                            ? truncateText(analyses?.medical_analysis?.name_arabic, 10)
                            : analyses?.medical_analysis?.name_arabic
                        } -`
                      : `- ${
                          isMobile
                            ? truncateText(analyses?.medical_analysis?.name_english, 10)
                            : analyses?.medical_analysis?.name_english
                        }`}
                  </Typography>
                ))}
              </Box>
            </Stack>

            <Divider
              sx={{
                borderStyle: 'dashed',
                borderColor: 'rgba(128,128,128,0.5)',
                mt: 10,
              }}
            />

            {/* ================= Footer ================= */}
            <Box
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              rowGap={1.5}
              sx={{
                p: 3,
                textAlign: 'right',
              }}
            >
              {[
                {
                  label: isArabic ? user?.patient?.name_arabic : user?.patient?.name_english,
                  icon: <Iconify width={16} icon="fa:user" />,
                },
                {
                  label: isArabic ? info?.employee?.name_arabic : info?.employee?.name_english,
                  icon: <Iconify width={16} icon="mdi:doctor" />,
                },
                {
                  label: isArabic
                    ? info?.unit_service?.name_arabic
                    : info?.unit_service?.name_english,
                  icon: <Iconify width={16} icon="teenyicons:hospital-solid" />,
                },
                {
                  // eslint-disable-next-line no-nested-ternary
                  label: info?.delivered_at
                    ? isArabic
                      ? 'تعديل الملفات'
                      : 'Edit Files'
                    : isArabic
                      ? 'تحميل الملفات'
                      : 'Upload Files',

                  clickable: true,

                  onClick: () => handleOpenUpload(info),

                  icon: info?.delivered_at ? (
                    <Iconify width={16} icon="mdi:pencil-outline" />
                  ) : (
                    <Iconify width={16} icon="mdi:cloud-upload-outline" />
                  ),
                },
              ].map((item, idx) => (
                <Stack
                  key={idx}
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={0.5}
                  onClick={item.clickable ? item.onClick : undefined}
                  sx={{
                    width: '100%',
                    cursor: item.clickable ? 'pointer' : 'default',
                    color: item.clickable ? 'primary.main' : 'inherit',
                    direction: isArabic ? 'rtl' : 'ltr',
                  }}
                >
                  {item.icon}
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      direction: isArabic ? 'rtl' : 'ltr',
                      textAlign: 'right',
                      fontFamily: isArabic ? 'ArabicFont' : 'inherit',
                    }}
                    noWrap
                  >
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Box>
            <Dialog open={openUpload} onClose={() => setOpenUpload(false)} fullWidth maxWidth="sm">
              <DialogTitle>{t('Upload Files')}</DialogTitle>

              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                  <RHFUpload name="file" multiple onDrop={handleDrop} />
                  {existingFiles?.length > 0 && (
                    <Box mb={3}>
                      {existingFiles.map((file, index1) => (
                        <Box
                          key={index1}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            mb: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {file.split('/').pop()}
                          </Typography>

                          <Stack direction="row" spacing={1}>
                            <Iconify
                              icon="mdi:eye-outline"
                              width={20}
                              sx={{ cursor: 'pointer' }}
                              onClick={() => setPreviewFile(file)}
                            />

                            <Iconify
                              icon="mdi:delete-outline"
                              width={20}
                              sx={{ cursor: 'pointer', color: 'error.main' }}
                              onClick={() => handleDeleteFile(file)}
                            />
                          </Stack>
                        </Box>
                      ))}
                    </Box>
                  )}
                </DialogContent>

                <DialogActions>
                  <Button onClick={() => setOpenUpload(false)}>{t('Cancel')}</Button>

                  <Button type="submit" variant="contained">
                    {t('Upload')}
                  </Button>
                </DialogActions>
              </FormProvider>
            </Dialog>
            <Dialog
              open={Boolean(previewFile)}
              onClose={() => setPreviewFile(null)}
              fullWidth
              maxWidth="md"
            >
              <DialogTitle>{previewFile?.split('/').pop()}</DialogTitle>

              <DialogContent dividers>
                {previewFile && /\.(jpg|jpeg|png|webp)$/i.test(previewFile) ? (
                  <Box
                    component="img"
                    src={fixURL(previewFile)}
                    sx={{
                      width: '100%',
                      maxHeight: 500,
                      objectFit: 'contain',
                      borderRadius: 2,
                    }}
                  />
                ) : previewFile && /\.pdf$/i.test(previewFile) ? (
                  <embed
                    src={fixURL(previewFile)}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                  />
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => window.open(fixURL(previewFile), '_blank')}
                  >
                    {currentLang ? 'تحميل الملف' : 'Download File'}
                  </Button>
                )}
              </DialogContent>
            </Dialog>
          </Card>
        ))
      ) : (
        <EmptyContent filled title={t('No Data')} sx={{ py: 10 }} />
      )}
    </>
  );
}
