import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';

import axiosInstance from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

import RowsTable, { fmtMoney } from '../../gassan-only/rows-table';

// ----------------------------------------------------------------------
// "Template" + "Import Excel" for the medicines table. The file is checked on the server first
// (preview: what is new, what updates an existing medicine, notes), then imported.
// Matching rules: hakeemna-backend/controller/fixedData/medicinesImport.controller.js

export const MEDICINE_TEMPLATE_FIELDS = [
  'trade_name',
  'scientific_name',
  'concentration',
  'agent',
  'sequence',
  'manufacture',
  'manufacture_country',
  'ATCCODE',
  'packaging',
  'barcode',
  'Jordan_Sequence',
  'Specialty_Status',
  'Medical_Specialty_EN',
  'Medical_Specialty_AR',
  'Rational_Drug_Class',
  'Rational_Item_Code',
  'Rational_Generic_Name',
  'Rational_Dosage_Form',
  'Rational_Unit',
  'Package',
  'Category_1',
  'Category_2',
  'Category_3',
  'Category_4',
  'Concentration_source',
  'pakage_for_unit',
  'public_price_with_tax',
  'hospital_price_with_tax',
  'public_price',
  'hospital_price',
  'pharmacist_price',
  'country',
  'family',
  'side_effects',
  'status',
];

const ROW_COLUMNS = [
  { id: 'row', label: 'Excel row' },
  { id: 'action', label: 'Action' },
  { id: 'trade_name', label: 'Trade name' },
  { id: 'scientific_name', label: 'Scientific name' },
  { id: 'concentration', label: 'Concentration' },
  { id: 'packaging', label: 'Packaging' },
  { id: 'Jordan_Sequence', label: 'Jordan sequence' },
  { id: 'barcode', label: 'Barcode' },
  { id: 'public_price', label: 'Public price', align: 'right', format: fmtMoney },
  { id: 'Medical_Specialty_EN', label: 'Specialty' },
];

function downloadTemplate() {
  const sheet = XLSX.utils.aoa_to_sheet([MEDICINE_TEMPLATE_FIELDS]);
  sheet['!cols'] = MEDICINE_TEMPLATE_FIELDS.map((f) => ({ wch: Math.max(14, f.length + 2) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'medicines');
  XLSX.writeFile(workbook, 'medicines-template.xlsx');
}

export default function MedicinesImport({ onImported }) {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // { summary, rows }
  const [busy, setBusy] = useState(false);

  const send = (url, picked) => {
    const fd = new FormData();
    fd.append('file', picked);
    return axiosInstance.post(url, fd, { timeout: 10 * 60 * 1000 });
  };

  const handlePick = async (event) => {
    const picked = event.target.files?.[0];
    event.target.value = ''; // lets the same file be picked again
    if (!picked) return;
    setFile(picked);
    setBusy(true);
    try {
      const { data } = await send('/api/medicines/import/preview', picked);
      setPreview(data);
    } catch (err) {
      enqueueSnackbar(err?.message || 'Could not read this Excel file', { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleImport = async () => {
    setBusy(true);
    try {
      const { data } = await send('/api/medicines/import', file);
      enqueueSnackbar(
        `Imported: ${data.result.created} new medicines, ${data.result.updated} updated`,
        { variant: 'success' }
      );
      setPreview(null);
      onImported?.();
    } catch (err) {
      enqueueSnackbar(err?.message || 'Import failed', { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const s = preview?.summary;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xlsm,.xls,.csv"
        hidden
        onChange={handlePick}
      />
      <Button
        variant="text"
        onClick={downloadTemplate}
        startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
      >
        Template
      </Button>
      <Button
        variant="outlined"
        disabled={busy}
        onClick={() => fileInputRef.current?.click()}
        startIcon={<Iconify icon="solar:import-bold" />}
      >
        {busy && !preview ? 'Reading…' : 'Import Excel'}
      </Button>

      <Dialog open={!!preview} onClose={() => !busy && setPreview(null)} fullWidth maxWidth="lg">
        <DialogTitle>Import medicines — {file?.name}</DialogTitle>
        {s && (
          <DialogContent dividers>
            <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {[
                ['rows in file', s.rows_in_file],
                ['new medicines', s.new, 'success.main'],
                ['update existing', s.update, 'info.main'],
                ['repeated in file (merged)', s.repeated_in_file],
                ['skipped (no name)', s.skipped_no_name],
              ].map(([label, value, color]) => (
                <Box key={label}>
                  <Typography variant="h5" sx={{ color: color || 'text.primary' }}>
                    {value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Columns recognised
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {s.columns_recognised.map((c) => (
                <Chip key={c} label={c} size="small" />
              ))}
            </Stack>

            {!!s.notes.length && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Box component="ul" sx={{ m: 0, pl: 2, maxHeight: 160, overflow: 'auto' }}>
                  {s.notes.map((n, i) => (
                    <li key={i}>
                      <Typography variant="caption">{n}</Typography>
                    </li>
                  ))}
                </Box>
              </Alert>
            )}

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              A row that matches a medicine already in the table (same Jordan sequence, barcode, or
              trade name + concentration + packaging) updates it instead of adding a duplicate.
            </Typography>

            <RowsTable rows={preview.rows} columns={ROW_COLUMNS} />
          </DialogContent>
        )}
        {busy && <LinearProgress />}
        <DialogActions>
          <Button disabled={busy} onClick={() => setPreview(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={busy || !s || (!s.new && !s.update)}
            onClick={handleImport}
          >
            Import {s ? s.new + s.update : ''} medicines
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

MedicinesImport.propTypes = {
  onImported: PropTypes.func,
};
