import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
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

import { useTranslate } from 'src/locales';
import {
  submitClaim,
  cancellation,
  checkFormNumber,
  submitFormNumber,
} from 'src/services/claimService';

import Iconify from 'src/components/iconify';

import AddDiagnosis from 'src/components/clim/AddDiagnosis';
import RadiologyOrders from 'src/components/clim/RadiologyOrders';
import LaboratoryOrders from 'src/components/clim/LaboratoryOrders';
import MedicationsOrders from 'src/components/clim/MedicationsOrders';
import PhysiotherapyOrders from 'src/components/clim/PhysiotherapyOrders';

// Demo insurance/patient data — replace with real values from visit context
const DEMO_FORM_PAYLOAD = {
  insuranceLicense: 'WataniaINS',
  patientNID: '4000026255',
  memberID: '0000',
  clinicianId: 'JOR-P-000435',
  visitType: 'consultant',
  benefitType: 'outpatient',
};

/* ================= STATIC DATA ================= */
const sections = [
  'Add Diagnosis',
  // 'Clinic / ER Procedures',
  'Laboratory Orders',
  'Radiology Orders',
  'Medications Orders',
  'Physiotherapy',
];
const indexToKey = {
  0: 'diagnosis',
  // 1: 'procedures',
  1: 'lab',
  2: 'radiology',
  3: 'medications',
  4: 'physiotherapy',
};

export default function PatientPage() {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const { visitId } = useParams();

  // ─── Form Number State ────────────────────────────────────────────
  const [formNumber, setFormNumber] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [loadingFormNumber, setLoadingFormNumber] = useState(false);
  const [authApproved, setAuthApproved] = useState(false);

  // ─── Submit form-number request on mount ─────────────────────────
  useEffect(() => {
    const initFormNumber = async () => {
      setLoadingFormNumber(true);
      try {
        const res = await submitFormNumber(DEMO_FORM_PAYLOAD);
        const data = res?.data;
        if (data?.formNumber) {
          // SELF_GENERATED or immediate approval
          setFormNumber(data.formNumber);
          setAuthApproved(true);
        } else if (data?.requestId) {
          // Pending — insurer needs to approve in ClaimBrowser
          setRequestId(data.requestId);
        }
      } catch (err) {
        console.error('Form number init failed:', err);
      } finally {
        setLoadingFormNumber(false);
      }
    };

    initFormNumber();
  }, []);

  // ─── Recheck: poll for insurer approval ──────────────────────────
  const handleRecheck = useCallback(async () => {
    setLoadingFormNumber(true);
    try {
      let res;

      if (!requestId) {
        // No pending request — submit a new one
        res = await submitFormNumber(DEMO_FORM_PAYLOAD);
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
        // Check existing request
        res = await checkFormNumber(requestId);
        const data = res?.data;
        if (data?.formNumber) {
          setFormNumber(data.formNumber);
          setAuthApproved(true);
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
      const msg = typeof err === 'string' ? err : err?.error || err?.message || t('Recheck failed');
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoadingFormNumber(false);
    }
  }, [requestId, enqueueSnackbar, t]);

  // ─── Claim Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      await submitClaim();
      enqueueSnackbar('Claim submitted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to submit claim', { variant: 'error' });
    }
  };

  const authStatus = useMemo(() => {
    if (loadingFormNumber && !formNumber) {
      return { label: t('Checking eligibility...'), color: 'warning' };
    }
    if (authApproved && formNumber) {
      return { label: t('Eligible'), color: 'success' };
    }
    if (requestId && !formNumber) {
      return { label: t('Pending approval'), color: 'warning' };
    }
    return { label: t('Not eligible'), color: 'error' };
  }, [loadingFormNumber, authApproved, formNumber, requestId, t]);

  const [sectionStatus, setSectionStatus] = useState({
    diagnosis: false,
    // procedures: false,
    lab: false,
    radiology: false,
    medications: false,
    physiotherapy: false,
  });
  const updateSectionStatus = (key, hasData) => {
    setSectionStatus((prev) => ({
      ...prev,
      [key]: hasData,
    }));
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      {/* ================= HEADER ================= */}
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
            startIcon={loadingFormNumber ? <CircularProgress size={16} /> : <Iconify icon="solar:refresh-bold" />}
            onClick={handleRecheck}
          >
            {t('Recheck')}
          </Button>
        </Box>
      </Paper>

      {/* ================= SECTIONS ================= */}
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
              <AddDiagnosis
                onDataChange={(data) => {
                  updateSectionStatus('diagnosis', data.length > 0);
                }}
              />
            )}

            {/* {index === 1 && (
              <ClinicERProcedures
                onDataChange={(hasData) => updateSectionStatus('procedures', hasData)}
              />
            )} */}
            {index === 1 && (
              <LaboratoryOrders onDataChange={(hasData) => updateSectionStatus('lab', hasData)} />
            )}
            {index === 2 && (
              <RadiologyOrders
                onDataChange={(hasData) => updateSectionStatus('radiology', hasData)}
              />
            )}

            {index === 3 && (
              <MedicationsOrders
                onDataChange={(hasData) => updateSectionStatus('medications', hasData)}
              />
            )}

            {index === 4 && (
              <PhysiotherapyOrders
                onDataChange={(hasData) => updateSectionStatus('physiotherapy', hasData)}
              />
            )}
          </AccordionDetails>
        </Accordion>
      ))}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Button variant="text" color="error" onClick={() => cancellation()}>
          {t('Cancel Visit')}
        </Button>

        <Button variant="contained" color="primary">
          Send Orders
        </Button>
        <Button variant="contained" color="success" onClick={() => handleSubmit()}>
          {t('Close and Submit Claim')}
        </Button>
      </Box>
    </Box>
  );
}
