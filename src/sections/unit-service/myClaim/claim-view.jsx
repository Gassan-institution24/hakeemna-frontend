import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import {
  Box,
  Card,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  Button,
  Dialog,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  CardContent,
  DialogTitle,
  DialogActions,
  DialogContent,
  useMediaQuery,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useLocales } from 'src/locales';
import { viewClaim, getNewClaims, setClaimDownloaded } from 'src/services/claimService';

import { useSnackbar } from 'src/components/snackbar';

/* ── moved outside to avoid re-mount on every render ── */
function ClaimChip({ downloaded, curLangAr }) {
  const downloadedLabel = curLangAr ? 'تم التحميل' : 'Downloaded';
  const newLabel = curLangAr ? 'جديد' : 'New';
  return (
    <Chip
      size="small"
      label={downloaded ? downloadedLabel : newLabel}
      color={downloaded ? 'default' : 'success'}
    />
  );
}

ClaimChip.propTypes = {
  downloaded: PropTypes.bool,
  curLangAr:  PropTypes.bool,
};

/* ═══════════════════════════════════════════════════════════ */

export default function ClaimsView() {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const theme   = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [claims,         setClaims]         = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [marking,        setMarking]        = useState(null);
  const [open,           setOpen]           = useState(false);
  const [detail,         setDetail]         = useState(null);
  const [detailLoading,  setDetailLoading]  = useState(false);

  const loadClaims = useCallback(async () => {
    setLoading(true);
    try {
      const res      = await getNewClaims();
      const entities = res?.data?.data?.Entities || res?.data?.Entities || [];
      setClaims(entities);
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || 'Failed to load claims', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => { loadClaims(); }, [loadClaims]);

  const handleView = async (id) => {
    setDetailLoading(true);
    setDetail(null);
    setOpen(true);
    try {
      const res = await viewClaim(id);
      setDetail({ id, ...res?.data });
    } catch (e) {
      enqueueSnackbar('Failed to load claim details', { variant: 'error' });
      setOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSetDownloaded = async (id) => {
    setMarking(id);
    try {
      await setClaimDownloaded(id);
      enqueueSnackbar('Claim marked as downloaded', { variant: 'success' });
      setOpen(false);
      setClaims((prev) => prev.filter((c) => c.ID !== id));
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || 'Failed to mark claim', { variant: 'error' });
    } finally {
      setMarking(null);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>

      {/* ══ HEADER ══ */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          {curLangAr ? 'المطالبات المالية' : 'Financial Claims'}
        </Typography>
        <IconButton onClick={loadClaims} disabled={loading} color="primary" title="Refresh">
          <RefreshIcon />
        </IconButton>
      </Stack>

      {/* ══ LOADING ══ */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ══ EMPTY ══ */}
      {!loading && claims.length === 0 && (
        <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
          <DownloadDoneIcon sx={{ fontSize: 56, opacity: 0.4 }} />
          <Typography variant="h6">
            {curLangAr ? 'لا توجد مطالبات جديدة' : 'No new claims'}
          </Typography>
          <Typography variant="body2">
            {curLangAr
              ? 'جميع المطالبات تم تحميلها أو لا توجد مطالبات بعد'
              : 'All claims have been downloaded, or none have been submitted yet'}
          </Typography>
        </Box>
      )}

      {/* ══ DESKTOP TABLE ══ */}
      {!loading && claims.length > 0 && !isMobile && (
        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f4f6f8' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>{curLangAr ? 'معرف المعاملة' : 'Transaction ID'}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{curLangAr ? 'المرسِل' : 'Sender'}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{curLangAr ? 'المستقبِل' : 'Receiver'}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{curLangAr ? 'تاريخ المعاملة' : 'Transaction Date'}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{curLangAr ? 'تاريخ الإنشاء' : 'Created'}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{curLangAr ? 'الحالة' : 'Status'}</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">{curLangAr ? 'الإجراءات' : 'Actions'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.ID} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {claim.ID}
                  </TableCell>
                  <TableCell>{claim.SenderID}</TableCell>
                  <TableCell>{claim.ReceiverID}</TableCell>
                  <TableCell>{claim.TransactionDate}</TableCell>
                  <TableCell>{claim.CreationDate}</TableCell>
                  <TableCell><ClaimChip downloaded={claim.Downloaded} curLangAr={curLangAr} /></TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button size="small" variant="outlined" onClick={() => handleView(claim.ID)}>
                        {curLangAr ? 'عرض' : 'View'}
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={!!marking || claim.Downloaded}
                        onClick={() => handleSetDownloaded(claim.ID)}
                        startIcon={marking === claim.ID ? <CircularProgress size={14} color="inherit" /> : <CheckCircleIcon />}
                      >
                        {curLangAr ? 'تعيين كمُحمَّل' : 'Set Downloaded'}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ══ MOBILE CARDS ══ */}
      {!loading && claims.length > 0 && isMobile && (
        <Grid container spacing={2}>
          {claims.map((claim) => (
            <Grid item xs={12} key={claim.ID}>
              <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography fontWeight={700} fontSize={12} sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {claim.ID}
                    </Typography>
                    <Typography variant="body2">{curLangAr ? 'المرسِل:' : 'Sender:'} {claim.SenderID}</Typography>
                    <Typography variant="body2">{curLangAr ? 'المستقبِل:' : 'Receiver:'} {claim.ReceiverID}</Typography>
                    <Typography variant="body2">{claim.TransactionDate}</Typography>
                    <ClaimChip downloaded={claim.Downloaded} curLangAr={curLangAr} />
                    <Stack direction="row" spacing={1} pt={1}>
                      <Button size="small" variant="outlined" fullWidth onClick={() => handleView(claim.ID)}>
                        {curLangAr ? 'عرض' : 'View'}
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        disabled={!!marking || claim.Downloaded}
                        onClick={() => handleSetDownloaded(claim.ID)}
                        startIcon={marking === claim.ID ? <CircularProgress size={14} color="inherit" /> : <CheckCircleIcon />}
                      >
                        {curLangAr ? 'تعيين كمُحمَّل' : 'Set Downloaded'}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ══ DETAIL DIALOG ══ */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{curLangAr ? 'تفاصيل المطالبة' : 'Claim Details'}</DialogTitle>

        <DialogContent>
          {detailLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!detailLoading && detail && (
            <ClaimDetailBody detail={detail} curLangAr={curLangAr} />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            {curLangAr ? 'إغلاق' : 'Close'}
          </Button>
          {detail?.id && (
            <Button
              variant="contained"
              disabled={!!marking}
              onClick={() => handleSetDownloaded(detail.id)}
              startIcon={marking === detail.id ? <CircularProgress size={14} color="inherit" /> : <CheckCircleIcon />}
            >
              {curLangAr ? 'تعيين كمُحمَّل' : 'Set Downloaded'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}

/* ── detail body extracted to avoid inline IIFE ── */
function ClaimDetailBody({ detail, curLangAr }) {
  const claimObj = detail?.claim?.[0]
    || detail?.data?.Entity?.Claim?.[0]
    || detail?.data?.Claim?.[0]
    || {};
  const header = detail?.data?.Entity?.Header || detail?.data?.Header || {};

  return (
    <Stack spacing={2} mt={1}>
      <Paper sx={{ p: 2, bgcolor: '#f9fafb' }} elevation={0}>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          {curLangAr ? 'رأس الطلب' : 'Header'}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}><Typography variant="body2"><b>{curLangAr ? 'المرسِل:' : 'Sender:'}</b> {header.SenderID || '—'}</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2"><b>{curLangAr ? 'المستقبِل:' : 'Receiver:'}</b> {header.ReceiverID || '—'}</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2"><b>{curLangAr ? 'الجهة الدافعة:' : 'Payer:'}</b> {header.PayerID || '—'}</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2"><b>{curLangAr ? 'التاريخ:' : 'Date:'}</b> {header.TransactionDate || '—'}</Typography></Grid>
        </Grid>
      </Paper>

      {claimObj.MemberID && (
        <Paper sx={{ p: 2, bgcolor: '#f9fafb' }} elevation={0}>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>
            {curLangAr ? 'المطالبة' : 'Claim'}
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}><Typography variant="body2"><b>{curLangAr ? 'رقم العضو:' : 'Member ID:'}</b> {claimObj.MemberID}</Typography></Grid>
            <Grid item xs={6}><Typography variant="body2"><b>{curLangAr ? 'المزود:' : 'Provider:'}</b> {claimObj.ProviderID}</Typography></Grid>
            <Grid item xs={6}><Typography variant="body2"><b>{curLangAr ? 'الإجمالي:' : 'Gross:'}</b> {claimObj.Gross}</Typography></Grid>
            <Grid item xs={6}><Typography variant="body2"><b>{curLangAr ? 'الصافي:' : 'Net:'}</b> {claimObj.Net}</Typography></Grid>
            <Grid item xs={6}><Typography variant="body2"><b>{curLangAr ? 'حصة المريض:' : 'Patient Share:'}</b> {claimObj.PatientShare}</Typography></Grid>
          </Grid>
        </Paper>
      )}

      {claimObj.Activity?.length > 0 && (
        <Paper sx={{ p: 2, bgcolor: '#f9fafb' }} elevation={0}>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>
            {curLangAr ? 'الأنشطة' : 'Activities'} ({claimObj.Activity.length})
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{curLangAr ? 'المعرف' : 'ID'}</TableCell>
                <TableCell>{curLangAr ? 'النوع' : 'Type'}</TableCell>
                <TableCell>{curLangAr ? 'الكود' : 'Code'}</TableCell>
                <TableCell>{curLangAr ? 'الكمية' : 'Qty'}</TableCell>
                <TableCell>{curLangAr ? 'الصافي' : 'Net'}</TableCell>
                <TableCell>{curLangAr ? 'الإجمالي' : 'Gross'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claimObj.Activity.map((act) => (
                <TableRow key={act.ID}>
                  <TableCell>{act.ID}</TableCell>
                  <TableCell>{act.Type}</TableCell>
                  <TableCell>{act.Code}</TableCell>
                  <TableCell>{act.Quantity}</TableCell>
                  <TableCell>{act.Net}</TableCell>
                  <TableCell>{act.Gross}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
}

ClaimDetailBody.propTypes = {
  detail:    PropTypes.object,
  curLangAr: PropTypes.bool,
};
