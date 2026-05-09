import { useState, useEffect } from 'react';
import axiosInstance from 'src/utils/axios';

import {
  Stack,
  Button,
  Container,
  Typography,
  Chip,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import VisitApprovalForm from 'src/components/visit-approval/VisitApprovalForm';

export default function ClaimsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [claims, setClaims] = useState([]);
  const [claimDetails, setClaimDetails] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);

  // ✅ VISIT APPROVAL FLOW STATES
  const [showVisitApprovalForm, setShowVisitApprovalForm] = useState(false);
  const [eligibilityStatus, setEligibilityStatus] = useState(null); // { eligible, idPayer, memberID, nid }
  const [authorizationResult, setAuthorizationResult] = useState(null); // { formNumber }
  const [eligibilityChecking, setEligibilityChecking] = useState(false);

  /* ================= GET CLAIMS ================= */

  const getClaims = async () => {
    try {
      const res = await axiosInstance.get('api/claims/new');

      const data = res.data?.data?.Entities || [];

      setClaims(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= VIEW CLAIM ================= */

  const viewClaim = async (id) => {
    try {
      const res = await axiosInstance.get('api/claims/view', {
        params: { id },
      });

      console.log('View Claim Response:', res.data);

      setClaimDetails(res.data?.data?.Entity || res.data?.Entity);

      setSelectedId(id);
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SET DOWNLOADED ================= */

  const setDownloaded = async () => {
    try {
      await axiosInstance.post('api/claims/setDownloaded', null, {
        params: { id: selectedId },
      });

      setOpen(false);

      getClaims();
    } catch (err) {
      console.error(err);
    }
  };

  /* ✅ ================= ELIGIBILITY CHECK ================= */
  const checkEligibility = async () => {
    setEligibilityChecking(true);
    try {
      // Call your existing eligibility endpoint
      // This should return { eligible, idPayer, memberID, nid, error? }
      const res = await axiosInstance.post('api/eligibility/check', {
        // Pass patient and insurance data from claimDetails
      });

      const data = res.data;
      if (data.eligible) {
        setEligibilityStatus({
          eligible: true,
          idPayer: data.idPayer,
          memberID: data.memberID,
          nid: data.nid,
        });
      } else {
        setEligibilityStatus({
          eligible: false,
          error: data.error || 'Patient is not eligible',
        });
      }
    } catch (err) {
      console.error('Eligibility check error:', err);
      setEligibilityStatus({
        eligible: false,
        error: err.response?.data?.error || err.message,
      });
    } finally {
      setEligibilityChecking(false);
    }
  };

  const handleVisitApprovalSuccess = (formNumber) => {
    setAuthorizationResult({ formNumber });
    setShowVisitApprovalForm(false);
  };

  useEffect(() => {
    getClaims();
  }, []);

  const renderDownloadedChip = (status) =>
    status ? (
      <Chip label="Downloaded" color="success" size="small" />
    ) : (
      <Chip label="Not Downloaded" color="warning" size="small" />
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Financial Claims
      </Typography>

      {/* ================= DESKTOP TABLE ================= */}

      {!isMobile && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Sender</TableCell>
                <TableCell>Receiver</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Downloaded</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.ID}>
                  <TableCell>{claim.ID}</TableCell>

                  <TableCell>{claim.SenderID}</TableCell>

                  <TableCell>{claim.ReceiverID}</TableCell>

                  <TableCell>{claim.TransactionDate}</TableCell>

                  <TableCell>{renderDownloadedChip(claim.Downloaded)}</TableCell>

                  <TableCell align="right">
                    <Button variant="contained" size="small" onClick={() => viewClaim(claim.ID)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ================= MOBILE CARDS ================= */}

      {isMobile && (
        <Grid container spacing={2}>
          {claims.map((claim) => (
            <Grid item xs={12} key={claim.ID}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography fontWeight="bold">{claim.ID}</Typography>

                    <Typography variant="body2">Sender: {claim.SenderID}</Typography>

                    <Typography variant="body2">Receiver: {claim.ReceiverID}</Typography>

                    <Typography variant="body2">{claim.TransactionDate}</Typography>

                    {renderDownloadedChip(claim.Downloaded)}

                    <Button variant="contained" size="small" onClick={() => viewClaim(claim.ID)}>
                      View
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ================= DIALOG ================= */}

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setShowVisitApprovalForm(false);
          setEligibilityStatus(null);
          setAuthorizationResult(null);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Claim Details</DialogTitle>

        <DialogContent>
          {claimDetails && (
            <Stack spacing={3}>
              {/* ✅ VISIT APPROVAL SECTION */}
              {!showVisitApprovalForm && !authorizationResult && (
                <Card sx={{ bgcolor: theme.palette.info.lighter }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.info.dark }}>
                      Prior Authorization / Visit Approval
                    </Typography>

                    {eligibilityStatus ? (
                      <>
                        {eligibilityStatus.eligible ? (
                          <Stack spacing={2}>
                            <Alert severity="success">✓ Patient is eligible for benefits</Alert>
                            <Typography variant="body2" color="textSecondary">
                              Member ID: {eligibilityStatus.memberID}
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => setShowVisitApprovalForm(true)}
                            >
                              Create Visit Authorization
                            </Button>
                          </Stack>
                        ) : (
                          <Alert severity="error">
                            ✗ {eligibilityStatus.error || 'Patient is not eligible'}
                          </Alert>
                        )}
                      </>
                    ) : (
                      <Stack spacing={2}>
                        <Typography variant="body2">
                          First, check if the patient is eligible for benefits.
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={checkEligibility}
                          disabled={eligibilityChecking}
                        >
                          {eligibilityChecking ? (
                            <>
                              <CircularProgress size={16} sx={{ mr: 1 }} />
                              Checking...
                            </>
                          ) : (
                            'Check Eligibility'
                          )}
                        </Button>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* ✅ SHOW VISIT APPROVAL FORM */}
              {showVisitApprovalForm && eligibilityStatus?.eligible && (
                <VisitApprovalForm
                  patientData={{
                    nid: eligibilityStatus.nid,
                    memberID: eligibilityStatus.memberID,
                    idPayer: eligibilityStatus.idPayer,
                  }}
                  clinicianId={claimDetails.Header?.SenderID}
                  insuranceLicense={claimDetails.Header?.ReceiverID}
                  onSuccess={handleVisitApprovalSuccess}
                  onCancel={() => setShowVisitApprovalForm(false)}
                />
              )}

              {/* ✅ SHOW AUTHORIZATION RESULT */}
              {authorizationResult && (
                <Card sx={{ bgcolor: theme.palette.success.lighter }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Alert severity="success">✓ Authorization Approved!</Alert>
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Form Number:
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            p: 2,
                            bgcolor: theme.palette.background.paper,
                            borderRadius: 1,
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          {authorizationResult.formNumber}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setAuthorizationResult(null);
                          setEligibilityStatus(null);
                          setShowVisitApprovalForm(false);
                        }}
                      >
                        Reset
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* HEADER */}

              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Header
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography>Sender: {claimDetails.Header?.SenderID}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography>Receiver: {claimDetails.Header?.ReceiverID}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography>Date: {claimDetails.Header?.TransactionDate}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography>Payer: {claimDetails.Header?.PayerID}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* CLAIM */}

              {claimDetails.Claim?.map((claim, i) => (
                <Paper key={i} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Claim
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography>Member ID: {claim.MemberID}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography>Provider: {claim.ProviderID}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography>Gross: {claim.Gross}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography>Net: {claim.Net}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setShowVisitApprovalForm(false);
              setEligibilityStatus(null);
              setAuthorizationResult(null);
            }}
          >
            Close
          </Button>

          {!showVisitApprovalForm && !authorizationResult && (
            <Button variant="contained" onClick={setDownloaded}>
              Set Downloaded
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
