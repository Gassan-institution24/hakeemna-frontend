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
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

export default function ClaimsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [claims, setClaims] = useState([]);
  const [claimDetails, setClaimDetails] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);

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

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Claim Details</DialogTitle>

        <DialogContent>
          {claimDetails && (
            <Stack spacing={3}>
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
          <Button onClick={() => setOpen(false)}>Close</Button>

          <Button variant="contained" onClick={setDownloaded}>
            Set Downloaded
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
