import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  Box,
  Chip,
  Grid,
  Paper,
  Table,
  Alert,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';
import { paths } from '../../../../routes/paths';
import { useTranslate } from '../../../../locales';
import { useGetInsuranceCo } from '../../../../api';
import { useAuthContext } from '../../../../auth/hooks';
import { useSnackbar } from '../../../../components/snackbar';
import {
  checkVisitApproval,
  submitVisitApproval,
  submitVisitAuthorization,
} from '../../../../services/claimService';

const VISIT_TYPES = [
  { value: 'gp', label: 'GP' },
  { value: 'specialist', label: 'Specialist' },
  { value: 'consultant', label: 'Consultant' },
];

const BENEFIT_TYPES = [
  { value: 'outpatient', label: 'Outpatient' },
  { value: 'maternity', label: 'Maternity' },
  { value: 'dental', label: 'Dental' },
];

const STATUS_COLOR = { approved: 'success', pending: 'warning', rejected: 'error' };

// WATANIA companies require a second Authorization step on "Create Visit"
const WATANIA_LICENSES = ['WataniaINS', 'Medservice', 'Omnicare', 'MedExa'];

export default function CompanyPage() {
  const { id: companyId } = useParams();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { isuranceData: company } = useGetInsuranceCo(companyId);

  // Step 1 — patient search
  const [search, setSearch] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [memberID, setMemberID] = useState('');

  // Step 2 — eligibility form fields
  const [insuranceLicense, setInsuranceLicense] = useState('');
  const [visitType, setVisitType] = useState('consultant');
  const [benefitType, setBenefitType] = useState('outpatient');

  // Step 2 — eligibility result
  const [eligibilityStatus, setEligibilityStatus] = useState(null); // null | 'approved' | 'pending' | 'rejected'
  const [formNumber, setFormNumber] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [idPayer, setIdPayer] = useState(null);
  const [loadingEligibility, setLoadingEligibility] = useState(false);

  // Step 3 — visit authorization (WATANIA only, triggered on "Create Visit")
  const [authRequestId, setAuthRequestId] = useState(null); // polling ID for Authorization step
  const [loadingAuth, setLoadingAuth] = useState(false);    // true while submitting auth request

  const clinicianId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.license || 'JOR-P-000435';

  const isWatania = WATANIA_LICENSES.includes(insuranceLicense);

  // Search patients via API when the user types ≥2 characters
  useEffect(() => {
    const q = search.trim();
    if (q.length < 2) { setFilteredPatients([]); return () => {}; }
    let cancelled = false;
    setLoadingSearch(true);
    axiosInstance
      .get(`/api/uspatients/find?name_english=${encodeURIComponent(q)}`)
      .then((res) => { if (!cancelled) setFilteredPatients(res.data || []); })
      .catch(() => { if (!cancelled) setFilteredPatients([]); })
      .finally(() => { if (!cancelled) setLoadingSearch(false); });
    return () => { cancelled = true; };
  }, [search]);

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setInsuranceLicense(company?.tpa || '');
    setEligibilityStatus(null);
    setFormNumber(null);
    setRequestId(null);
    setIdPayer(null);
    setAuthRequestId(null);
    setMemberID('');

    const basePatientId = patient.patient || patient._id;
    try {
      const res = await axiosInstance.get(`/api/insurance/data/${basePatientId}/patient`);
      const records = res.data || [];
      const match = records.find((r) => String(r.insurance?._id) === String(companyId));
      if (match) setMemberID(match.insurance_client_num || '');
    } catch { /* leave memberID empty */ }
  };

  // ── Step 2: Check eligibility ─────────────────────────────────────────
  const handleCheckEligibility = async () => {
    setLoadingEligibility(true);
    setEligibilityStatus(null);
    setAuthRequestId(null);
    try {
      const res = await submitVisitApproval({
        insuranceLicense,
        clinicianId,
        patientNID: selectedPatient.identification_num,
        memberID,
        visitType,
        benefitType,
      });
      const data = res?.data;

      if (data?.formNumber && !data?.pending) {
        // DELTA / ZERO / ISLAMIC: form number returned immediately or after first poll
        setFormNumber(data.formNumber);
        if (data?.idPayer) setIdPayer(data.idPayer);
        setEligibilityStatus('approved');
        enqueueSnackbar(t('Patient is eligible'), { variant: 'success' });
      } else if (data?.requestId) {
        // Async insurer response needed — start polling
        setRequestId(data.requestId);
        setEligibilityStatus('pending');
        enqueueSnackbar(t('Awaiting insurer approval'), { variant: 'info' });
      } else {
        setEligibilityStatus('rejected');
        enqueueSnackbar(data?.error || t('Not eligible'), { variant: 'error' });
      }
    } catch (err) {
      setEligibilityStatus('rejected');
      enqueueSnackbar(err?.message || t('Eligibility check failed'), { variant: 'error' });
    } finally {
      setLoadingEligibility(false);
    }
  };

  const handleRecheck = async () => {
    if (!requestId) return;
    setLoadingEligibility(true);
    try {
      const res = await checkVisitApproval(requestId);
      const data = res?.data;
      if (data?.formNumber && !data?.pending) {
        setFormNumber(data.formNumber);
        if (data?.idPayer) setIdPayer(data.idPayer);
        setEligibilityStatus('approved');
        enqueueSnackbar(t('Approved! Patient is eligible'), { variant: 'success' });
      } else if (data?.pending) {
        enqueueSnackbar(t('Still awaiting insurer response'), { variant: 'info' });
      } else {
        setEligibilityStatus('rejected');
        enqueueSnackbar(data?.error || t('Not approved'), { variant: 'warning' });
      }
    } catch (err) {
      enqueueSnackbar(err?.message || t('Recheck failed'), { variant: 'error' });
    } finally {
      setLoadingEligibility(false);
    }
  };

  // Auto-poll while eligibility is pending (WATANIA / ZERO / ISLAMIC)
  useEffect(() => {
    if (!requestId || eligibilityStatus !== 'pending') return () => {};
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      try {
        const res = await checkVisitApproval(requestId);
        const data = res?.data;
        if (data?.formNumber && !data?.pending) {
          clearInterval(timer);
          setFormNumber(data.formNumber);
          if (data?.idPayer) setIdPayer(data.idPayer);
          setEligibilityStatus('approved');
          enqueueSnackbar(t('Approved! Patient is eligible'), { variant: 'success' });
        } else if (data?.pending === false && !data?.success) {
          clearInterval(timer);
          setEligibilityStatus('rejected');
          enqueueSnackbar(data?.error || t('Not approved'), { variant: 'warning' });
        } else if (attempts >= 12) {
          clearInterval(timer);
          setEligibilityStatus('rejected');
          enqueueSnackbar(t('Timeout: no insurer response after 60 s'), { variant: 'error' });
        }
      } catch { /* will retry next tick */ }
    }, 5000);
    return () => clearInterval(timer);
  }, [requestId, eligibilityStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step 3: Create Visit ──────────────────────────────────────────────
  // WATANIA: submit Authorization with EncounterID=IDPayer, then poll and navigate when approved.
  // DELTA / ZERO / ISLAMIC: navigate immediately — form number already obtained.
  const handleCreateVisit = async () => {
    if (isWatania) {
      setLoadingAuth(true);
      try {
        const res = await submitVisitAuthorization({
          insuranceLicense,
          clinicianId,
          patientNID: selectedPatient.identification_num,
          memberID,
          idPayer,
          visitType,
        });
        const data = res?.data;
        if (data?.pending && data?.requestId) {
          setAuthRequestId(data.requestId);
          enqueueSnackbar(t('Visit authorization submitted — approve in ClaimBrowser'), { variant: 'info' });
        } else if (data?.success && !data?.pending) {
          // Shouldn't happen for WATANIA but handle gracefully
          doNavigate(formNumber, idPayer);
        } else {
          enqueueSnackbar(data?.error || t('Authorization request failed'), { variant: 'error' });
        }
      } catch (err) {
        enqueueSnackbar(err?.message || t('Authorization request failed'), { variant: 'error' });
      } finally {
        setLoadingAuth(false);
      }
    } else {
      doNavigate(formNumber, idPayer);
    }
  };

  const doNavigate = (finalFormNumber, finalIdPayer) => {
    navigate(paths.unitservice.accounting.claim.patientVisitView(selectedPatient._id), {
      state: {
        visitContext: {
          patientNID:      selectedPatient.identification_num,
          memberID,
          insuranceLicense,
          clinicianId,
          visitType,
          benefitType,
        },
        formNumber: finalFormNumber,
        requestId,
        idPayer:    finalIdPayer,
      },
    });
    enqueueSnackbar(t('Visit created successfully'), { variant: 'success' });
  };

  // Auto-poll for WATANIA visit authorization approval, then navigate
  useEffect(() => {
    if (!authRequestId) return () => {};
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      try {
        const res = await checkVisitApproval(authRequestId);
        const data = res?.data;
        if (data?.formNumber && !data?.pending) {
          clearInterval(timer);
          setAuthRequestId(null);
          const finalFormNumber = data.formNumber;
          const finalIdPayer    = data.idPayer || idPayer;
          setFormNumber(finalFormNumber);
          if (data.idPayer) setIdPayer(data.idPayer);
          doNavigate(finalFormNumber, finalIdPayer);
        } else if (data?.pending === false && !data?.success) {
          clearInterval(timer);
          setAuthRequestId(null);
          enqueueSnackbar(data?.error || t('Visit authorization rejected by insurer'), { variant: 'error' });
        } else if (attempts >= 24) {
          clearInterval(timer);
          setAuthRequestId(null);
          enqueueSnackbar(t('Timeout: no insurer response for visit authorization'), { variant: 'error' });
        }
      } catch { /* will retry next tick */ }
    }, 5000);
    return () => clearInterval(timer);
  }, [authRequestId]); // eslint-disable-line react-hooks/exhaustive-deps

  const statusLabel = {
    approved: t('Eligible'),
    pending:  t('Pending Approval'),
    rejected: t('Not Eligible'),
  };

  let searchHelperText = '';
  if (loadingSearch) searchHelperText = t('Searching...');
  else if (search.trim().length > 0 && search.trim().length < 2) searchHelperText = t('Type at least 2 characters');

  const createVisitBusy = loadingAuth || !!authRequestId;

  let createVisitLabel = t('Create Visit');
  if (authRequestId) createVisitLabel = t('Waiting for authorization...');
  else if (isWatania) createVisitLabel = t('Create Visit & Authorize');

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        {/* Company header */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            {company?.name_english || '...'}
          </Typography>
          <Typography color="text.secondary">{t('Insurance Company')}</Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Step 1 — Patient Search */}
          <Grid item xs={12} md={selectedPatient ? 6 : 12}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f4f6f8' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonSearchIcon color="primary" />
                <Typography fontWeight="bold">{t('Search Patient')}</Typography>
              </Box>
              <TextField
                fullWidth
                label={t('Search by patient name')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                helperText={searchHelperText}
              />
            </Paper>

            {filteredPatients.length > 0 && (
              <Paper sx={{ borderRadius: 3, mt: 2 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('Name')}</TableCell>
                        <TableCell>{t('NID')}</TableCell>
                        <TableCell align="center">{t('Action')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow
                          key={patient._id}
                          selected={selectedPatient?._id === patient._id}
                          hover
                        >
                          <TableCell>{patient.name_english || patient.name_arabic}</TableCell>
                          <TableCell>{patient.identification_num}</TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant={selectedPatient?._id === patient._id ? 'contained' : 'outlined'}
                              onClick={() => handleSelectPatient(patient)}
                            >
                              {selectedPatient?._id === patient._id ? t('Selected') : t('Select')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </Grid>

          {/* Step 2 & 3 — Eligibility + Create Visit */}
          {selectedPatient && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <VerifiedUserIcon color="primary" />
                  <Typography fontWeight="bold">{t('Eligibility Check')}</Typography>
                  {eligibilityStatus && (
                    <Chip
                      label={statusLabel[eligibilityStatus]}
                      color={STATUS_COLOR[eligibilityStatus]}
                      size="small"
                      sx={{ ml: 'auto' }}
                    />
                  )}
                </Box>

                <Typography fontWeight="medium" mb={2}>
                  {selectedPatient.name_english || selectedPatient.name_arabic}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {!memberID && selectedPatient && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {t('No insurance record found for this patient. Enter Member ID manually.')}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('Member ID')}
                      value={memberID}
                      onChange={(e) => setMemberID(e.target.value)}
                      size="small"
                      required
                      helperText={t('Insurance card / member number')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label={t('TPA License')}
                      value={insuranceLicense}
                      onChange={(e) => setInsuranceLicense(e.target.value)}
                      size="small"
                      helperText={t('Auto-filled from company; override for testing')}
                    >
                      <MenuItem disabled><em>— DELTA (self-generate) —</em></MenuItem>
                      {['DeltaINS', 'Newton', 'GlobMed', 'EuroArab', 'Assurers'].map((v) => (
                        <MenuItem key={v} value={v}>{v}</MenuItem>
                      ))}
                      <MenuItem disabled><em>— WATANIA (IDPayer) —</em></MenuItem>
                      {['WataniaINS', 'Medservice', 'Omnicare', 'MedExa'].map((v) => (
                        <MenuItem key={v} value={v}>{v}</MenuItem>
                      ))}
                      <MenuItem disabled><em>— ZERO (EncounterID=0) —</em></MenuItem>
                      {['MedNet', 'Solidarity'].map((v) => (
                        <MenuItem key={v} value={v}>{v}</MenuItem>
                      ))}
                      <MenuItem disabled><em>— ISLAMIC —</em></MenuItem>
                      <MenuItem value="IslamicINS">IslamicINS</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      select
                      label={t('Visit Type')}
                      value={visitType}
                      onChange={(e) => setVisitType(e.target.value)}
                      size="small"
                    >
                      {VISIT_TYPES.map((o) => (
                        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      select
                      label={t('Benefit Type')}
                      value={benefitType}
                      onChange={(e) => setBenefitType(e.target.value)}
                      size="small"
                    >
                      {BENEFIT_TYPES.map((o) => (
                        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    onClick={handleCheckEligibility}
                    disabled={loadingEligibility || !insuranceLicense || !memberID}
                    startIcon={loadingEligibility ? <CircularProgress size={16} /> : null}
                  >
                    {t('Check Eligibility')}
                  </Button>

                  {eligibilityStatus === 'pending' && (
                    <Button
                      variant="outlined"
                      onClick={handleRecheck}
                      disabled={loadingEligibility}
                    >
                      {t('Recheck')}
                    </Button>
                  )}

                  {eligibilityStatus === 'approved' && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleCreateVisit}
                      disabled={createVisitBusy}
                      startIcon={createVisitBusy ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                      {createVisitLabel}
                    </Button>
                  )}
                </Box>

                {/* Eligibility IDPayer / Form number */}
                {formNumber && (
                  <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('Form No')}:
                    </Typography>
                    <Typography fontFamily="monospace" fontWeight="bold">
                      {formNumber}
                    </Typography>
                  </Box>
                )}

                {/* WATANIA authorization waiting hint */}
                {authRequestId && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    {t('Visit authorization sent — please approve in ClaimBrowser. This page will navigate automatically when approved.')}
                  </Alert>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
