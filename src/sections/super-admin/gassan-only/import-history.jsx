import { useState } from 'react';
import useSWR, { mutate } from 'swr';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';

import axiosInstance, { fetcher } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------
// Every import made from this page, newest first, each with an Undo button. Undo deletes only
// the records that import created and takes back only what it added to existing patients;
// anything used since the import (e.g. a patient who got a new appointment) is kept.

export const BATCHES_URL = '/api/gassan-import/batches';
export const refreshImportHistory = () => mutate(BATCHES_URL);

const STATUS_COLOR = { done: 'success', undone: 'default', failed: 'error', running: 'info' };
const nameOf = (o) => o?.name_english || o?.name_arabic || '';
const when = (v) => (v ? new Date(v).toLocaleString() : '');

export default function ImportHistory() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useSWR(BATCHES_URL, fetcher);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const batches = Array.isArray(data) ? data : [];

  const handleUndo = async () => {
    const batch = target;
    setTarget(null);
    setBusy(true);
    try {
      const { data: res } = await axiosInstance.post(`${BATCHES_URL}/${batch._id}/undo`);
      setLastResult(res.result);
      enqueueSnackbar('Import undone', { variant: 'success' });
      refreshImportHistory();
    } catch (err) {
      enqueueSnackbar(err?.message || 'Undo failed', { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const kept = lastResult?.kept_in_use;
  const keptTotal = kept ? Object.values(kept).reduce((a, b) => a + b, 0) : 0;

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader
        title="Import history"
        subheader="Undo removes only what that import added — nothing else in the unit of service"
      />

      {lastResult && (
        <Alert severity="success" sx={{ mx: 3, mt: 2 }} onClose={() => setLastResult(null)}>
          Deleted {lastResult.patients_deleted} patients, {lastResult.invoices_deleted} invoices,{' '}
          {lastResult.payments_deleted} payments and {lastResult.insurance_companies_deleted}{' '}
          insurance companies; {lastResult.patients_restored} existing patients put back as they
          were.
          {keptTotal > 0 &&
            ` Kept because they were used after the import: ${kept.patients} patients, ${kept.invoices} invoices, ${kept.payments} payments, ${kept.insurance_companies} insurance companies.`}
        </Alert>
      )}

      <TableContainer sx={{ p: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Unit of service / work group</TableCell>
              <TableCell align="right">Patients</TableCell>
              <TableCell align="right">Invoices</TableCell>
              <TableCell align="right">Payments</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.map((b) => (
              <TableRow key={b._id} hover>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {when(b.created_at)}
                  <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                    {b.user_creation?.email}
                  </Typography>
                </TableCell>
                <TableCell>{b.file_name}</TableCell>
                <TableCell>
                  {nameOf(b.unit_service)}
                  <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                    {nameOf(b.work_group)}
                  </Typography>
                </TableCell>
                <TableCell align="right">{b.counts?.patients_created ?? '-'}</TableCell>
                <TableCell align="right">{b.counts?.invoices_created ?? '-'}</TableCell>
                <TableCell align="right">{b.counts?.payments_created ?? '-'}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    variant="soft"
                    color={STATUS_COLOR[b.status] || 'default'}
                    label={b.status === 'undone' ? `undone ${when(b.undone_at)}` : b.status}
                  />
                </TableCell>
                <TableCell align="right">
                  {b.status !== 'undone' && (
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      disabled={busy}
                      onClick={() => setTarget(b)}
                      startIcon={<Iconify icon="solar:undo-left-round-bold" />}
                    >
                      Undo
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && !batches.length && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
                    No imports yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!target} onClose={() => setTarget(null)}>
        <DialogTitle>Undo this import?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            This deletes the {target?.counts?.patients_created ?? ''} patients,{' '}
            {target?.counts?.invoices_created ?? ''} invoices and{' '}
            {target?.counts?.payments_created ?? ''} payments this import added to{' '}
            <b>{nameOf(target?.unit_service)}</b>, and removes the work group / insurance it added
            to existing patients.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Nothing else is touched. Records that were used after the import are kept.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleUndo}>
            Undo import
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
