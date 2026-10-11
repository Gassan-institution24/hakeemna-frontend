import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Chip,
  Stack,
  Alert,
  Table,
  Button,
  Dialog,
  Switch,
  Tooltip,
  MenuItem,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
  InputAdornment,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import {
  useGetSpecialties,
  createSpecialityService,
  deleteSpecialityService,
  updateSpecialityService,
  importSpecialityServices,
  useGetSpecialityServices,
} from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { extractRows, analyzeSheet, classifyRows } from './parse-services-sheet';

// ----------------------------------------------------------------------

// Superadmin: the services catalogue of one speciality (code + service name), typed in or
// imported from Excel. The speciality is chosen here — any speciality column in the sheet is
// ignored.
export default function SpecialityServicesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const { specialtiesData } = useGetSpecialties({ select: 'name_english name_arabic' });
  const specialityId = searchParams.get('speciality') || '';
  const speciality = specialtiesData.find((one) => one._id === specialityId) || null;

  const { services, loading, refetch } = useGetSpecialityServices(specialityId || null);

  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // {} for new, a service to edit
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const setSpeciality = (id) =>
    router.replace(
      id
        ? `${paths.superadmin.tables.details('speciality_services')}?speciality=${id}`
        : paths.superadmin.tables.details('speciality_services')
    );

  const existingCodes = useMemo(() => new Set(services.map((one) => one.code)), [services]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return services;
    return services.filter((one) =>
      [one.code, one.name_english, one.name_arabic].some((v) => v?.toLowerCase().includes(q))
    );
  }, [services, search]);

  const toggleActive = async (service) => {
    try {
      await updateSpecialityService(service._id, { active: !service.active });
      refetch();
    } catch (error) {
      enqueueSnackbar(error?.message || 'Something went wrong', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSpecialityService(deleting._id);
      enqueueSnackbar(`${deleting.code} deleted`);
      refetch();
    } catch (error) {
      enqueueSnackbar(error?.message || 'Something went wrong', { variant: 'error' });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Speciality services"
        links={[
          { name: 'dashboard', href: paths.superadmin.root },
          { name: 'Tables', href: paths.superadmin.tables.list },
          { name: 'Speciality services' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 2.5, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <Autocomplete
            sx={{ flex: 1, maxWidth: { md: 420 } }}
            options={specialtiesData}
            value={speciality}
            onChange={(e, value) => setSpeciality(value?._id)}
            getOptionLabel={(option) =>
              [option.name_english, option.name_arabic].filter(Boolean).join(' — ')
            }
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => <TextField {...params} label="Speciality" />}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="outlined"
            disabled={!speciality}
            startIcon={<Iconify icon="vscode-icons:file-type-excel" />}
            onClick={() => setImporting(true)}
          >
            Import from Excel
          </Button>
          <Button
            variant="contained"
            disabled={!speciality}
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setEditing({})}
          >
            Add service
          </Button>
        </Stack>
      </Card>

      {!speciality && (
        <Alert severity="info">Choose a speciality to see and add its services.</Alert>
      )}

      {speciality && (
        <Card>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2.5 }}>
            <TextField
              size="small"
              placeholder="Search code or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: { xs: 1, sm: 320 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {services.length} services
            </Typography>
          </Stack>

          <TableContainer>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 720 }}>
                <TableHead>
                  <TableRow>
                    <TableCell width={120}>Code</TableCell>
                    <TableCell>Service (English)</TableCell>
                    <TableCell>Service (Arabic)</TableCell>
                    <TableCell width={90} align="center">
                      Active
                    </TableCell>
                    <TableCell width={100} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((service) => (
                    <TableRow key={service._id} hover sx={{ opacity: service.active ? 1 : 0.5 }}>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {service.code}
                      </TableCell>
                      <TableCell>{service.name_english}</TableCell>
                      <TableCell dir="rtl">{service.name_arabic}</TableCell>
                      <TableCell align="center">
                        <Switch
                          size="small"
                          checked={!!service.active}
                          onChange={() => toggleActive(service)}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => setEditing(service)}>
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleting(service)}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}

                  {!loading && !filtered.length && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}
                      >
                        {services.length
                          ? 'No service matches your search.'
                          : 'No services yet — add one or import your Excel sheet.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      )}

      {editing && speciality && (
        <ServiceDialog
          service={editing}
          speciality={speciality}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refetch();
          }}
        />
      )}

      {importing && speciality && (
        <ImportDialog
          speciality={speciality}
          existingCodes={existingCodes}
          onClose={() => setImporting(false)}
          onImported={() => {
            setImporting(false);
            refetch();
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete service"
        content={
          deleting
            ? `Delete ${deleting.code} — ${deleting.name_english || deleting.name_arabic}?`
            : ''
        }
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

function ServiceDialog({ service, speciality, onClose, onSaved }) {
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!service._id;
  const [values, setValues] = useState({
    code: service.code || '',
    name_english: service.name_english || '',
    name_arabic: service.name_arabic || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!values.code.trim()) {
      enqueueSnackbar('Code is required', { variant: 'error' });
      return;
    }
    if (!values.name_english.trim() && !values.name_arabic.trim()) {
      enqueueSnackbar('Service name is required', { variant: 'error' });
      return;
    }
    try {
      setSaving(true);
      if (isEdit) await updateSpecialityService(service._id, values);
      else await createSpecialityService({ ...values, speciality: speciality._id });
      enqueueSnackbar(isEdit ? 'Service updated' : 'Service added');
      onSaved();
    } catch (error) {
      enqueueSnackbar(error?.message || 'Something went wrong', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle>
        {isEdit ? 'Edit service' : 'Add service'} — {speciality.name_english}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Code"
            placeholder="D001"
            value={values.code}
            onChange={(e) => setValues((v) => ({ ...v, code: e.target.value.toUpperCase() }))}
            sx={{ maxWidth: 200 }}
            autoFocus
          />
          <TextField
            label="Service (English)"
            value={values.name_english}
            onChange={(e) => setValues((v) => ({ ...v, name_english: e.target.value }))}
          />
          <TextField
            label="Service (Arabic)"
            value={values.name_arabic}
            onChange={(e) => setValues((v) => ({ ...v, name_arabic: e.target.value }))}
            inputProps={{ dir: 'rtl' }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton variant="contained" loading={saving} onClick={handleSave}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

ServiceDialog.propTypes = {
  service: PropTypes.object,
  speciality: PropTypes.object,
  onClose: PropTypes.func,
  onSaved: PropTypes.func,
};

// ----------------------------------------------------------------------

const STATUS = {
  new: { label: 'New', color: 'success' },
  update: { label: 'Update', color: 'info' },
  duplicate: { label: 'Repeated — skipped', color: 'warning' },
  invalid: { label: 'Skipped', color: 'error' },
};

function ImportDialog({ speciality, existingCodes, onClose, onImported }) {
  const { enqueueSnackbar } = useSnackbar();

  const [fileName, setFileName] = useState('');
  const [aoa, setAoa] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [readError, setReadError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setReadError('');
    try {
      const workbook = XLSX.read(await file.arrayBuffer());
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
      const result = analyzeSheet(rows);
      setFileName(file.name);
      setAoa(rows);
      setAnalysis(result);
      setMapping(result.mapping);
    } catch (error) {
      setReadError('Could not read this file. Use an .xlsx, .xls or .csv file.');
    }
  };

  const rows = useMemo(() => {
    if (!aoa || !mapping) return [];
    return classifyRows(extractRows(aoa, analysis.headerIndex, mapping), existingCodes);
  }, [aoa, analysis, mapping, existingCodes]);

  const counts = useMemo(
    () =>
      rows.reduce((acc, row) => {
        acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
      }, {}),
    [rows]
  );

  const toImport = rows.filter((row) => row.status === 'new' || row.status === 'update');

  const handleImport = async () => {
    try {
      setSaving(true);
      const result = await importSpecialityServices(
        speciality._id,
        toImport.map(({ code, name_english, name_arabic }) => ({ code, name_english, name_arabic }))
      );
      enqueueSnackbar(`Imported: ${result.created} new, ${result.updated} updated`);
      onImported();
    } catch (error) {
      enqueueSnackbar(error?.message || 'Import failed', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const columnSelect = (key, label, optional) => (
    <TextField
      select
      size="small"
      label={label}
      value={mapping?.[key] ?? -1}
      onChange={(e) => setMapping((m) => ({ ...m, [key]: Number(e.target.value) }))}
      sx={{ minWidth: 200 }}
    >
      {optional && <MenuItem value={-1}>— none —</MenuItem>}
      {analysis.columns.map((col) => (
        <MenuItem key={col.index} value={col.index}>
          {col.label}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Dialog open fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Import services — {speciality.name_english}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Box>
            <Button
              component="label"
              variant="outlined"
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            >
              {fileName ? 'Choose another file' : 'Choose Excel file'}
              <input
                hidden
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  handleFile(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </Button>
            {fileName && (
              <Typography component="span" variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                {fileName}
              </Typography>
            )}
          </Box>

          {readError && <Alert severity="error">{readError}</Alert>}

          {analysis && mapping && (
            <>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {columnSelect('code', 'Code column')}
                {columnSelect('service', 'Service column')}
                {columnSelect('arabic', 'Arabic name column', true)}
              </Stack>

              <Alert severity="info">
                Every service will be saved under <b>{speciality.name_english}</b>.
                {analysis.ignored && (
                  <>
                    {' '}
                    The column <b>{analysis.ignored}</b> is ignored.
                  </>
                )}{' '}
                Codes that already exist are updated, not duplicated.
              </Alert>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {Object.entries(STATUS).map(([key, s]) =>
                  counts[key] ? (
                    <Chip
                      key={key}
                      size="small"
                      variant="soft"
                      color={s.color}
                      label={`${s.label}: ${counts[key]}`}
                    />
                  ) : null
                )}
              </Stack>

              <TableContainer sx={{ maxHeight: 360 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell width={60}>Row</TableCell>
                      <TableCell width={110}>Code</TableCell>
                      <TableCell>Service</TableCell>
                      {mapping.arabic >= 0 && <TableCell>Arabic</TableCell>}
                      <TableCell width={170}>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.rowNumber}>
                        <TableCell sx={{ color: 'text.disabled' }}>{row.rowNumber}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{row.code || '—'}</TableCell>
                        <TableCell>{row.name_english || '—'}</TableCell>
                        {mapping.arabic >= 0 && <TableCell dir="rtl">{row.name_arabic}</TableCell>}
                        <TableCell>
                          <Chip
                            size="small"
                            variant="soft"
                            color={STATUS[row.status].color}
                            label={row.reason || STATUS[row.status].label}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          loading={saving}
          disabled={!toImport.length}
          onClick={handleImport}
        >
          Import {toImport.length || ''} services
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

ImportDialog.propTypes = {
  speciality: PropTypes.object,
  existingCodes: PropTypes.object,
  onClose: PropTypes.func,
  onImported: PropTypes.func,
};
