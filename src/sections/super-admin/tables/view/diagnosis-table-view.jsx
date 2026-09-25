import * as XLSX from 'xlsx';
import { useSnackbar } from 'notistack';
import { useRef, useState, useCallback } from 'react';

import {
  Box,
  Tab,
  Card,
  Chip,
  Tabs,
  Stack,
  Table,
  Button,
  Dialog,
  TableRow,
  MenuItem,
  TextField,
  TableCell,
  Container,
  TableBody,
  Typography,
  IconButton,
  useMediaQuery,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import axiosInstance from 'src/utils/axios';
import { fDate } from 'src/utils/format-time';

import { useGetdiagnosis } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import MobileRow from '../../mobile-row';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'icd_code', label: 'ICD Code' },
  { id: 'category', label: 'Category' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'created_at', label: 'Date' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
};

// Dentists are offered `dental` diagnoses (tooth dialog, dental encounters);
// every other specialty is offered `general` ones.
const CATEGORIES = [
  { value: 'dental', label: 'Dental', color: 'info' },
  { value: 'general', label: 'General', color: 'default' },
];
const categoryOf = (row) => (row?.category === 'dental' ? 'dental' : 'general');
const categoryLabel = (value) => CATEGORIES.find((c) => c.value === value)?.label || 'General';

// ── Excel import ────────────────────────────────────────────────────────────
// A header row is recognised by its labels; without one the sheet is read as
// A = ICD code, B = name, C = description. Each key tries its patterns in order,
// so an "ICD Code" column wins over the table's own running "Code" number.
const HEADER_MATCHERS = {
  icd_code: [/icd/i, /code|رمز|كود/i],
  name: [/^name$|الاسم|^اسم/i, /name|diagnos|title|تشخيص/i],
  description: [/desc|note|الوصف|وصف/i],
};

function findColumns(rows) {
  for (let r = 0; r < Math.min(rows.length, 10); r += 1) {
    const cells = rows[r].map((c) => String(c ?? '').trim());
    if (cells.filter(Boolean).length >= 2) {
      const cols = {};
      // Description first, so "Description" is not taken as the name column.
      ['description', 'icd_code', 'name'].forEach((key) => {
        HEADER_MATCHERS[key].some((pattern) => {
          const idx = cells.findIndex(
            (cell, i) => cell && pattern.test(cell) && !Object.values(cols).includes(i)
          );
          if (idx !== -1) cols[key] = idx;
          return idx !== -1;
        });
      });
      if (cols.name !== undefined && cols.icd_code !== undefined) return { cols, headerRow: r };
    }
  }
  return { cols: { icd_code: 0, name: 1, description: 2 }, headerRow: -1 };
}

export function parseDiagnosisSheet(workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const { cols, headerRow } = findColumns(rows);
  const cell = (row, key) => (cols[key] === undefined ? '' : String(row[cols[key]] ?? '').trim());

  const parsed = rows
    .slice(headerRow + 1)
    .map((row) => ({
      icd_code: cell(row, 'icd_code').toUpperCase(),
      name: cell(row, 'name'),
      description: cell(row, 'description') === '0' ? '' : cell(row, 'description'),
    }))
    .filter((row) => row.name);

  // When most rows carry a code, a row without one is a title line, not a diagnosis.
  const withCode = parsed.filter((row) => row.icd_code);
  const kept = withCode.length >= parsed.length / 2 ? withCode : parsed;

  // Repeated codes inside the file are imported once.
  const seen = new Set();
  const unique = kept.filter((row) => {
    if (!row.icd_code) return true;
    if (seen.has(row.icd_code)) return false;
    seen.add(row.icd_code);
    return true;
  });

  return {
    rows: unique,
    repeated: kept.length - unique.length,
    skipped: parsed.length - kept.length,
  };
}

// ----------------------------------------------------------------------

export default function DiagnosisTableView() {
  const table = useTable({ defaultOrderBy: 'code' });
  const popover = usePopover();
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    icd_code: '',
    category: 'general',
    _id: null,
  });
  const [categoryTab, setCategoryTab] = useState('all'); // 'all' | 'dental' | 'general'
  const editRow = (row) => {
    setForm({
      name: row.name,
      description: row.description,
      icd_code: row.icd_code,
      category: categoryOf(row),
      _id: row._id,
    });
    setOpenDialog(true);
  };
  const { diagnosisData, refetch, isLoading } = useGetdiagnosis();
  const componentRef = useRef();
  const { enqueueSnackbar } = useSnackbar();

  const isMobile = useMediaQuery('(max-width: 899px)');

  const fileInputRef = useRef(null);
  const [importPreview, setImportPreview] = useState(null); // { fileName, rows, repeated, skipped }
  const [importing, setImporting] = useState(false);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: diagnosisData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  })?.filter((row) => categoryTab === 'all' || categoryOf(row) === categoryTab);

  const countOf = (value) =>
    (diagnosisData || []).filter((row) => value === 'all' || categoryOf(row) === value).length;
  const canReset = !!filters?.name;

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/diagnosis/${id}`);
      enqueueSnackbar('Deleted successfully', { variant: 'success' });
      refetch();
      popover.onClose();
    } catch (e) {
      enqueueSnackbar('Error deleting', { variant: 'error' });
    }
  };

  const handleFileChosen = (event) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow choosing the same file again
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const result = parseDiagnosisSheet(workbook);
        if (!result.rows.length) {
          enqueueSnackbar('No diagnoses found in this file', { variant: 'warning' });
          return;
        }
        setImportPreview({
          fileName: file.name,
          category: categoryTab === 'all' ? 'general' : categoryTab,
          ...result,
        });
      } catch (err) {
        enqueueSnackbar('Could not read this Excel file', { variant: 'error' });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    if (!importPreview) return;
    setImporting(true);
    try {
      const { data } = await axiosInstance.post('/api/diagnosis/import', {
        category: importPreview.category,
        rows: importPreview.rows,
      });
      const already = data.skipped_duplicates
        ? ` · ${data.skipped_duplicates} already existed`
        : '';
      enqueueSnackbar(
        `Imported ${data.inserted} ${categoryLabel(importPreview.category).toLowerCase()} diagnoses${already}`,
        { variant: 'success' }
      );
      setImportPreview(null);
      refetch();
    } catch (err) {
      enqueueSnackbar(err?.message || 'Import failed', { variant: 'error' });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = () => {
    const sheet = XLSX.utils.json_to_sheet(
      (dataFiltered || []).map((row) => ({
        Code: row.code,
        'ICD Code': row.icd_code || '',
        Category: categoryLabel(categoryOf(row)),
        Name: row.name,
        Description: row.description || '',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Diagnoses');
    XLSX.writeFile(
      workbook,
      categoryTab === 'all' ? 'diagnoses.xlsx' : `diagnoses-${categoryTab}.xlsx`
    );
  };

  const handleSubmit = async () => {
    try {
      if (form._id) {
        // update
        await axiosInstance.patch(`/api/diagnosis/${form._id}`, form);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } else {
        // create
        await axiosInstance.post('/api/diagnosis', form);
        enqueueSnackbar('Created successfully', { variant: 'success' });
      }

      setOpenDialog(false);
      refetch();
    } catch (e) {
      enqueueSnackbar('Error saving', { variant: 'error' });
    }
  };
  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading="product categories" /// edit
          links={[
            {
              name: 'dashboard',
              href: paths.superadmin.root,
            },
            {
              name: 'Tables',
              href: paths.superadmin.tables.list,
            },
            { name: 'product categories' }, /// edit
          ]}
          action={
            <Stack direction="row" spacing={1}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                hidden
                onChange={handleFileChosen}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<Iconify icon="mdi:file-excel-outline" />}
              >
                Import Excel
              </Button>
              <Button
                variant="outlined"
                onClick={handleExport}
                disabled={!dataFiltered?.length}
                startIcon={<Iconify icon="mdi:download" />}
              >
                Export Excel
              </Button>
            <Button
              variant="contained"
              onClick={() => {
                setForm({
                  name: '',
                  description: '',
                  icd_code: '',
                  category: categoryTab === 'all' ? 'general' : categoryTab,
                  _id: null,
                });
                setOpenDialog(true);
              }}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Diagnosis
            </Button>
            </Stack>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={categoryTab}
            onChange={(_e, value) => {
              setCategoryTab(value);
              table.onResetPage();
            }}
            sx={{ px: 2.5, boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.divider}` }}
          >
            {[{ value: 'all', label: 'All' }, ...CATEGORIES].map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                iconPosition="end"
                label={tab.label}
                icon={<Chip size="small" label={countOf(tab.value)} />}
              />
            ))}
          </Tabs>

          <TableDetailToolbar
            filters={filters}
            onFilters={handleFilters}
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />
          {canReset && (
            <TableDetailFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered?.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          {isMobile ? (
            <>
              {dataFiltered
                ?.slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                ?.map((row) => (
                  <MobileRow
                    key={row?._id}
                    title={row?.name}
                    fields={[
                      {
                        label: 'Code',
                        value: row?.code,
                      },
                      {
                        label: 'ICD Code',
                        value: row?.icd_code,
                      },
                      {
                        label: 'Category',
                        value: categoryLabel(categoryOf(row)),
                      },
                      {
                        label: 'name',
                        value: row?.name,
                      },
                      {
                        label: 'description',
                        value: row?.description,
                      },
                      {
                        label: 'Date',
                        value: () => (
                          <Box>
                            <Box sx={{ fontWeight: 500 }}>
                              {fDate(row.created_at, 'dd MMM yyyy')}
                            </Box>
                          </Box>
                        ),
                      },
                    ]}
                    actions={[
                      {
                        label: 'Edit',
                        onClick: () => editRow(row),
                      },
                      {
                        label: 'Delete',
                        onClick: () => handleDelete(row._id),
                      },
                    ]}
                  />
                ))}
            </>
          ) : (
            <TableContainer>
              <Scrollbar>
                <Table ref={componentRef} size={table.dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered?.length}
                    numSelected={table.selected?.length}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {dataFiltered
                      ?.slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      ?.map((row) => (
                        <TableRow hover key={row._id}>
                          <TableCell align="center">
                            <Box>{row.code}</Box>
                          </TableCell>
                          <TableCell align="center">{row.icd_code}</TableCell>
                          <TableCell align="center">
                            <Chip
                              size="small"
                              variant="soft"
                              color={categoryOf(row) === 'dental' ? 'info' : 'default'}
                              label={categoryLabel(categoryOf(row))}
                            />
                          </TableCell>
                          <TableCell align="center">{row.name}</TableCell>
                          <TableCell align="center">{row.description}</TableCell>
                          <TableCell align="center">
                            {fDate(row.created_at, 'dd MMM yyyy')}
                          </TableCell>

                          <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                            <IconButton
                              onClick={(e) => {
                                popover.onOpen(e);
                                setSelectedRow(row); // 🔥 هاي أهم سطر
                              }}
                            >
                              <Iconify icon="eva:more-vertical-fill" />
                            </IconButton>

                            <CustomPopover open={popover.open} onClose={popover.onClose}>
                              <MenuItem
                                onClick={() => {
                                  editRow(selectedRow);
                                  popover.onClose();
                                }}
                              >
                                Edit
                              </MenuItem>

                              <MenuItem
                                onClick={() => handleDelete(selectedRow._id)}
                                sx={{ color: 'error.main' }}
                              >
                                Delete
                              </MenuItem>
                            </CustomPopover>
                          </TableCell>
                        </TableRow>
                      ))}

                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          )}

          <TablePaginationCustom
            count={dataFiltered?.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <Box sx={{ p: 3, width: 400 }}>
          <Box sx={{ fontSize: 18, fontWeight: 600, mb: 2 }}>
            {form._id ? 'Edit Diagnosis' : 'New Diagnosis'}
          </Box>

          <TextField
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            fullWidth
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="icd code"
            fullWidth
            value={form.icd_code}
            onChange={(e) => setForm({ ...form, icd_code: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            label="Category"
            fullWidth
            value={form.category || 'general'}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            helperText="Dental: shown to dentists only · General: shown to all other specialties"
            sx={{ mb: 3 }}
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>

          <Button fullWidth variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Dialog>

      <Dialog
        open={Boolean(importPreview)}
        onClose={() => !importing && setImportPreview(null)}
        maxWidth="md"
        fullWidth
      >
        {importPreview && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Import diagnoses
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {importPreview.fileName} — {importPreview.rows.length} diagnoses ready
              {importPreview.repeated ? ` · ${importPreview.repeated} repeated rows ignored` : ''}
              {importPreview.skipped ? ` · ${importPreview.skipped} rows without a code ignored` : ''}.
              Codes already in this category are skipped.
            </Typography>

            <TextField
              select
              size="small"
              label="Import as"
              value={importPreview.category}
              onChange={(e) => setImportPreview({ ...importPreview, category: e.target.value })}
              helperText="Dental: shown to dentists only · General: shown to all other specialties"
              sx={{ mb: 2, minWidth: 260 }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>

            <TableContainer sx={{ maxHeight: 360, mb: 2 }}>
              <Table size="small" stickyHeader>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>ICD Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  </TableRow>
                  {importPreview.rows.map((row, i) => (
                    <TableRow key={`${row.icd_code}-${i}`}>
                      <TableCell>{row.icd_code}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button onClick={() => setImportPreview(null)} disabled={importing}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleImport} disabled={importing}>
                {importing
                  ? 'Importing…'
                  : `Import ${importPreview.rows.length} as ${categoryLabel(importPreview.category)}`}
              </Button>
            </Stack>
          </Box>
        )}
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    const search = name.toLowerCase();

    inputData = inputData?.filter(
      (data) =>
        data?.name?.toLowerCase().includes(search) ||
        data?.description?.toLowerCase().includes(search) ||
        data?.code?.toString().includes(search) ||
        data?.icd_code?.toLowerCase().includes(search)
    );
  }

  return inputData;
}
