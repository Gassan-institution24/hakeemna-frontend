import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { fixURL } from 'src/utils/format-url';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { confirmSalaryReceipt } from 'src/api/monthly_reports';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import SignaturePad from 'src/components/signature/signature-pad';
import { generatePdfFromElement } from 'src/components/pdf/generate-pdf';

// ----------------------------------------------------------------------

const BRAND = '#357F9C';

// Inline "HH : MM" string so the value stays on the same line as its label.
// (fHourMin returns a block <Typography>, which would drop the value to a new line.)
function formatHoursMinutes(mins) {
  if (mins === undefined || mins === null) return null;
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, '0');
  const m = Math.floor(mins % 60)
    .toString()
    .padStart(2, '0');
  return `${h} : ${m}`;
}

function InfoLine({ label, value, strong }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <Typography sx={{ fontSize: 16, mb: 1 }}>
      <span style={{ color: BRAND, fontWeight: 700 }}>{label}: </span>
      <span style={{ color: '#000', fontWeight: strong ? 800 : 500 }}>{value}</span>
    </Typography>
  );
}

InfoLine.propTypes = { label: PropTypes.string, value: PropTypes.node, strong: PropTypes.bool };

function StatTile({ label, value }) {
  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: 1.5,
        border: '1px solid #dbe5ee',
        backgroundColor: '#fff',
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#1f2c5b', lineHeight: 1.2 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: BRAND }}>{label}</Typography>
    </Box>
  );
}

StatTile.propTypes = { label: PropTypes.string, value: PropTypes.node };

// ----------------------------------------------------------------------

export default function SalaryReceiptDialog({ open, onClose, row, refetch }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  // Signing is personal: only the employee the report was issued to can confirm
  // receipt. HR, the unit service owner and admins can view and print it, but
  // never sign on someone else's behalf. The backend enforces this too.
  const myEngagementId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?._id;
  const reportEngagementId = row?.employee_engagement?._id || row?.employee_engagement;
  const isOwnReport = !!myEngagementId && String(reportEngagementId) === String(myEngagementId);
  const canConfirm = isOwnReport;

  const receiptRef = useRef(null);
  const [signOpen, setSignOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [override, setOverride] = useState(null);

  const data = { ...row, ...(override || {}) };
  const employee = row?.employee_engagement?.employee;
  const department = row?.employee_engagement?.department;

  const authUnit =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service;
  const unit = row?.unit_service || authUnit || {};

  const name = curLangAr ? employee?.name_arabic : employee?.name_english;
  const unitName = curLangAr ? unit?.name_arabic : unit?.name_english;
  const logo = fixURL(unit?.company_logo);
  const signatureUrl = fixURL(data?.employeeSignature);
  const confirmed = !!data?.salaryReceivedAt;

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `salary-receipt-${data?.code || ''}`,
  });

  const handleDownload = () =>
    generatePdfFromElement(receiptRef.current, `salary-receipt-${data?.code || ''}.pdf`);

  const handleSaveSignature = async (blob, dataURL) => {
    setSaving(true);
    try {
      const updated = await confirmSalaryReceipt(row._id, blob);
      if (!updated?.salaryReceivedAt && !updated?.employeeSignature) {
        // Request succeeded but nothing was persisted — usually the backend
        // needs a restart to load the new signature-upload route.
        enqueueSnackbar(t('Could not save the signature. Please try again.'), {
          variant: 'error',
        });
        return;
      }
      setOverride({
        employeeSignature: updated?.employeeSignature || dataURL,
        salaryReceivedAt: updated?.salaryReceivedAt || new Date().toISOString(),
      });
      enqueueSnackbar(t('Salary receipt confirmed'));
      setSignOpen(false);
      refetch?.();
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? error?.arabic_message || error?.message : error?.message || t('Error'),
        { variant: 'error' }
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
          >
            <Typography sx={{ fontSize: 22, fontWeight: 900 }}>{t('Salary Receipt')}</Typography>

            <Stack direction="row" spacing={1}>
              {canConfirm && (
                <Button
                  size="small"
                  variant={confirmed ? 'outlined' : 'contained'}
                  color="success"
                  startIcon={<Iconify icon="solar:pen-new-square-bold" />}
                  onClick={() => setSignOpen(true)}
                >
                  {confirmed ? t('confirmed') : t('Confirm receipt')}
                </Button>
              )}
              <Button
                size="small"
                variant="outlined"
                startIcon={<Iconify icon="solar:printer-bold" />}
                onClick={handlePrint}
              >
                {t('Print')}
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<Iconify icon="eva:cloud-download-fill" />}
                onClick={handleDownload}
              >
                {t('Download PDF')}
              </Button>
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ direction: 'ltr' }}>
          <Box
            ref={receiptRef}
            sx={{
              pt: '40px',
              px: '50px',
              pb: '24px',
              backgroundColor: '#F7FAFF',
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              boxSizing: 'border-box',
              minHeight: '1120px',
              display: 'flex',
              flexDirection: 'column',
              pageBreakInside: 'avoid',
            }}
          >
            {/* HEADER: logo + company + code */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Stack direction="row" spacing={2} alignItems="center">
                {logo && (
                  <Box
                    component="img"
                    src={logo}
                    alt={unitName}
                    sx={{ width: 72, height: 72, objectFit: 'contain' }}
                  />
                )}
                <Box>
                  <Typography sx={{ fontSize: 26, fontWeight: 900, color: BRAND }}>
                    {unitName || t('unit of service')}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: BRAND }}>
                    {unit?.country?.name_english}
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={0.75} alignItems="flex-end">
                <Typography sx={{ fontSize: 20, fontWeight: 900, color: BRAND }}>
                  {t('Salary Receipt')}
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#000' }}>
                  {t('number')}: {data?.code}
                </Typography>
                <Label variant="soft" color={confirmed ? 'success' : 'warning'}>
                  {confirmed ? t('confirmed') : t('pending')}
                </Label>
              </Stack>
            </Stack>

            <Box sx={{ borderBottom: `2px solid ${BRAND}`, mt: 2, mb: 3 }} />

            {/* EMPLOYEE + PERIOD */}
            <Stack direction="row" spacing={5}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: BRAND, mb: 1 }}>
                  {t('Employee')} : {name}
                </Typography>

                <InfoLine
                  label={t('department')}
                  value={curLangAr ? department?.name_arabic : department?.name_english}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: BRAND, mb: 1 }}>
                  {t('period')} :{' '}
                  <span style={{ color: '#000' }}>
                    {t('from')} {fDate(data?.start_date, 'dd/MM/yyyy')} {t('to')}{' '}
                    {fDate(data?.end_date, 'dd/MM/yyyy')}
                  </span>
                </Typography>

                <Box
                  sx={{
                    mt: 1.5,
                    display: 'grid',
                    gap: 1.5,
                    gridTemplateColumns: 'repeat(2, 1fr)',
                  }}
                >
                  <StatTile label={t('annual days off')} value={data?.annual ?? 0} />
                  <StatTile label={t('sick days off')} value={data?.sick ?? 0} />
                  <StatTile label={t('unpaid days off')} value={data?.unpaid ?? 0} />
                  <StatTile
                    label={t('working hours')}
                    value={formatHoursMinutes(data?.working_time) ?? '—'}
                  />
                </Box>
              </Box>
            </Stack>

            {/* salary statement */}
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: BRAND, mt: 4, mb: 1 }}>
              {t('salary statement')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                p: 2.5,
                borderRadius: 1.5,
                border: '1px solid #dbe5ee',
                backgroundColor: '#fff',
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: BRAND,
                    mb: 1,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {t('Earnings')}
                </Typography>
                <InfoLine label={t('salary')} value={fCurrency(data?.salary)} />
                <InfoLine
                  label={t('overtime')}
                  value={data?.over_time ? fCurrency(data?.over_time) : null}
                />
                <InfoLine
                  label={t('extras')}
                  value={data?.extras ? fCurrency(data?.extras) : null}
                />
                <Divider sx={{ my: 1, borderColor: '#dbe5ee' }} />
                <InfoLine
                  strong
                  label={t('Total')}
                  value={fCurrency(
                    (data?.salary ?? 0) + (data?.extras ?? 0) + (data?.over_time ?? 0)
                  )}
                />
              </Box>

              <Divider orientation="vertical" flexItem sx={{ borderColor: '#dbe5ee' }} />

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: BRAND,
                    mb: 1,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {t('Deductions')}
                </Typography>
                <InfoLine
                  label={t('Social Security')}
                  value={fCurrency(data?.employee_contribution_amount)}
                />
                <InfoLine label={t('tax')} value={data?.tax ? fCurrency(data?.tax) : null} />
                <InfoLine
                  label={t('deduction')}
                  value={data?.deduction ? fCurrency(data?.deduction) : null}
                />
                <Divider sx={{ my: 1, borderColor: '#dbe5ee' }} />
                <InfoLine
                  strong
                  label={t('Total')}
                  value={fCurrency(
                    (data?.employee_contribution_amount ?? 0) +
                      (data?.tax ?? 0) +
                      (data?.deduction ?? 0)
                  )}
                />
              </Box>
            </Box>

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: BRAND,
                color: '#fff',
              }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 800 }}>{t('Net salary')}</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
                {fCurrency(data?.total)}
              </Typography>
            </Box>

            {/* spacer keeps the signature near the bottom of the page */}
            <Box sx={{ flexGrow: 1, minHeight: 120 }} />

            {/* CONFIRMATION / SIGNATURE */}
            <Divider sx={{ mb: 3 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
              <Box>
                <Typography sx={{ fontSize: 15, color: BRAND, fontWeight: 700 }}>
                  {t('Salary received on')}:{' '}
                  <span style={{ color: '#000', fontWeight: 300, fontSize: 15 }}>
                    {confirmed
                      ? fDate(data?.salaryReceivedAt, 'dd/MM/yyyy p')
                      : t('not confirmed yet')}
                  </span>
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', minWidth: 180 }}>
                {signatureUrl ? (
                  <Box
                    component="img"
                    src={signatureUrl}
                    alt="signature"
                    sx={{ width: 180, height: 80, objectFit: 'contain', mb: 0.5 }}
                  />
                ) : (
                  <Box sx={{ height: 80, mb: 0.5 }} />
                )}
                <Box sx={{ borderTop: '1.5px solid #000', pt: 0.5 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: BRAND }}>
                    {t('Signature of receipt')}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Typography
              sx={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: BRAND, mt: 3 }}
            >
              {curLangAr ? 'تم تطويره بواسطة حكيمنا ٣٦٠' : 'Powered by Hakeemna 360'}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <SignaturePad
        open={signOpen}
        onClose={() => setSignOpen(false)}
        onSave={handleSaveSignature}
        saving={saving}
      />
    </>
  );
}

SalaryReceiptDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
  refetch: PropTypes.func,
};
