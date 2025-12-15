import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import { Box, Grid, Dialog, Button, Typography, DialogTitle, DialogContent } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import { generatePdfFromElement } from '../../components/pdf/generatePdf';

/* ================= helpers ================= */
const fixURL = (url) => {
    if (!url) return null;
    let newUrl = url.replace(/\\/g, '/');
    newUrl = newUrl.replace('https://localhost', 'http://localhost');
    return newUrl;
};

const calculateAge = (birthDate, isArabic) => {
    if (!birthDate) return '';
    const today = new Date();
    const dob = new Date(birthDate);
    const age = today.getFullYear() - dob.getFullYear();
    const months = today.getMonth() - dob.getMonth();

    if (age === 0) {
        return isArabic ? `${months} شهر` : `${months} months`;
    }
    return isArabic ? `${age} سنة` : `${age} years`;
};

/* ================= component ================= */
export default function PdfPreviewDialogPatient({ open, onClose, report }) {
    const previewRef = useRef(null);
    const { t } = useTranslate();
    const { currentLang } = useLocales();
    const isArabic = currentLang.value === 'ar';
    const { user } = useAuthContext();

    const hasImages =
        Array.isArray(report?.file) &&
        report.file.some((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            {/* ===== TITLE ===== */}
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 24, fontWeight: 900 }}>
                        {isArabic ? 'تقرير طبي مقدم من المريض' : 'Patient Submitted Medical Report'}
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                            generatePdfFromElement(
                                previewRef.current,
                                `${report?.name || 'Patient_Medical_Report'}.pdf`
                            )
                        }
                        sx={{ textTransform: 'none', fontSize: 14, px: 2 }}
                    >
                        {t('report.downloadPdf')}
                    </Button>
                </Box>
            </DialogTitle>

            {/* ===== CONTENT ===== */}
            <DialogContent sx={{ direction: 'ltr' }}>
                <Box
                    ref={previewRef}
                    sx={{
                        pt: '40px',
                        px: '50px',
                        pb: '20px',
                        backgroundColor: '#F7FAFF',
                        fontSize: '18px',
                        lineHeight: 1.7,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '1182px',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                    }}
                >
                    {/* ===== WATERMARK IMAGE ===== */}
                    <Box
                        component="img"
                        src="/favicon/512.png"
                        sx={{
                            position: 'absolute',
                            top: '40%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '520px',
                            opacity: 0.05,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* ===== HEADER ===== */}
                    <Typography sx={{ fontSize: 28, fontWeight: 900, color: '#2a5d71' }}>
                        {isArabic ? 'تقرير طبي مقدم من المريض' : 'Patient Submitted Medical Report'}
                    </Typography>

                    <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#2a5d71', mt: 1 }}>
                        {isArabic
                            ? 'هذا التقرير تم رفعه من قبل المريض ولم يتم التحقق منه طبيًا'
                            : 'This report was uploaded by the patient and has not been medically verified'}
                    </Typography>

                    <Box sx={{ borderBottom: '2px solid #2a5d71', mt: 2, mb: 4 }} />

                    {/* ===== TOP INFO ===== */}
                    <Grid container spacing={4}>
                        {/* LEFT */}
                        <Grid item xs={4}>
                            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#2a5d71', mb: 2 }}>
                                {t('report.reportDetails')}
                            </Typography>

                            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#2a5d71' }}>
                                {t('report.patientInfo')}
                            </Typography>
                        </Grid>

                        {/* RIGHT */}
                        <Grid item xs={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: 700, color: '#1f2c5b' }}>
                                        {t('report.dateOfReport')}:{' '}
                                        <span style={{ color: '#000' }}>
                                            {fDate(report?.date || report?.created_at, 'dd/MM/yyyy')}
                                        </span>
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography sx={{ fontWeight: 700, color: '#1f2c5b' }}>
                                        {t('specialty')}:{' '}
                                        <span style={{ color: '#000' }}>
                                            {isArabic
                                                ? report?.specialty?.name_arabic
                                                : report?.specialty?.name_english}
                                        </span>
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', gap: 10, mt: 2 }}>
                                <Typography sx={{ fontWeight: 700, color: '#1f2c5b' }}>
                                    {t('report.name')}:{' '}
                                    <span style={{ color: '#000' }}>
                                        {isArabic
                                            ? report?.patient?.name_arabic
                                            : report?.patient?.name_english}
                                    </span>
                                </Typography>

                                <Typography sx={{ fontWeight: 700, color: '#1f2c5b' }}>
                                    {t('report.age')}:{' '}
                                    <span style={{ color: '#000' }}>
                                        {calculateAge(user?.patient?.birth_date, isArabic)}
                                    </span>
                                </Typography>

                            </Box>
                        </Grid>
                    </Grid>

                    {/* ===== PATIENT NOTE ===== */}
                    {report?.note && (
                        <Box sx={{ mt: 4 }}>
                            <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 1 }}>
                                {isArabic ? 'ملاحظات المريض' : 'Patient Notes'}
                            </Typography>
                            <Typography sx={{ whiteSpace: 'pre-line' }}>{report.note}</Typography>
                        </Box>
                    )}

                    {/* ===== ATTACHED IMAGES ===== */}
                    {hasImages && (
                        <Box sx={{ mt: 4 }}>
                            <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 2 }}>
                                {isArabic ? 'المرفقات الطبية' : 'Attached Medical Files'}
                            </Typography>

                            <Grid container spacing={2}>
                                {report.file.map((file, idx) => {
                                    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) return null;
                                    return (
                                        <Grid item xs={6} key={idx}>
                                            <Box
                                                component="img"
                                                src={fixURL(file)}
                                                sx={{
                                                    width: '100%',
                                                    maxHeight: 300,
                                                    objectFit: 'contain',
                                                    border: '1px solid #ccc',
                                                    borderRadius: 2,
                                                }}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}

                    {/* ===== SPACER ===== */}
                    <Box sx={{ flexGrow: hasImages ? 0 : 1, minHeight: hasImages ? 200 : 350 }} />

                    {/* ===== DISCLAIMER ===== */}
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#c62828' }}>
                            {isArabic
                                ? 'هذا التقرير ليس تشخيصًا طبيًا رسميًا'
                                : 'This report is not a medical diagnosis'}
                        </Typography>
                    </Box>

                    {/* ===== FOOTER ===== */}
                    <Box
                        sx={{
                            borderTop: '2px solid #2a5d71',
                            pt: 3,
                            mt: 'auto',
                            textAlign: 'center',
                            color: '#2a5d71',
                            fontWeight: 700,
                            fontSize: 16,
                        }}
                    >
                        {currentLang.value === 'ar'
                            ? 'تم تطويره بواسطة حكيمنا ٣٦٠'
                            : 'Powered by Hakeemna 360'}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

PdfPreviewDialogPatient.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    report: PropTypes.object,
};
