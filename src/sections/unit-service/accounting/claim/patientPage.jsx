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
import ClinicERProcedures from '../../../../components/clim/ClinicERProcedures';
import {
  submitClaim,
  cancellation,
  checkFormNumber,
  submitFormNumber,
  checkFinalAuthorization,
  submitFinalAuthorization,
} from '../../../../services/claimService';

const sections = [
  'Add Diagnosis',
  'In-Clinic Procedures',
  'Laboratory Orders',
  'Radiology Orders',
  'Medications Orders',
  'Physiotherapy',
];
const indexToKey = {
  0: 'diagnosis',
  1: 'procedures',
  2: 'lab',
  3: 'radiology',
  4: 'medications',
  5: 'physiotherapy',
};

export default function PatientPage() {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const { visitId } = useParams();
  const location = useLocation();

  const [formNumber, setFormNumber]               = useState(null);
  const [requestId, setRequestId]                 = useState(null);
  const [idPayer, setIdPayer]                     = useState(null);
  const [visitCtx, setVisitCtx]                   = useState(null);
  const [loadingFormNumber, setLoadingFormNumber]  = useState(false);
  const [authApproved, setAuthApproved]            = useState(false);

  // Section data — actual arrays for building TPO activities
  const [diagnosisData,    setDiagnosisData]    = useState([]);
  const [proceduresData,   setProceduresData]   = useState([]);
  const [labData,          setLabData]          = useState([]);
  const [radiologyData,    setRadiologyData]    = useState([]);
  const [medicationData,   setMedicationData]   = useState([]);
  const [physioData,       setPhysioData]       = useState([]);

  // Final authorization state (WATANIA only — triggered on "Send Visit Approval")
  const [finalAuthReqId,       setFinalAuthReqId]       = useState(null);
  const [submittingFinal,      setSubmittingFinal]       = useState(false);
  const [visitApprovalApproved, setVisitApprovalApproved] = useState(false);
  const [submittingClaim,       setSubmittingClaim]       = useState(false);

  const [sectionStatus, setSectionStatus] = useState({
    diagnosis: false,
    procedures: false,
    lab: false,
    radiology: false,
    medications: false,
    physiotherapy: false,
  });

  // Detect WATANIA from navigation state passed by companyPage
  const isWatania = !!location.state?.isWatania;

  /* ── initialise form-number on mount ─────────────────────────────── */
  useEffect(() => {
    const navState = location.state;

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
          if (data?.idPayer) setIdPayer(data.idPayer);
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

  /* ── auto-poll when a requestId is set (WATANIA eligibility / ZERO / ISLAMIC) ── */
  useEffect(() => {
    if (!requestId) return () => {};
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

  /* ── auto-poll for WATANIA final authorization (after "Close and Submit Claim") ── */
  useEffect(() => {
    if (!finalAuthReqId) return () => {};
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      try {
        const res  = await checkFinalAuthorization(finalAuthReqId);
        const data = res?.data;
        if (data?.formNumber && !data?.pending) {
          clearInterval(timer);
          setFinalAuthReqId(null);
          setVisitApprovalApproved(true);
          enqueueSnackbar(t('Visit Approval approved — click Submit Claim to continue'), { variant: 'success' });
        } else if (data?.pending === false && !data?.success) {
          clearInterval(timer);
          setFinalAuthReqId(null);
          enqueueSnackbar(data?.error || t('Authorization rejected by insurer'), { variant: 'error' });
        } else if (attempts >= 24) {
          clearInterval(timer);
          setFinalAuthReqId(null);
          enqueueSnackbar(t('Timeout: no insurer response for final authorization'), { variant: 'error' });
        }
      } catch { /* will retry next tick */ }
    }, 5000);
    return () => clearInterval(timer);
  }, [finalAuthReqId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── recheck: poll for insurer approval ─────────────────────────── */
  const handleRecheck = useCallback(async () => {
    setLoadingFormNumber(true);
    try {
      if (!requestId) {
        if (!visitCtx) {
          enqueueSnackbar(t('Visit context not loaded'), { variant: 'warning' });
          return;
        }
        const res  = await submitFormNumber(visitCtx);
        const data = res?.data;
        if (data?.formNumber) {
          setFormNumber(data.formNumber);
          if (data?.idPayer) setIdPayer(data.idPayer);
          setAuthApproved(true);
          enqueueSnackbar(t('Form number obtained'), { variant: 'success' });
          return;
        }
        if (data?.requestId) {
          setRequestId(data.requestId);
          enqueueSnackbar(t('Request submitted, awaiting insurer approval'), { variant: 'info' });
        }
      } else {
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

  /* ── Visit Approval — sends final Authorization with all visit data ── */
  // WATANIA/DELTA → Authorization request; polls via finalAuthReqId effect.
  // ZERO/ISLAMIC  → backend returns { noAuthRequired: true }; approval is immediate.
  const handleVisitApproval = async () => {
    setSubmittingFinal(true);
    try {
      const res = await submitFinalAuthorization({
        insuranceLicense: visitCtx?.insuranceLicense,
        clinicianId:      visitCtx?.clinicianId,
        patientNID:       visitCtx?.patientNID,
        memberID:         visitCtx?.memberID,
        encounterId:      idPayer || formNumber,
        diagnosisCodes:   diagnosisData,
        visitType:        visitCtx?.visitType || 'consultant',
        procedureOrders:  proceduresData,
        labOrders:        labData,
        radiologyOrders:  radiologyData,
        medicationOrders: medicationData,
        physioOrders:     physioData,
      });
      const data = res?.data;
      if (data?.pending && data?.requestId) {
        setFinalAuthReqId(data.requestId);
        enqueueSnackbar(t('Visit Approval submitted — awaiting insurer approval'), { variant: 'info' });
      } else if (data?.noAuthRequired) {
        setVisitApprovalApproved(true);
        enqueueSnackbar(t('Visit Approval confirmed — click Submit Claim to continue'), { variant: 'success' });
      } else {
        enqueueSnackbar(data?.error || t('Visit Approval failed'), { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(err?.message || t('Failed to send Visit Approval'), { variant: 'error' });
    } finally {
      setSubmittingFinal(false);
    }
  };

  /* ── Claim submit — called after Visit Approval is confirmed ────── */
  const handleSubmitClaim = async () => {
    setSubmittingClaim(true);
    try {
      const encounterId = idPayer || formNumber;
      const res = await submitClaim({
        insuranceLicense:    visitCtx?.insuranceLicense,
        clinicianId:         visitCtx?.clinicianId,
        patientNID:          visitCtx?.patientNID,
        memberID:            visitCtx?.memberID,
        encounterId,
        priorAuthorizationID: encounterId,
        visitType:           visitCtx?.visitType || 'consultant',
        diagnosisCodes:      diagnosisData,
        activities: [
          ...proceduresData.map((a) => ({ ...a, type: '3' })),
          ...labData.map((a)         => ({ ...a, type: '3' })),
          ...radiologyData.map((a)   => ({ ...a, type: '4' })),
          ...medicationData.map((a)  => ({ ...a, type: '6' })),
          ...physioData.map((a)      => ({ ...a, type: '7' })),
        ],
      });
      if (res?.data?.success) {
        enqueueSnackbar(t('Claim submitted successfully'), { variant: 'success' });
      } else {
        enqueueSnackbar(res?.data?.error || t('Claim submission failed'), { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(err?.message || t('Failed to submit claim'), { variant: 'error' });
    } finally {
      setSubmittingClaim(false);
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

  const visitApprovalBusy = submittingFinal || !!finalAuthReqId;

  let visitApprovalLabel;
  if (finalAuthReqId) {
    visitApprovalLabel = t('Awaiting insurer approval...');
  } else if (visitApprovalApproved) {
    visitApprovalLabel = t('Visit Approval Sent');
  } else {
    visitApprovalLabel = t('Send Visit Approval');
  }

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
              <Tooltip title={isWatania ? t('IDPayer / EncounterID') : t('e-Form Number')}>
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
        <Accordion key={section} sx={{ mb: 1, borderRadius: 2 }}>
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
                  setDiagnosisData(data);
                }}
              />
            )}
            {index === 1 && (
              <ClinicERProcedures
                onDataChange={(data) => {
                  updateSectionStatus('procedures', data.length > 0);
                  setProceduresData(data);
                }}
              />
            )}
            {index === 2 && (
              <LaboratoryOrders
                onDataChange={(data) => {
                  updateSectionStatus('lab', data.length > 0);
                  setLabData(data);
                }}
              />
            )}
            {index === 3 && (
              <RadiologyOrders
                onDataChange={(data) => {
                  updateSectionStatus('radiology', data.length > 0);
                  setRadiologyData(data);
                }}
              />
            )}
            {index === 4 && (
              <MedicationsOrders
                onDataChange={(data) => {
                  updateSectionStatus('medications', data.length > 0);
                  setMedicationData(data);
                }}
              />
            )}
            {index === 5 && (
              <PhysiotherapyOrders
                onDataChange={(data) => {
                  updateSectionStatus('physiotherapy', data.length > 0);
                  setPhysioData(data);
                }}
              />
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="text" color="error" onClick={() => cancellation()}>
          {t('Cancel Visit')}
        </Button>

        <Button variant="contained" color="primary">
          {t('Send Orders')}
        </Button>

        {/* Step 1 after eligibility: Send Visit Approval with all visit data */}
        <Button
          variant="contained"
          color="warning"
          onClick={handleVisitApproval}
          disabled={!authApproved || visitApprovalBusy || visitApprovalApproved}
          startIcon={visitApprovalBusy ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {visitApprovalLabel}
        </Button>

        {/* Step 2: Submit Claim — enabled only after Visit Approval is confirmed */}
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmitClaim}
          disabled={!visitApprovalApproved || submittingClaim}
          startIcon={submittingClaim ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {t('Submit Claim')}
        </Button>
      </Box>
    </Box>
  );
}
