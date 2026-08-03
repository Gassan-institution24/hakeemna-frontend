import { useSnackbar } from 'notistack';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

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

import { paths } from '../../../../routes/paths';
import { useTranslate } from '../../../../locales';
import Iconify from '../../../../components/iconify';
import AddDiagnosis from '../../../../components/clim/AddDiagnosis';
import RadiologyOrders from '../../../../components/clim/RadiologyOrders';
import LaboratoryOrders from '../../../../components/clim/LaboratoryOrders';
import MedicationsOrders from '../../../../components/clim/MedicationsOrders';
import ClinicERProcedures from '../../../../components/clim/ClinicERProcedures';
import PhysiotherapyOrders from '../../../../components/clim/PhysiotherapyOrders';
import { usesBatchedOrders, usesProcedureAuthorization } from '../../../../components/clim/insurerFlow';
import {
  lab,
  ERX,
  radiology,
  submitClaim,
  cancellation,
  labCancelation,
  ERXcancelation,
  checkFormNumber,
  submitFormNumber,
  radiologyCancelation,
  checkFinalAuthorization,
  submitFinalAuthorization,
  submitProcedureAuthorization,
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
  const navigate = useNavigate();

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
  // The visit's Authorization.ID — kept for "Cancel Visit" even after the form number
  // arrives (requestId gets cleared once approved, so we preserve it separately here).
  const [visitAuthId,          setVisitAuthId]          = useState(null);
  const [submittingFinal,      setSubmittingFinal]       = useState(false);
  const [visitApprovalApproved, setVisitApprovalApproved] = useState(false);
  const [submittingClaim,       setSubmittingClaim]       = useState(false);
  const [cancellingVisit,       setCancellingVisit]       = useState(false);

  // Batched-order flow (every payer except WATANIA/DELTA): orders are collected while the
  // doctor works and submitted together by "Send Order", grouped by TPO transaction type.
  // Each entry holds what was actually sent, so the order can be cancelled verbatim later.
  const [sendingOrders, setSendingOrders] = useState(false);
  const [sentOrders, setSentOrders] = useState({ lab: null, radiology: null, erx: null });

  // In-clinic procedures (Islamic / MedNet / Solidarity): each "Send Order" posts one
  // Authorization for the procedures added since the last one, so the step repeats as the
  // doctor keeps working. Codes already declared are remembered and never resent.
  const [sentProcedureCodes, setSentProcedureCodes] = useState([]);
  // Once the claim is submitted or the visit is cancelled the visit is finished —
  // lock the action buttons so the user can't keep working after leaving.
  const [finalized,             setFinalized]             = useState(false);

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
      // On the batched flow the visit approval was already confirmed on the patient screen —
      // that confirmation is what let us in here, so it does not need sending again.
      if (navState.visitApprovalApproved) setVisitApprovalApproved(true);
      if (navState.idPayer) setIdPayer(navState.idPayer);
      if (navState.formNumber) {
        setFormNumber(navState.formNumber);
        setAuthApproved(true);
      } else if (navState.eligibilityApproved) {
        // Islamic / MedNet / Solidarity: eligibility confirmed coverage but issues no e-Form
        // number — that arrives with the visit approval sent from this screen.
        setAuthApproved(true);
      } else if (navState.requestId) {
        setRequestId(navState.requestId);
        setVisitAuthId(navState.requestId);
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
        } else if (data?.eligible) {
          setAuthApproved(true);
        } else if (data?.requestId) {
          setRequestId(data.requestId);
          setVisitAuthId(data.requestId);
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
    const timer = setInterval(async () => {
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
        } else if (data?.eligible) {
          // Coverage only (Islamic / MedNet / Solidarity) — the e-Form number comes with
          // the visit approval, so stop polling here and let the doctor record the visit.
          clearInterval(timer);
          setAuthApproved(true);
          setRequestId(null);
          enqueueSnackbar(t('Patient is eligible'), { variant: 'success' });
        } else if (!data?.pending) {
          clearInterval(timer);
          enqueueSnackbar(data?.error || t('Authorization not approved'), { variant: 'warning' });
          setRequestId(null);
        }
        // keep polling indefinitely until insurer approves or rejects
      } catch { /* will retry next tick */ }
    }, 5000);
    return () => clearInterval(timer);
  }, [requestId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── auto-poll for WATANIA final authorization (after "Close and Submit Claim") ── */
  useEffect(() => {
    if (!finalAuthReqId) return () => {};
    const timer = setInterval(async () => {
      try {
        const res  = await checkFinalAuthorization(finalAuthReqId);
        const data = res?.data;
        if (data?.formNumber && !data?.pending) {
          clearInterval(timer);
          setFinalAuthReqId(null);
          // Islamic / MedNet / Solidarity issue the e-Form number on this response — it is
          // the EncounterID every order and the claim must carry from here on.
          setFormNumber(data.formNumber);
          if (data?.idPayer) setIdPayer(data.idPayer);
          setAuthApproved(true);
          setVisitApprovalApproved(true);
          enqueueSnackbar(t('Visit Approval approved — click Submit Claim to continue'), { variant: 'success' });
        } else if (data?.pending === false && !data?.success) {
          clearInterval(timer);
          setFinalAuthReqId(null);
          enqueueSnackbar(data?.error || t('Authorization rejected by insurer'), { variant: 'error' });
        }
        // keep polling indefinitely until insurer approves or rejects
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
        if (data?.eligible) {
          setAuthApproved(true);
          enqueueSnackbar(t('Patient is eligible'), { variant: 'success' });
          return;
        }
        if (data?.requestId) {
          setRequestId(data.requestId);
          setVisitAuthId(data.requestId);
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
        if (data?.eligible) {
          setAuthApproved(true);
          setRequestId(null);
          enqueueSnackbar(t('Patient is eligible'), { variant: 'success' });
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

  // The insurer records every diagnosis it is sent, so one code listed twice shows up twice
  // on its side. This is the only list any transaction is built from — exactly the codes the
  // doctor added, each once, first one Principal.
  const diagnosisPayload = useMemo(() => {
    const seen = new Set();
    return diagnosisData.filter((d) => {
      const key = String(d?.code || '').trim().toUpperCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [diagnosisData]);

  /* ── In-clinic procedures approval (Islamic / MedNet / Solidarity) ────
     Procedures have no TPO order transaction of their own, so they are approved with an
     Authorization posted against the e-Form encounter. Repeatable: only the procedures that
     have not been declared yet are sent. ── */
  const handleSendProcedures = useCallback(
    async (items) => {
      const res = await submitProcedureAuthorization({
        insuranceLicense: visitCtx?.insuranceLicense,
        clinicianId:      visitCtx?.clinicianId,
        patientNID:       visitCtx?.patientNID,
        memberID:         visitCtx?.memberID,
        encounterId:      formNumber,
        diagnosisCodes:   diagnosisPayload,
        procedures:       items.map((p) => ({
          code:     p.code,
          nameEn:   p.nameEn,
          quantity: p.quantity ?? 1,
          gross:    Number(p.gross) || 0,
          net:      Number(p.net ?? p.insurance) || 0,
        })),
      });

      if (!res?.data?.success) {
        throw new Error(res?.data?.error || t('Failed to send in-clinic procedures'));
      }
      setSentProcedureCodes((prev) => [...prev, ...items.map((p) => p.code)]);
      return res.data;
    },
    [visitCtx, formNumber, diagnosisPayload, t]
  );

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
        // WATANIA/DELTA authorise against the EncounterID eligibility already gave them —
        // for WATANIA that number IS the IDPayer. Islamic/MedNet/Solidarity have no
        // encounter yet: this request is what asks the insurer to open one and answer with
        // the e-Form number, so the backend fills the EncounterID itself (0 or generated).
        encounterId:      formNumber,
        diagnosisCodes:   diagnosisPayload,
        visitType:        visitCtx?.visitType || 'consultant',
        benefitType:      visitCtx?.benefitType || 'outpatient',
        procedureOrders:  proceduresData,
        labOrders:        labData,
        radiologyOrders:  radiologyData,
        medicationOrders: medicationData,
        physioOrders:     physioData,
      });
      const data = res?.data;
      if (data?.pending && data?.requestId) {
        setFinalAuthReqId(data.requestId);
        setVisitAuthId(data.requestId);
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

  /* ── Send Order — one request per TPO transaction type ──────────────
     TPO has no combined order transaction, so the most batching it allows is three:
     Lab (laboratory tests + physiotherapy, both Activity Type '3' JMA), Rad, and ERX.
     Sections that are empty are skipped; sections already sent are not re-sent. */
  const orderBatches = useMemo(
    () => [
      {
        key: 'lab',
        label: t('Laboratory'),
        // Physiotherapy has no transaction type of its own and is JMA like the lab tests,
        // so it rides the same Lab request.
        items: [...labData, ...physioData].map((o) => ({
          code: o.code,
          nameEn: o.nameEn,
          quantity: o.quantity ?? 1,
        })),
        send: (items) => lab({ ...visitCtx, encounterId: formNumber, diagnosisCodes: diagnosisPayload, labTests: items }),
        cancel: (batch) =>
          labCancelation({
            ...visitCtx,
            encounterId: formNumber,
            orderId: batch.orderId,
            activityIds: batch.activityIds,
            labTests: batch.items,
          }),
      },
      {
        key: 'radiology',
        label: t('Radiology'),
        items: radiologyData.map((o) => ({
          code: o.code,
          nameEn: o.nameEn,
          quantity: o.quantity ?? 1,
        })),
        send: (items) =>
          radiology({ ...visitCtx, encounterId: formNumber, diagnosisCodes: diagnosisPayload, radiologyTests: items }),
        cancel: (batch) =>
          radiologyCancelation({
            ...visitCtx,
            encounterId: formNumber,
            orderId: batch.orderId,
            activityIds: batch.activityIds,
            radiologyTests: batch.items,
          }),
      },
      {
        key: 'erx',
        label: t('Medications'),
        items: medicationData.map((o) => ({
          code: o.code, // barcode → TPO drug code list
          nameEn: o.nameEn,
          routeOfAdmin: o.routeOfAdmin || 'ROA074',
          quantity: o.packQty ?? 1,
          duration: o.duration ?? 1,
          refills: o.refills ?? 0,
        })),
        send: (items) =>
          ERX({ ...visitCtx, encounterId: formNumber, diagnosisCodes: diagnosisPayload, medications: items }),
        cancel: (batch) =>
          ERXcancelation({
            ...visitCtx,
            encounterId: formNumber,
            orderId: batch.orderId,
            activityIds: batch.activityIds,
            medications: batch.items,
          }),
      },
    ],
    [visitCtx, formNumber, diagnosisPayload, labData, physioData, radiologyData, medicationData, t]
  );

  const pendingBatches = orderBatches.filter((b) => b.items.length > 0 && !sentOrders[b.key]);

  const handleSendOrders = async () => {
    if (pendingBatches.length === 0) {
      enqueueSnackbar(t('No new orders to send'), { variant: 'info' });
      return;
    }
    setSendingOrders(true);

    const sent = [];
    const failed = [];
    const submitted = {};

    // Strictly sequential. TPO races against itself when several order transactions land on
    // the same new encounter at once and returns 500 "Sequence contains more than one
    // element" — measured at 2 failures in 18 requests when sent in parallel, 0 in 18 when
    // sent one after another. A promise chain keeps that ordering without a loop.
    await pendingBatches.reduce(
      (chain, batch) =>
        chain.then(async () => {
          try {
            const res = await batch.send(batch.items);
            submitted[batch.key] = {
              orderId: res?.data?.orderId,
              activityIds: res?.data?.activityIds,
              referenceNumber: res?.data?.referenceNumber,
              items: batch.items,
            };
            sent.push(`${batch.label} — ${t('Ref')}: ${res?.data?.referenceNumber ?? '—'}`);
          } catch (e) {
            // Carry on with the remaining sections; a partial send is recoverable because
            // "Send Order" only ever submits sections that have not gone out yet.
            failed.push(`${batch.label}: ${e?.response?.data?.error || e?.message || t('failed')}`);
          }
        }),
      Promise.resolve()
    );

    setSentOrders((prev) => ({ ...prev, ...submitted }));
    setSendingOrders(false);
    if (sent.length) enqueueSnackbar(`${t('Orders sent')} — ${sent.join(' · ')}`, { variant: 'success' });
    if (failed.length) enqueueSnackbar(failed.join(' · '), { variant: 'error' });
  };

  // Removing a row after the batch went out means cancelling that whole order at the
  // insurer — TPO cancels an Order, it cannot drop one activity from within one. The
  // section then returns to "not sent" so the remaining rows can be sent again.
  const handleCancelBatch = useCallback(
    async (key) => {
      const batch = sentOrders[key];
      if (!batch) return true;

      const config = orderBatches.find((b) => b.key === key);
      const confirmed = window.confirm(
        t('This will cancel the whole {{label}} order at the insurer. Continue?', {
          label: config.label,
        })
      );
      if (!confirmed) return false;

      try {
        await config.cancel(batch);
        setSentOrders((prev) => ({ ...prev, [key]: null }));
        enqueueSnackbar(t('{{label}} order cancelled — send again when ready', { label: config.label }), {
          variant: 'success',
        });
        return true;
      } catch (e) {
        enqueueSnackbar(e?.response?.data?.error || t('Failed to cancel order'), { variant: 'error' });
        return false;
      }
    },
    [sentOrders, orderBatches, enqueueSnackbar, t]
  );

  const cancelLabBatch       = useCallback(() => handleCancelBatch('lab'),       [handleCancelBatch]);
  const cancelRadiologyBatch = useCallback(() => handleCancelBatch('radiology'), [handleCancelBatch]);
  const cancelErxBatch       = useCallback(() => handleCancelBatch('erx'),       [handleCancelBatch]);

  /* ── Claim submit — called after Visit Approval is confirmed ────── */
  const handleSubmitClaim = async () => {
    setSubmittingClaim(true);
    try {
      // The claim carries the e-Form number as EncounterID, exactly as the orders did.
      // PriorAuthorizationID is the IDPayer from the visit approval response (MedNet /
      // Solidarity / Islamic); WATANIA returns the same value for both, and DELTA has no
      // IDPayer at all, so both fall back to the form number.
      const encounterId          = formNumber;
      const priorAuthorizationID = idPayer || formNumber;

      // The claim carries the consultation (prepended server-side as Activity ID '1') plus
      // in-clinic procedures only. Lab, radiology, medications and physiotherapy are each
      // sent as their own TPO order the moment they are added, so repeating them here would
      // declare them to the insurer a second time.
      //
      // Procedure rows carry `insurance` (the payer's share), never `net`, and the claim
      // builder reads `net` — without this mapping every procedure is submitted at Net 0.
      // TPO accepts that (it derives both totals from the activities), so it fails silently:
      // the provider bills the insurer nothing for the procedure.
      const procedureActivities = proceduresData.map((p) => ({
        code:     p.code,
        nameEn:   p.nameEn,
        type:     '3', // JMA — types 4 and 7 reject JOR codes (VR0139 / VR0141)
        quantity: p.quantity ?? 1,
        gross:    Number(p.gross) || 0,
        net:      Number(p.net ?? p.insurance) || 0,
      }));

      // Claim.Gross/Net are summed server-side from the activities, but PatientShare is not
      // derived — send the procedure total explicitly or the insurer is told the patient
      // owes nothing.
      const procedurePatientShare = proceduresData.reduce(
        (sum, p) => sum + (Number(p.patientShare) || 0),
        0
      );

      const res = await submitClaim({
        insuranceLicense:    visitCtx?.insuranceLicense,
        clinicianId:         visitCtx?.clinicianId,
        patientNID:          visitCtx?.patientNID,
        memberID:            visitCtx?.memberID,
        encounterId,
        priorAuthorizationID,
        visitType:           visitCtx?.visitType || 'consultant',
        diagnosisCodes:      diagnosisPayload,
        activities:          procedureActivities,
        patientShare:        procedurePatientShare,
      });
      if (res?.data?.success) {
        setFinalized(true);
        enqueueSnackbar(t('Claim submitted successfully'), { variant: 'success' });
        // Claim is done — leave the page (replace so Back can't return to keep working).
        navigate(paths.unitservice.myClaim.root, { replace: true });
      } else {
        enqueueSnackbar(res?.data?.error || t('Claim submission failed'), { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.error || err?.message || t('Failed to submit claim'), { variant: 'error' });
    } finally {
      setSubmittingClaim(false);
    }
  };

  /* ── Cancel Visit — cancels the visit's Authorization at the insurer ── */
  const handleCancelVisit = async () => {
    // The Authorization.ID that was submitted for this visit. visitAuthId is preserved
    // across the form-number flow; fall back to the transient ids if it isn't set yet.
    const authorizationId = visitAuthId || finalAuthReqId || requestId;
    if (!authorizationId) {
      enqueueSnackbar(t('No submitted authorization to cancel for this visit'), { variant: 'warning' });
      return;
    }
    const confirmed = window.confirm(t('Are you sure you want to cancel this visit?'));
    if (!confirmed) return;
    setCancellingVisit(true);
    try {
      const res = await cancellation({
        insuranceLicense: visitCtx?.insuranceLicense,
        clinicianId:      visitCtx?.clinicianId,
        patientNID:       visitCtx?.patientNID,
        memberID:         visitCtx?.memberID,
        authorizationId,
      });
      setFinalized(true);
      enqueueSnackbar(
        res?.data?.alreadyCancelled ? t('Visit was already cancelled') : t('Visit cancelled'),
        { variant: 'success' }
      );
      // Visit is done — leave the page (replace so Back can't return to keep working).
      navigate(paths.unitservice.myClaim.root, { replace: true });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.error || err?.message || t('Failed to cancel visit'), { variant: 'error' });
      setCancellingVisit(false);
    }
  };

  // Return the same object when nothing changed so React bails out. Each section gets a
  // fresh inline onDataChange every render and reports back from an effect keyed on it,
  // so always allocating a new object here keeps the page re-rendering until React's
  // update-depth limit trips.
  const updateSectionStatus = (key, hasData) => {
    setSectionStatus((prev) => (prev[key] === hasData ? prev : { ...prev, [key]: hasData }));
  };

  const authStatus = useMemo(() => {
    if (loadingFormNumber && !formNumber && !authApproved) {
      return { label: t('Checking eligibility...'), color: 'warning' };
    }
    // Islamic / MedNet / Solidarity are eligible before any form number exists — theirs is
    // issued by the visit approval, so eligibility alone is enough to show "Eligible".
    if (authApproved)             return { label: t('Eligible'), color: 'success' };
    if (requestId && !formNumber) return { label: t('Pending approval'), color: 'warning' };
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

  // WATANIA/DELTA declare their orders inside the final Authorization sent from this screen,
  // so they keep sending each order as it is added. Everyone else collects and batches.
  const batchedFlow = usesBatchedOrders(visitCtx?.insuranceLicense);
  const anySentOrders = Object.values(sentOrders).some(Boolean);

  // Islamic / MedNet / Solidarity approve their in-clinic procedures with an Authorization of
  // their own, sent from the procedures section. Everyone else declares them on the claim.
  const procedureAuthFlow = usesProcedureAuthorization(visitCtx?.insuranceLicense);

  let sendOrderLabel;
  if (sendingOrders) {
    sendOrderLabel = t('Sending orders...');
  } else if (pendingBatches.length > 0) {
    sendOrderLabel = anySentOrders ? t('Send Remaining Orders') : t('Send Order');
  } else {
    sendOrderLabel = anySentOrders ? t('Orders Sent') : t('Send Order');
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
                visitCtx={visitCtx}
                encounterId={formNumber}
                onSendOrder={procedureAuthFlow ? handleSendProcedures : undefined}
                sentCodes={sentProcedureCodes}
                onDataChange={(data) => {
                  updateSectionStatus('procedures', data.length > 0);
                  setProceduresData(data);
                }}
              />
            )}
            {index === 2 && (
              <LaboratoryOrders
                visitCtx={visitCtx}
                encounterId={formNumber}
                deferSend={batchedFlow}
                sentBatch={sentOrders.lab}
                onCancelBatch={cancelLabBatch}
                onDataChange={(data) => {
                  updateSectionStatus('lab', data.length > 0);
                  setLabData(data);
                }}
              />
            )}
            {index === 3 && (
              <RadiologyOrders
                visitCtx={visitCtx}
                encounterId={formNumber}
                deferSend={batchedFlow}
                sentBatch={sentOrders.radiology}
                onCancelBatch={cancelRadiologyBatch}
                onDataChange={(data) => {
                  updateSectionStatus('radiology', data.length > 0);
                  setRadiologyData(data);
                }}
              />
            )}
            {index === 4 && (
              <MedicationsOrders
                visitCtx={visitCtx}
                encounterId={formNumber}
                deferSend={batchedFlow}
                sentBatch={sentOrders.erx}
                onCancelBatch={cancelErxBatch}
                onDataChange={(data) => {
                  updateSectionStatus('medications', data.length > 0);
                  setMedicationData(data);
                }}
              />
            )}
            {index === 5 && (
              <PhysiotherapyOrders
                sentBatch={sentOrders.lab}
                onCancelBatch={cancelLabBatch}
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
        <Button
          variant="text"
          color="error"
          onClick={handleCancelVisit}
          disabled={cancellingVisit || finalized}
          startIcon={cancellingVisit ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {t('Cancel Visit')}
        </Button>

        {/* Batched flow: the visit approval was confirmed before this screen opened, so the
            action here is sending the collected orders. WATANIA/DELTA still send their final
            Authorization from here instead. */}
        {batchedFlow ? (
          <Button
            variant="contained"
            color="warning"
            onClick={handleSendOrders}
            // Every order carries the e-Form number as its EncounterID, so orders can only
            // go out once the insurer has issued it.
            disabled={!formNumber || sendingOrders || pendingBatches.length === 0 || finalized}
            startIcon={sendingOrders ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {sendOrderLabel}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="warning"
            onClick={handleVisitApproval}
            disabled={!authApproved || visitApprovalBusy || visitApprovalApproved || finalized}
            startIcon={visitApprovalBusy ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {visitApprovalLabel}
          </Button>
        )}

        {/* Step 2: Submit Claim — enabled only after Visit Approval is confirmed */}
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmitClaim}
          disabled={!visitApprovalApproved || submittingClaim || finalized}
          startIcon={submittingClaim ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {t('Submit Claim')}
        </Button>
      </Box>
    </Box>
  );
}
