import { useSnackbar } from 'notistack';
import { useParams, useLocation } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import {
  Box,
  Grid,
  Chip,
  Paper,
  Button,
  Divider,
  Tooltip,
  Accordion,
  Typography,
  CircularProgress,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';
import { useTranslate } from '../../../../locales';
import Iconify from '../../../../components/iconify';
import AddDiagnosis from '../../../../components/clim/AddDiagnosis';
import RadiologyOrders from '../../../../components/clim/RadiologyOrders';
import LaboratoryOrders from '../../../../components/clim/LaboratoryOrders';
import MedicationsOrders from '../../../../components/clim/MedicationsOrders';
import PhysiotherapyOrders from '../../../../components/clim/PhysiotherapyOrders';
import {
  submitClaim,
  cancellation,
  checkFormNumber,
  submitFormNumber,
} from '../../../../services/claimService';

const sections = [
  'Add Diagnosis',
  'Laboratory Orders',
  'Radiology Orders',
  'Medications Orders',
  'Physiotherapy',
];
const indexToKey = {
  0: 'diagnosis',
  1: 'lab',
  2: 'radiology',
  3: 'medications',
  4: 'physiotherapy',
};

export default function PatientPage() {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const { visitId } = useParams();
  const location = useLocation();

  const [formNumber, setFormNumber]           = useState(null);
  const [requestId, setRequestId]             = useState(null);
  const [idPayer, setIdPayer]                 = useState(null);
  const [visitCtx, setVisitCtx]               = useState(null);
  const [loadingFormNumber, setLoadingFormNumber] = useState(false);
  const [authApproved, setAuthApproved]       = useState(false);

  const [sectionStatus, setSectionStatus] = useState({
    diagnosis: false,
    lab: false,
    radiology: false,
    medications: false,
    physiotherapy: false,
  });

  /* ── initialise form-number on mount ─────────────────────────────
     Priority 1: navigation state passed from companyPage (eligibility
                 was already done there — reuse the result directly).
     Priority 2: fetch visit context from the API, then request a new
                 form number (fallback when navigating directly by URL).
  ──────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const navState = location.state;

    // --- Priority 1: use what companyPage already fetched ---
    if (navState?.visitContext) {
      setVisitCtx(navState.visitContext);
      if (navState.idPayer) setIdPayer(navState.idPayer);
      if (navState.formNumber) {
        setFormNumber(navState.formNumber);
        setAuthApproved(true);
      } else if (navState.requestId) {
        setRequestId(navState.requestId);
      }
      return;
    }

    // --- Priority 2: fallback API path (direct URL navigation) ---
    if (!visitId) return;

    const initFormNumber = async () => {
      setLoadingFormNumber(true);
      try {
        const ctxRes = await axiosInstance.get(`/api/claims/visit-context/${visitId}`);
        const ctx = ctxRes.data?.visitContext;

        if (!ctx?.patientNID || !ctx?.insuranceLicense || !ctx?.memberID || !ctx?.clinicianId) {
          enqueueSnackbar(t('Incomplete insurance data for this visit'), { variant: 'warning' });
          return;
        }

        setVisitCtx(ctx);

        const res  = await submitFormNumber(ctx);
        const data = res?.data;

        if (data?.formNumber) {
          setFormNumber(data.formNumber);
          setAuthApproved(true);
        } else if (data?.requestId) {
          setRequestId(data.requestId);
        }
      } catch (err) {
        console.error('Form number init failed:', err);
        enqueueSnackbar(t('Failed to initialise visit authorisation'), { variant: 'error' });
      } finally {
        setLoadingFormNumber(false);
      }
    };

    initFormNumber();
  }, [visitId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── auto-poll when a requestId is set (WATANIA / ZERO / ISLAMIC) ── */
  useEffect(() => {
    if (!requestId) return;
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      try {
        const res  = await checkFormNumber(requestId);
        const data = res?.data;
        if (data?.formNumber) {
          clearInterval(timer);
          setFormNumber(data.formNumber);
          if (data?.idPayer) setIdPayer(data.idPayer);
          setAuthApproved(true);
          setRequestId(null);
          enqueueSnackbar(t('Approved! Form number received'), { variant: 'success' });
        } else if (!data?.pending) {
          clearInterval(timer);
          enqueueSnackbar(data?.error || t('Authorization not approved'), { variant: 'warning' });
          setRequestId(null);
        } else if (attempts >= 12) {
          clearInterval(timer);
          enqueueSnackbar(t('Timeout: no insurer response after 60 s'), { variant: 'error' });
          setRequestId(null);
        }
      } catch { /* will retry next tick */ }
    }, 5000);
    return () => clearInterval(timer);
  }, [requestId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── recheck: poll for insurer approval ───────────────────────────── */
  const handleRecheck = useCallback(async () => {
    setLoadingFormNumber(true);
    try {
      if (!requestId) {
        // No pending request — re-submit using stored context
        if (!visitCtx) {
          enqueueSnackbar(t('Visit context not loaded'), { variant: 'warning' });
          return;
        }
        const res  = await submitFormNumber(visitCtx);
        const data = res?.data;
        if (data?.formNumber) {
          setFormNumber(data.formNumber);
          setAuthApproved(true);
          enqueueSnackbar(t('Form number obtained'), { variant: 'success' });
          return;
        }
        if (data?.requestId) {
          setRequestId(data.requestId);
          enqueueSnackbar(t('Request submitted, awaiting insurer approval'), { variant: 'info' });
        }
      } else {
        // Poll existing request
        const res  = await checkFormNumber(requestId);
        const data = res?.data;
        if (data?.formNumber) {
          setFormNumber(data.formNumber);
          if (data?.idPayer) setIdPayer(data.idPayer);
          setAuthApproved(true);
          setRequestId(null);
          enqueueSnackbar(t('Approved! Form number received'), { variant: 'success' });
          return;
        }
        if (data?.pending) {
          enqueueSnackbar(t('Still awaiting insurer response'), { variant: 'info' });
          return;
        }
        if (!data?.success) {
          enqueueSnackbar(data?.error || t('Authorization not approved'), { variant: 'warning' });
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || t('Recheck failed');
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoadingFormNumber(false);
    }
  }, [requestId, visitCtx, enqueueSnackbar, t]);

  /* ── claim submit ──────────────────────────────────────────────────── */
  const handleSubmit = async () => {
    try {
      await submitClaim();
      enqueueSnackbar('Claim submitted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to submit claim', { variant: 'error' });
    }
  };

  const updateSectionStatus = (key, hasData) => {
    setSectionStatus((prev) => ({ ...prev, [key]: hasData }));
  };

  const authStatus = useMemo(() => {
    if (loadingFormNumber && !formNumber) return { label: t('Checking eligibility...'), color: 'warning' };
    if (authApproved && formNumber)       return { label: t('Eligible'), color: 'success' };
    if (requestId && !formNumber)         return { label: t('Pending approval'), color: 'warning' };
    return { label: t('Not eligible'), color: 'error' };
  }, [loadingFormNumber, authApproved, formNumber, requestId, t]);

  return (
    <Box sx={{ p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={18}>
              {t('Hakeemna Patient')}
            </Typography>
            <Typography color="text.secondary">
              {t('Age Gender', { age: 24, gender: t('Male') })}
            </Typography>
            <Typography>Patient No: 09070657978</Typography>
            <Typography color="text.secondary">{t('Phone Number')}: 0791234567</Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography fontSize={14}>
              {t('Member Card')}: <b>003256</b>
            </Typography>
            <Typography fontSize={14}>
              {t('Deductible')}: <b>10.00 JOD</b>
            </Typography>
          </Grid>

          <Grid item xs={12} md={3} textAlign="right">
            <Chip label={authStatus.label} color={authStatus.color} sx={{ mb: 0.5 }} />
            {formNumber && (
              <Tooltip title={t('e-Form Number')}>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                >
                  {t('Form No')}: <b>{formNumber}</b>
                </Typography>
              </Tooltip>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            disabled={loadingFormNumber}
            startIcon={
              loadingFormNumber ? (
                <CircularProgress size={16} />
              ) : (
                <Iconify icon="solar:refresh-bold" />
              )
            }
            onClick={handleRecheck}
          >
            {t('Recheck')}
          </Button>
        </Box>
      </Paper>

      {/* ── SECTIONS ───────────────────────────────────────────────── */}
      {sections.map((section, index) => (
        <Accordion key={section} sx={{ mb: 1, borderRadius: 2 }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <MedicalInformationIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography fontWeight="bold" sx={{ flexGrow: 1 }}>
              {t(section)}
            </Typography>
            {sectionStatus[indexToKey[index]] && <CheckCircleIcon sx={{ color: 'success.main' }} />}
          </AccordionSummary>

          <AccordionDetails>
            {index === 0 && (
              <AddDiagnosis onDataChange={(data) => updateSectionStatus('diagnosis', data.length > 0)} />
            )}
            {index === 1 && (
              <LaboratoryOrders onDataChange={(hasData) => updateSectionStatus('lab', hasData)} />
            )}
            {index === 2 && (
              <RadiologyOrders onDataChange={(hasData) => updateSectionStatus('radiology', hasData)} />
            )}
            {index === 3 && (
              <MedicationsOrders onDataChange={(hasData) => updateSectionStatus('medications', hasData)} />
            )}
            {index === 4 && (
              <PhysiotherapyOrders onDataChange={(hasData) => updateSectionStatus('physiotherapy', hasData)} />
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="text" color="error" onClick={() => cancellation()}>
          {t('Cancel Visit')}
        </Button>
        <Button variant="contained" color="primary">
          Send Orders
        </Button>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          {t('Close and Submit Claim')}
        </Button>
      </Box>
    </Box>
  );
}
