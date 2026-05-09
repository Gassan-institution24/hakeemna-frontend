import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  Box,
  Chip,
  Grid,
  Paper,
  Table,
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

import { paths } from '../../../../routes/paths';
import { useTranslate } from '../../../../locales';
import { useGetInsuranceCo } from '../../../../api';
import { useAuthContext } from '../../../../auth/hooks';
import { useSnackbar } from '../../../../components/snackbar';
import { checkVisitApproval, submitVisitApproval } from '../../../../services/claimService';

// Mock patient data — replace with real API call
const DEMO_PATIENTS = [
  { _id: '1', name: 'Ahmad Ali', email: 'ahmad@test.com', nid: '4000026255', memberID: '0000' },
  { _id: '2', name: 'Sara Mohammad', email: 'sara@test.com', nid: '4000012345', memberID: '0001' },
  { _id: '3', name: 'Omar Khaled', email: 'omar@test.com', nid: '4000067890', memberID: '0002' },
];

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

export default function CompanyPage() {
  const { id: companyId } = useParams();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { isuranceData: company } = useGetInsuranceCo(companyId);

  // Step 1 — patient search
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Step 2 — eligibility form fields
  const [insuranceLicense, setInsuranceLicense] = useState('');
  const [visitType, setVisitType] = useState('consultant');
  const [benefitType, setBenefitType] = useState('outpatient');

  // Step 2 — eligibility result
  const [eligibilityStatus, setEligibilityStatus] = useState(null); // null | 'approved' | 'pending' | 'rejected'
  const [formNumber, setFormNumber] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [loadingEligibility, setLoadingEligibility] = useState(false);

  const clinicianId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.license || 'JOR-P-000435';

  const filteredPatients = search.trim()
    ? DEMO_PATIENTS.filter((p) => {
        const q = search.toLowerCase().trim();
        return p.name.toLowerCase().startsWith(q) || p.email.toLowerCase().startsWith(q);
      })
    : [];

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setInsuranceLicense(company?.tpa || '');
    setEligibilityStatus(null);
    setFormNumber(null);
    setRequestId(null);
  };

  const handleCheckEligibility = async () => {
    setLoadingEligibility(true);
    setEligibilityStatus(null);
    try {
      const res = await submitVisitApproval({
        insuranceLicense,
        clinicianId,
        patientNID: selectedPatient.nid,
        memberID: selectedPatient.memberID,
        visitType,
        benefitType,
      });
      const data = res?.data;

      if (data?.formNumber) {
        setFormNumber(data.formNumber);
        setEligibilityStatus('approved');
        enqueueSnackbar(t('Patient is eligible'), { variant: 'success' });
      } else if (data?.requestId) {
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
      if (data?.formNumber) {
        setFormNumber(data.formNumber);
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

  const handleCreateVisit = () => {
    navigate(paths.unitservice.accounting.claim.patientVisitView(selectedPatient._id));
    enqueueSnackbar(t('Visit created successfully'), { variant: 'success' });
  };

  const statusLabel = {
    approved: t('Eligible'),
    pending: t('Pending Approval'),
    rejected: t('Not Eligible'),
  };

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
                label={t('Search by name or email')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Paper>

            {filteredPatients.length > 0 && (
              <Paper sx={{ borderRadius: 3, mt: 2 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('Name')}</TableCell>
                        <TableCell>{t('Email')}</TableCell>
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
                          <TableCell>{patient.name}</TableCell>
                          <TableCell>{patient.email}</TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant={
                                selectedPatient?._id === patient._id ? 'contained' : 'outlined'
                              }
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

          {/* Step 2 & 3 — Eligibility Check + Create Visit */}
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
                  {selectedPatient.name}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('TPA License (e.g. WataniaINS, DeltaINS, MedNet)')}
                      value={insuranceLicense}
                      onChange={(e) => setInsuranceLicense(e.target.value)}
                      size="small"
                      helperText={t('Auto-filled from company TPA setting')}
                    />
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
                        <MenuItem key={o.value} value={o.value}>
                          {o.label}
                        </MenuItem>
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
                        <MenuItem key={o.value} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    onClick={handleCheckEligibility}
                    disabled={loadingEligibility || !insuranceLicense}
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

                  {(eligibilityStatus === 'approved' || eligibilityStatus === 'pending') && (
                    <Button variant="contained" color="success" onClick={handleCreateVisit}>
                      {t('Create Visit')}
                    </Button>
                  )}
                </Box>

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
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
