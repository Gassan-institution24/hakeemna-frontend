/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { submitVisitApproval, checkVisitApproval } from '../../services/visitApprovalService';

/**
 * VisitApprovalForm Component
 *
 * Collects patient and visit information to submit a prior authorization request.
 * Handles three insurance strategies:
 * - DELTA: Form number generated locally, returns immediately
 * - WATANIA/ZERO: Async response, polls for form number every 3 seconds
 */
export default function VisitApprovalForm({
  patientData,
  clinicianId,
  insuranceLicense,
  onSuccess,
  onCancel,
}) {
  const theme = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    insuranceLicense: insuranceLicense || '',
    clinicianId: clinicianId || '',
    patientNID: patientData?.nid || '',
    memberID: patientData?.memberID || '',
    visitType: 'gp',
    benefitType: 'outpatient',
    idPayer: patientData?.idPayer || '',
  });

  // Response state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formNumber, setFormNumber] = useState(null);
  const [pollingState, setPollingState] = useState(null); // { requestId, entityId, strategy }
  const [pollAttempt, setPollAttempt] = useState(0);

  // Result dialog
  const [openResultDialog, setOpenResultDialog] = useState(false);

  /* ==================== POLLING LOGIC ==================== */
  useEffect(() => {
    if (!pollingState) return;

    const pollTimer = setInterval(async () => {
      try {
        const res = await checkVisitApproval(pollingState.requestId);

        if (!res.data.pending) {
          // Got the result!
          clearInterval(pollTimer);
          if (res.data.success && res.data.formNumber) {
            setFormNumber(res.data.formNumber);
            setSuccess(true);
            setOpenResultDialog(true);
          } else {
            setError(res.data.error || 'Approval was denied');
            setPollingState(null);
          }
        } else {
          // Still pending
          setPollAttempt((prev) => prev + 1);
          if (pollAttempt >= 10) {
            // Max polls reached (30 seconds)
            clearInterval(pollTimer);
            setError('Timeout: Could not retrieve authorization response after 30 seconds');
            setPollingState(null);
          }
        }
      } catch (err) {
        clearInterval(pollTimer);
        setError(`Polling error: ${err.message}`);
        setPollingState(null);
      }
    }, 3000); // Poll every 3 seconds

    // eslint-disable-next-line consistent-return
    return () => clearInterval(pollTimer);
  }, [pollingState, pollAttempt]);

  /* ==================== FORM SUBMISSION ==================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setPollAttempt(0);

    try {
      const payload = {
        insuranceLicense: formData.insuranceLicense,
        clinicianId: formData.clinicianId,
        patientNID: formData.patientNID,
        memberID: formData.memberID,
        visitType: formData.visitType,
        benefitType: formData.benefitType,
      };

      // Add idPayer if provided (required for WATANIA)
      if (formData.idPayer) {
        payload.idPayer = formData.idPayer;
      }

      const response = await submitVisitApproval(payload);
      const { data } = response;

      if (!data.success) {
        setError(data.error || 'Failed to submit authorization');
        setLoading(false);
        return;
      }

      // Success!
      if (data.pending === false) {
        // DELTA strategy: form number is immediately available
        setFormNumber(data.formNumber);
        setSuccess(true);
        setOpenResultDialog(true);
        setLoading(false);
      } else {
        // WATANIA/ZERO strategy: need to poll for response
        setPollingState({
          requestId: data.requestId,
          entityId: data.entityId,
          strategy: data.strategy,
        });
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error submitting authorization');
      setLoading(false);
    }
  };

  /* ==================== FORM CHANGE ==================== */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ==================== RENDER ==================== */
  if (pollingState) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <CircularProgress />
            <Typography variant="h6" align="center">
              Waiting for authorization response...
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Attempt: {pollAttempt + 1} / 10 (Poll every 3 seconds)
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Strategy: {pollingState.strategy}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setPollingState(null);
                setPollAttempt(0);
              }}
            >
              Cancel
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Create Visit Authorization
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Insurance License */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Insurance License</InputLabel>
                  <Select
                    name="insuranceLicense"
                    value={formData.insuranceLicense}
                    onChange={handleInputChange}
                    label="Insurance License"
                  >
                    {/* WATANIA */}
                    <MenuItem value="WataniaINS">Watania Insurance</MenuItem>
                    <MenuItem value="Medservice">Medservice</MenuItem>
                    <MenuItem value="Omnicare">Omnicare</MenuItem>
                    <MenuItem value="MedExa">MedExa</MenuItem>

                    {/* DELTA */}
                    <MenuItem value="DeltaINS">Delta Insurance</MenuItem>
                    <MenuItem value="Newton">Newton</MenuItem>
                    <MenuItem value="GlobMed">GlobMed</MenuItem>
                    <MenuItem value="EuroArab">EuroArab</MenuItem>
                    <MenuItem value="Assurers">Assurers</MenuItem>

                    {/* ZERO */}
                    <MenuItem value="MedNet">MedNet</MenuItem>
                    <MenuItem value="Solidarity">Solidarity</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Clinician ID */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Clinician ID (Provider License)"
                  name="clinicianId"
                  value={formData.clinicianId}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Patient NID */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Patient National ID"
                  name="patientNID"
                  value={formData.patientNID}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Member ID */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Member ID (Insurance)"
                  name="memberID"
                  value={formData.memberID}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Visit Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Visit Type</InputLabel>
                  <Select
                    name="visitType"
                    value={formData.visitType}
                    onChange={handleInputChange}
                    label="Visit Type"
                  >
                    <MenuItem value="gp">GP (General Practitioner)</MenuItem>
                    <MenuItem value="specialist">Specialist</MenuItem>
                    <MenuItem value="consultant">Consultant</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Benefit Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Benefit Type</InputLabel>
                  <Select
                    name="benefitType"
                    value={formData.benefitType}
                    onChange={handleInputChange}
                    label="Benefit Type"
                  >
                    <MenuItem value="outpatient">Outpatient</MenuItem>
                    <MenuItem value="maternity">Maternity</MenuItem>
                    <MenuItem value="dental">Dental</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* ID Payer (optional, from eligibility) */}
              {formData.idPayer && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ID Payer (from eligibility)"
                    name="idPayer"
                    value={formData.idPayer}
                    onChange={handleInputChange}
                    disabled
                    helperText="Auto-populated from eligibility response"
                  />
                </Grid>
              )}

              {/* Action Buttons */}
              <Grid item xs={12} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    onCancel?.();
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Submitting...
                    </>
                  ) : (
                    'Submit Authorization'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog
        open={openResultDialog}
        onClose={() => setOpenResultDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Authorization Successful</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Alert severity="success">Authorization has been approved!</Alert>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Form Number:
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  p: 2,
                  bgcolor: theme.palette.action.hover,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                }}
              >
                {formNumber}
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              Please note this form number for your records.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setOpenResultDialog(false);
              onSuccess?.(formNumber);
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
