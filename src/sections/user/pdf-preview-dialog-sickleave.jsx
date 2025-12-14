import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import { Box, Grid, Dialog, Button, Typography, DialogTitle, DialogContent } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import { generatePdfFromElement } from '../../components/pdf/generatePdf';

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const fixURL = (url) => {
  if (!url) return null;
  let newUrl = url.replace(/\\/g, '/');
  newUrl = newUrl.replace('https://localhost', 'http://localhost');
  return newUrl;
};

export default function PdfPreviewDialogSickLeave({ open, onClose, report }) {
  console.log('report', report);

  const previewRef = useRef(null);
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const isArabic = currentLang.value === 'ar';
  function calculateAge(birthDate) {
    if (!birthDate) return '';
    const today = new Date();
    const dob = new Date(birthDate);
    const age = today.getFullYear() - dob.getFullYear();
    const months = today.getMonth() - dob.getMonth();

    if (age === 0) {
      return isArabic ? `${months} شهر` : `${months} months`;
    }
    return isArabic ? `${age} سنة` : `${age} years`;
  }
  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: 24, fontWeight: 900 }}>{t('report.sickLeave')}</Typography>

          {/* SMALL BUTTON NEXT TO TITLE */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => generatePdfFromElement(previewRef.current, 'sickLeave.pdf')}
            sx={{
              textTransform: 'none',
              fontSize: '14px',
              padding: '4px 10px',
            }}
          >
            {t('report.downloadPdf')}
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ direction: 'ltr' }}>
        <Box
          ref={previewRef}
          sx={{
            p: '40px 50px',
            backgroundColor: '#F7FAFF',
            fontSize: '18px',
            position: 'relative',
            minHeight: '1182px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            lineHeight: 1.7,
          }}
        >
          {/* ==== WATERMARK ==== */}
          <Box
            component="img"
            src="/favicon/512.png"
            sx={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '520px',
              opacity: 0.14,
              pointerEvents: 'none',
            }}
          />

          {/* ==== HEADER ==== */}
          <Typography sx={{ fontSize: 30, fontWeight: 900, color: '#2a5d71' }}>
            {t('report.doctorName')}:{' '}
            {isArabic ? report?.employee?.name_arabic : report?.employee?.name_english}
          </Typography>

          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2a5d71', mt: 1 }}>
            {t('report.majorName')}:{' '}
            {isArabic
              ? report?.employee?.speciality?.name_arabic
              : report?.employee?.speciality?.name_english}
          </Typography>

          {/* LINE */}
          <Box sx={{ borderBottom: '2px solid #1f2c5b', mt: 2, mb: 4 }} />

          {/* ==== TOP INFO GRID ==== */}
          <Grid container spacing={5}>
            {/* LEFT COLUMN */}
            <Grid item xs={4}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2a5d71', mb: 2 }}>
                {t('report.medicalReport')}
              </Typography>

              <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#2a5d71', mb: 2 }}>
                {t('report.patientInfo')}
              </Typography>

              <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#2a5d71' }}>
                {t('report.reportDetails')}
              </Typography>
            </Grid>

            {/* RIGHT COLUMN */}
            <Grid item xs={8}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1f2c5b' }}>
                    {t('report.dateOfReport')}:{' '}
                    <span style={{ color: '#000', fontWeight: 700 }}>
                      {fDate(report?.created_at, 'dd/MM/yyyy')}
                    </span>
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1f2c5b' }}>
                    {t('report.dateOfVisit')}:{' '}
                    <span style={{ color: '#000', fontWeight: 700 }}>
                      {fDate(report?.created_at, 'dd/MM/yyyy')}
                    </span>
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
                {/* NAME */}
                <Grid item xs={8}>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#1f2c5b',
                      wordBreak: 'break-word',
                    }}
                  >
                    {t('report.name')}:{' '}
                    <span style={{ color: '#000', fontWeight: 700 }}>
                      {isArabic ? report?.patient?.name_arabic : report?.patient?.name_english}
                    </span>
                  </Typography>
                </Grid>

                {/* AGE */}
                <Grid item xs={4} sx={{ textAlign: isArabic ? 'left' : 'right' }}>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#1f2c5b',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('report.age')}:{' '}
                    <span style={{ color: '#000', fontWeight: 700 }}>
                      {calculateAge(report?.patient?.birth_date)}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* ==== DESCRIPTION ==== */}
          <div
            style={{
              direction: isArabic ? 'rtl' : 'ltr',
              textAlign: isArabic ? 'right' : 'left',
              unicodeBidi: 'plaintext',
              whiteSpace: 'pre-line',
              lineHeight: '1.7',
              fontSize: '18px',
              color: '#000',
            }}
          >
            {decodeHtml(report?.description || '')
              .replace(/<\/p>/gi, '\n')
              .replace(/<br\s*\/?>/gi, '\n')
              .replace(/&nbsp;/g, ' ')
              .replace(/<[^>]+>/g, '')
              .trim()}
          </div>

          {/* ==== AUTO WHITE SPACE (PERFECT PDF MIDDLE AREA) ==== */}
          <Box
            sx={{
              flexGrow: 1, // <--- THE MAGIC PART
              minHeight: '300px', // baseline so it always looks correct
            }}
          />

          {/* ==== SIGNATURE & STAMP ==== */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              px: 12,
              mb: 4,
            }}
          >
            {/* SIGNATURE */}
            <Box sx={{ textAlign: 'center' }}>
              {report?.employee?.signature && (
                <Box
                  component="img"
                  src={fixURL(report.employee.signature)}
                  sx={{
                    width: 140,
                    height: 80,
                    objectFit: 'contain',
                    mb: 1,
                  }}
                />
              )}

              <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1f2c5b' }}>
                {t('report.signature')}
              </Typography>
            </Box>

            {/* STAMP */}
            <Box sx={{ textAlign: 'center' }}>
              {report?.employee?.stamp && (
                <Box
                  component="img"
                  src={fixURL(report.employee.stamp)}
                  sx={{
                    width: 140,
                    height: 80,
                    objectFit: 'contain',
                    mb: 1,
                  }}
                />
              )}

              <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1f2c5b' }}>
                {t('report.stamp')}
              </Typography>
            </Box>
          </Box>

          {/* ==== FOOTER ==== */}
          <Box
            sx={{
              borderTop: '2px solid #2a5d71',
              pt: 3,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 18,
              color: '#2a5d71',
              fontWeight: 700,
            }}
          >
            {/* LEFT COLUMN */}
            <Box>
              <Typography>
                {t('report.phoneNumber')}: {report?.unit_services?.phone || '---'}
              </Typography>
              <Typography>
                {t('report.workingHours')}: {formatTime(report?.unit_services?.work_start_time)}{' '}
                {' — '}
                {formatTime(report?.unit_services?.work_end_time)}
              </Typography>
            </Box>

            {/* MIDDLE COLUMN */}
            <Box>
              <Typography>
                {t('report.email')}: {report?.unit_services?.email || '---'}
              </Typography>

              {report?.unit_services?.mobile_nu && (
                <Typography>
                  {t('report.relativePhone')}: {report?.unit_services?.mobile_num || '---'}
                </Typography>
              )}
            </Box>

            {/* RIGHT COLUMN */}
            <Box>
              <Typography>
                {t('report.address')}: {report?.unit_services?.address || '---'}
              </Typography>
            </Box>
          </Box>

          {/* ==== POWERED BY ==== */}
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: '#2a5d71',
              mt: 2,
            }}
          >
            {currentLang.value === 'ar' ? 'تم تطويره بواسطة حكيمنا ٣٦٠' : 'Powered by Hakeemna 360'}
          </Typography>
        </Box>

      
      </DialogContent>
    </Dialog>
  );
}

PdfPreviewDialogSickLeave.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  report: PropTypes.object,
};
