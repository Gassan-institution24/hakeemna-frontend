import useSWR from 'swr';
import * as XLSX from 'xlsx';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';
import TablePagination from '@mui/material/TablePagination';

import { paths } from 'src/routes/paths';

import { useDebounce } from 'src/hooks/use-debounce';

import axiosInstance, { fetcher } from 'src/utils/axios';

import { useLocales } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------
// Medicines grouped by speciality. Groups come from each medicine's Medical_Specialty_EN/AR
// (set by the medicines Excel import), so nothing has to be maintained by hand here.

const GROUPS_URL = '/api/medicines/by-speciality';
const LIST_URL = '/api/medicines/by-speciality/medicines';

const COLUMNS = [
  { id: 'code', label: 'Code' },
  { id: 'trade_name', label: 'Trade name' },
  { id: 'scientific_name', label: 'Scientific name' },
  { id: 'Concentration_source', label: 'Concentration', fallback: 'concentration' },
  { id: 'Rational_Dosage_Form', label: 'Dosage form' },
  { id: 'Rational_Unit', label: 'Unit' },
  { id: 'pakage_for_unit', label: 'Package for unit' },
  { id: 'ATCCODE', label: 'ATC code' },
  { id: 'public_price', label: 'Public price', align: 'right' },
  { id: 'Specialty_Status', label: 'Specialty status' },
];

const cell = (row, col) => row?.[col.id] ?? (col.fallback ? row?.[col.fallback] : '') ?? '';

export default function SpecialityMedicinesView() {
  const { enqueueSnackbar } = useSnackbar();
  const { currentLang } = useLocales();
  const ar = currentLang.value === 'ar';

  const [groupSearch, setGroupSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [exporting, setExporting] = useState(false);
  const debouncedSearch = useDebounce(search);

  const { data: groupsData, isLoading: groupsLoading } = useSWR(GROUPS_URL, fetcher);
  const groups = useMemo(() => (Array.isArray(groupsData) ? groupsData : []), [groupsData]);

  const visibleGroups = useMemo(() => {
    const q = groupSearch.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) =>
      `${g.name_english} ${g.name_arabic}`.toLowerCase().includes(q)
    );
  }, [groups, groupSearch]);

  const current = selected || groups[0] || null;

  const { data: listData, isLoading: listLoading } = useSWR(
    current
      ? [
          LIST_URL,
          { params: { key: current.key, search: debouncedSearch, page, rowsPerPage } },
        ]
      : null,
    fetcher
  );
  const medicines = listData?.medicines || [];
  const total = listData?.total || 0;

  const groupName = (g) =>
    (ar ? g?.name_arabic || g?.name_english : g?.name_english || g?.name_arabic) || '';

  const pick = (g) => {
    setSelected(g);
    setPage(0);
    setSearch('');
  };

  const handleExport = async () => {
    if (!current) return;
    setExporting(true);
    try {
      const { data } = await axiosInstance.get(LIST_URL, {
        params: { key: current.key, page: 0, rowsPerPage: 5000 },
      });
      const rows = (data?.medicines || []).map((m) =>
        Object.fromEntries(COLUMNS.map((c) => [c.label, cell(m, c)]))
      );
      const sheet = XLSX.utils.json_to_sheet(rows);
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, sheet, 'medicines');
      XLSX.writeFile(book, `${current.name_english || 'speciality'} medicines.xlsx`);
    } catch (err) {
      enqueueSnackbar(err?.message || 'Export failed', { variant: 'error' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Speciality medicines"
        links={[
          { name: 'dashboard', href: paths.superadmin.root },
          { name: 'Tables', href: paths.superadmin.tables.list },
          { name: 'Speciality medicines' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {groupsLoading && <LinearProgress sx={{ mb: 2 }} />}

      {!groupsLoading && !groups.length && (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No medicines with a speciality yet</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Import medicines with the Medical_Specialty_EN / Medical_Specialty_AR columns filled
            (Tables → Medicines → Import Excel), and they will be grouped here.
          </Typography>
        </Card>
      )}

      {!!groups.length && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
          {/* specialities */}
          <Card sx={{ width: { xs: 1, md: 320 }, flexShrink: 0 }}>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search speciality…"
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
              />
            </Box>
            <List dense sx={{ maxHeight: { md: 640 }, overflow: 'auto', pt: 0 }}>
              {visibleGroups.map((g) => (
                <ListItemButton
                  key={g.key}
                  selected={current?.key === g.key}
                  onClick={() => pick(g)}
                >
                  <ListItemText
                    primary={groupName(g)}
                    secondary={ar ? g.name_english : g.name_arabic}
                    primaryTypographyProps={{ noWrap: true }}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                  {g.speciality && (
                    <Tooltip title="Matches a speciality in the specialities table">
                      <Iconify
                        icon="solar:link-circle-bold"
                        width={18}
                        sx={{ color: 'success.main', mx: 1, flexShrink: 0 }}
                      />
                    </Tooltip>
                  )}
                  <Chip size="small" label={g.count} />
                </ListItemButton>
              ))}
            </List>
          </Card>

          {/* medicines of the chosen speciality */}
          <Card sx={{ flexGrow: 1, minWidth: 0, width: 1 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ sm: 'center' }}
              sx={{ p: 2 }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{groupName(current)}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {total} medicines
                </Typography>
              </Box>
              <TextField
                size="small"
                placeholder="Search trade or scientific name…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                sx={{ minWidth: 260 }}
              />
              <Button
                variant="outlined"
                disabled={exporting || !total}
                onClick={handleExport}
                startIcon={<Iconify icon="solar:export-bold" />}
              >
                Export Excel
              </Button>
            </Stack>

            {listLoading && <LinearProgress />}

            <TableContainer sx={{ maxHeight: 620 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {COLUMNS.map((c) => (
                      <TableCell key={c.id} align={c.align || 'left'} sx={{ whiteSpace: 'nowrap' }}>
                        {c.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicines.map((m) => (
                    <TableRow key={m._id} hover>
                      {COLUMNS.map((c) => (
                        <TableCell key={c.id} align={c.align || 'left'}>
                          {cell(m, c)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {!listLoading && !medicines.length && (
                    <TableRow>
                      <TableCell colSpan={COLUMNS.length}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
                          No medicines
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={total}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[25, 50, 100]}
              onPageChange={(_, p) => setPage(p)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Card>
        </Stack>
      )}
    </Container>
  );
}
