import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Card,
  Button,
  Container,
  Typography,
  CardContent,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUnitServiceQrCode } from 'src/api/unit_services';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';

export default function QrCodePage() {
  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();

  const unitServiceId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id;

  const { data: unitServiceData, loading, refetch } = useGetUnitServiceQrCode(unitServiceId);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerateQrCode = async () => {
    try {
      setIsRegenerating(true);
      await axiosInstance.post(endpoints.unit_services.regenerateQrcode(unitServiceId));
      await refetch();
      enqueueSnackbar(t('QR code regenerated successfully'), {
        variant: 'success',
      });
    } catch (error) {
      console.error('Error regenerating QR code:', error);
      enqueueSnackbar(
        curLangAr ? error?.arabic_message || error?.message : error?.message || t('Error regenerating QR code'),
        { variant: 'error' }
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownloadQrCode = () => {
    if (qrCodeUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.target = '_blank';
      downloadLink.download = `qr-code-${unitServiceId}.png`;
      downloadLink.href = qrCodeUrl;
      downloadLink.click();
    }
  };

  if (loading) {
    return <LoadingScreen loading={loading} />;
  }

  const qrCodeUrl = unitServiceData?.qrCodeUrl?.replace(/\\/g, '/');

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading={t('Confirm Arrival')}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 3, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {curLangAr ? user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?.name_arabic : user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?.name_english}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('Scan this QR code to confirm patient arrival')}
          </Typography>

          {qrCodeUrl ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  border: '2px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  maxWidth: 400,
                }}
              >
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  style={{
                    width: '300px',
                    height: '300px',
                    display: 'block',
                  }}
                />
              </Paper>

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRegenerateQrCode}
                  disabled={isRegenerating}
                  startIcon={<Iconify icon="eva:refresh-fill" />}
                >
                  {isRegenerating ? t('Regenerating...') : t('Regenerate QR Code')}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDownloadQrCode}
                  startIcon={<Iconify icon="eva:download-fill" />}
                >
                  {t('Download QR Code')}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="error" gutterBottom>
                {t('No QR Code Available')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('QR code has not been generated for this unit service')}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRegenerateQrCode}
                disabled={isRegenerating}
                startIcon={<Iconify icon="eva:refresh-fill" />}
              >
                {isRegenerating ? t('Generating...') : t('Generate QR Code')}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
} 