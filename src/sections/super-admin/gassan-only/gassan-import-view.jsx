import useSWR from 'swr';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';

import axiosInstance, { fetcher } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------
// "Gassan only": imports one workbook into three tables at once — institution patients,
// economic movements (invoices) and payment control — for a chosen unit service and work group.
// The file is checked first (nothing written), then imported. See
// hakeemna-backend/controller/superAdmin/gassanImport.controller.js for the matching rules.

const OPTIONS_URL = '/api/gassan-import/options';

const nameOf = (o) => o?.name_english || o?.name_arabic || '';
const money = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 3 });

function Stat({ label, value, color }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <Typography variant="h5" sx={{ color: color || 'text.primary' }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </Box>
  );
}

Stat.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};

function Section({ title, icon, children }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <Iconify icon={icon} width={20} />
        <Typography variant="subtitle1">{title}</Typography>
      </Stack>
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        {children}
      </Stack>
    </Box>
  );
}

Section.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node,
};

export default function GassanImportView() {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

  const [unitService, setUnitService] = useState(null);
  const [workGroup, setWorkGroup] = useState(null);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: usOptions, isLoading: usLoading } = useSWR(OPTIONS_URL, fetcher);
  const { data: wgOptions, isLoading: wgLoading } = useSWR(
    unitService ? [OPTIONS_URL, { params: { unit_service: unitService._id } }] : null,
    fetcher
  );
  const unitServices = usOptions?.unit_services || [];
  const workGroups = wgOptions?.work_groups || [];

  const resetCheck = () => {
    setSummary(null);
    setResult(null);
  };

  const formData = () => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('unit_service', unitService._id);
    fd.append('work_group', workGroup._id);
    return fd;
  };

  const handleCheck = async () => {
    setBusy('check');
    setResult(null);
    try {
      const { data } = await axiosInstance.post('/api/gassan-import/preview', formData());
      setSummary(data.summary);
    } catch (err) {
      setSummary(null);
      enqueueSnackbar(err?.message || 'Could not read this file', { variant: 'error' });
    } finally {
      setBusy('');
    }
  };

  const handleImport = async () => {
    setConfirmOpen(false);
    setBusy('import');
    try {
      const { data } = await axiosInstance.post('/api/gassan-import', formData(), {
        timeout: 10 * 60 * 1000,
      });
      setResult(data.result);
      setSummary(null);
      enqueueSnackbar('Import finished', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err?.message || 'Import failed', { variant: 'error' });
    } finally {
      setBusy('');
    }
  };

  const ready = unitService && workGroup && file;
  const nothingToImport =
    summary &&
    !summary.patients.new &&
    !summary.invoices.new &&
    !summary.payments.new &&
    !summary.insurance_companies_to_create.length;

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Gassan only"
        links={[{ name: 'dashboard', href: paths.superadmin.root }, { name: 'Gassan only' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <CardHeader
          title="Import patients, invoices and payments"
          subheader="One Excel file → institution patients, economic movements and payment control"
        />
        <CardContent>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Autocomplete
                fullWidth
                loading={usLoading}
                options={unitServices}
                value={unitService}
                getOptionLabel={nameOf}
                isOptionEqualToValue={(a, b) => a._id === b._id}
                onChange={(_, v) => {
                  setUnitService(v);
                  setWorkGroup(null);
                  resetCheck();
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    <Stack>
                      <Typography variant="body2">{option.name_english}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {option.name_arabic}
                      </Typography>
                    </Stack>
                  </li>
                )}
                renderInput={(params) => <TextField {...params} label="1. Unit of service" />}
              />
              <Autocomplete
                fullWidth
                disabled={!unitService}
                loading={wgLoading}
                options={workGroups}
                value={workGroup}
                getOptionLabel={nameOf}
                isOptionEqualToValue={(a, b) => a._id === b._id}
                onChange={(_, v) => {
                  setWorkGroup(v);
                  resetCheck();
                }}
                noOptionsText="This unit of service has no work groups"
                renderInput={(params) => <TextField {...params} label="2. Work group" />}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xlsm,.xls"
                hidden
                onChange={(e) => {
                  const picked = e.target.files?.[0];
                  e.target.value = '';
                  if (picked) {
                    setFile(picked);
                    resetCheck();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<Iconify icon="solar:file-bold" />}
              >
                3. Choose Excel file
              </Button>
              <Typography variant="body2" sx={{ color: file ? 'text.primary' : 'text.disabled' }}>
                {file ? file.name : 'No file chosen'}
              </Typography>
            </Stack>

            <Box>
              <Button
                variant="contained"
                disabled={!ready || !!busy}
                onClick={handleCheck}
                startIcon={<Iconify icon="solar:magnifer-bold" />}
              >
                Check file
              </Button>
            </Box>

            {busy && <LinearProgress />}
          </Stack>
        </CardContent>
      </Card>

      {summary && (
        <Card sx={{ mt: 3 }}>
          <CardHeader
            title="What will be imported"
            subheader={`${summary.unit_service} · ${summary.work_group}`}
          />
          <CardContent>
            <Stack spacing={3} divider={<Divider flexItem />}>
              <Section title="Institution patients" icon="solar:users-group-rounded-bold">
                <Stat label="rows in file" value={summary.patients.rows_in_file} />
                <Stat label="new patients" value={summary.patients.new} color="success.main" />
                <Stat
                  label="already in this unit (reused)"
                  value={summary.patients.already_in_unit_service}
                />
                <Stat
                  label="duplicate rows merged"
                  value={summary.patients.duplicate_rows_merged}
                />
                <Stat label="with insurance" value={summary.patients.with_insurance} />
              </Section>

              <Section title="Economic movements (invoices)" icon="solar:bill-list-bold">
                <Stat label="rows in file" value={summary.invoices.rows_in_file} />
                <Stat label="new invoices" value={summary.invoices.new} color="success.main" />
                <Stat
                  label="already imported (skipped)"
                  value={summary.invoices.skipped_already_imported}
                />
                <Stat label="total amount" value={money(summary.invoices.total_amount)} />
              </Section>

              <Section title="Payment control" icon="solar:card-recive-bold">
                <Stat label="rows in file" value={summary.payments.rows_in_file} />
                <Stat label="new payments" value={summary.payments.new} color="success.main" />
                <Stat
                  label="already imported (skipped)"
                  value={summary.payments.skipped_already_imported}
                />
                <Stat label="total amount" value={money(summary.payments.total_amount)} />
              </Section>

              {!!summary.insurance_companies_to_create.length && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    New insurance companies that will be created (not found in the system)
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {summary.insurance_companies_to_create.map((n) => (
                      <Chip key={n} label={n} size="small" />
                    ))}
                  </Stack>
                </Box>
              )}

              {!!summary.warnings.length && (
                <Alert severity="warning">
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {summary.warnings.length} note(s)
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2, maxHeight: 220, overflow: 'auto' }}>
                    {summary.warnings.map((w, i) => (
                      <li key={i}>
                        <Typography variant="caption">{w}</Typography>
                      </li>
                    ))}
                  </Box>
                </Alert>
              )}

              <Stack direction="row" justifyContent="flex-end">
                {nothingToImport ? (
                  <Alert severity="info">Everything in this file is already imported.</Alert>
                ) : (
                  <Button
                    size="large"
                    color="success"
                    variant="contained"
                    disabled={!!busy}
                    onClick={() => setConfirmOpen(true)}
                    startIcon={<Iconify icon="solar:import-bold" />}
                  >
                    Import now
                  </Button>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {result && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="subtitle2">Import finished</Typography>
          <Typography variant="body2">
            {result.patients_created} patients created · {result.patients_reused} existing patients
            linked · {result.invoices_created} invoices · {result.payments_created} payments
            {result.insurance_companies_created
              ? ` · ${result.insurance_companies_created} insurance companies created`
              : ''}
          </Typography>
        </Alert>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Import into {nameOf(unitService)}?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {summary?.patients.new} new patients, {summary?.invoices.new} invoices and{' '}
            {summary?.payments.new} payments will be added to <b>{nameOf(unitService)}</b> /{' '}
            <b>{nameOf(workGroup)}</b>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleImport}>
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
