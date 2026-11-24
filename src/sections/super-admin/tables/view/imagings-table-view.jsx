import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { ListItemText } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import axiosInstance from 'src/utils/axios';
import { fDate } from 'src/utils/format-time';

import { useGetImagings } from 'src/api/imaging';

import { useSnackbar } from 'src/components/snackbar';
import CustomPopover from 'src/components/custom-popover';

import TableDetailRow from '../imagings/table-details-row'; /// edit
import MobileRow from '../../mobile-row';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';
import {
  parseImagingSheet,
  downloadImagingTemplate,
  IMAGING_TEMPLATE_HEADERS,
} from '../imagings/parse-imaging-sheet';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'imagining_group', label: 'Imaging Group' },
  { id: 'diagnostic_test', label: 'Diagnostic Test' },
  { id: 'description', label: 'Description' },
  { id: 'international_code', label: 'International Code' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function ImagingsTableView() {
  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
  const router = useRouter();

  const { imagingData, loading, refetch } = useGetImagings();
  const { enqueueSnackbar } = useSnackbar();

  const fileInputRef = useRef(null);
  const [importPreview, setImportPreview] = useState(null); // { fileName, rows, repeated, skipped }
  const [importing, setImporting] = useState(false);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: imagingData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const canReset = !!filters?.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownload = () => {
    // Same column titles as the import template, so an export can be edited and re-imported.
    const [codeH, testH, groupH, descH] = IMAGING_TEMPLATE_HEADERS;
    const excelBody = dataFiltered.map((data) => ({
      Code: data.code,
      [codeH]: data.international_code || '',
      [testH]: data.diagnostic_test || '',
      [groupH]: data.imagining_group || '',
      [descH]: data.description || '',
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelBody);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, 'ImagingTable.xlsx'); /// edit
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // lets the same file be picked again
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        const result = parseImagingSheet(workbook);
        if (!result.rows.length) {
          enqueueSnackbar('No imaging rows found in this file', { variant: 'warning' });
          return;
        }
        setImportPreview({ fileName: file.name, ...result });
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
      const { data } = await axiosInstance.post('/api/imaging/import', {
        rows: importPreview.rows,
      });
      const already = data.skipped_duplicates
        ? ` · ${data.skipped_duplicates} already existed`
        : '';
      enqueueSnackbar(`Imported ${data.inserted} imaging rows${already}`, { variant: 'success' });
      setImportPreview(null);
      refetch();
    } catch (err) {
      enqueueSnackbar(err?.message || 'Import failed', { variant: 'error' });
    } finally {
      setImporting(false);
    }
  };

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

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.superadmin.tables.imaging.edit(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Imagings" /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Tables',
            href: paths.superadmin.tables.list,
          },
          { name: 'Imaging' },
        ]}
        action={
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              hidden
              onChange={handleFileChange}
            />
            <Button
              variant="text"
              onClick={downloadImagingTemplate}
              startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
            >
              Template
            </Button>
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              startIcon={<Iconify icon="solar:import-bold" />}
            >
              Import Excel
            </Button>
            <Button
              component={RouterLink}
              href={paths.superadmin.tables.imaging.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Imaging
            </Button>
          </Stack>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <TableDetailToolbar
          onPrint={printHandler}
          filters={filters}
          onFilters={handleFilters}
          onDownload={handleDownload}
          //
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
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        {isMobile ? (
          <>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <MobileRow
                  key={row?._id}
                  title={row?.diagnostic_test}
                  fields={[
                    { label: 'Code', value: row?.code },
                    { label: 'Imaging Group', value: row?.imagining_group },
                    { label: 'International Code', value: row?.international_code },
                    { label: 'Description', value: row?.description },
                  ]}
                  actions={[
                    {
                      label: 'Edit',
                      icon: 'fluent:edit-32-filled',
                      onClick: () => handleEditRow(row._id),
                    },
                    {
                      label: 'DDL',
                      icon: 'carbon:data-quality-definition',
                      onClick: (event) => {
                        setDdlRow(row);
                        setDdlAnchorEl(event.currentTarget);
                      },
                    },
                  ]}
                />
              ))}
          </>
        ) : (
          <TableContainer>
            <TableSelectedAction
              // dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row, idx) => row._id)
                )
              }
              color={
                dataFiltered
                  .filter((row) => table.selected.includes(row._id))
                  .some((data) => data.status === 'inactive')
                  ? 'primary'
                  : 'error'
              }
            />

            <Scrollbar>
              <Table ref={componentRef} size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row, idx) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, idx) => (
                      <TableDetailRow
                        key={idx}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        setFilters={setFilters}
                        filters={filters}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}
        <CustomPopover
          open={ddlOpen}
          onClose={() => setDdlAnchorEl(null)}
          anchorEl={ddlAnchorEl}
          arrow="right-top"
          sx={{
            padding: 2,
            fontSize: '14px',
            minWidth: 260,
          }}
        >
          {ddlRow && (
            <>
              <Box sx={{ fontWeight: 600 }}>Creation Time:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                <ListItemText
                  primary={fDate(ddlRow.created_at, 'dd MMMMMMMM yyyy')}
                  secondary={fDate(ddlRow.created_at, 'p')}
                  primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                  secondaryTypographyProps={{
                    component: 'span',
                    typography: 'caption',
                  }}
                />
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>created by:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.user_creation?.email}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>created by IP:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.ip_address_user_creation}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>Editing Time:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                <ListItemText
                  primary={fDate(ddlRow.updated_at, 'dd MMMMMMMM yyyy')}
                  secondary={fDate(ddlRow.updated_at, 'p')}
                  primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                  secondaryTypographyProps={{
                    component: 'span',
                    typography: 'caption',
                  }}
                />
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>Editor:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.user_modification?.email}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>Editor IP:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
                {ddlRow.ip_address_user_modification}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>
                Modifications No: {ddlRow.modifications_nums}
              </Box>
            </>
          )}
        </CustomPopover>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      <Dialog
        open={Boolean(importPreview)}
        onClose={() => !importing && setImportPreview(null)}
        maxWidth="md"
        fullWidth
      >
        {importPreview && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Import imaging
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {importPreview.fileName} — {importPreview.rows.length} rows ready
              {importPreview.repeated ? ` · ${importPreview.repeated} repeated rows ignored` : ''}
              {importPreview.skipped
                ? ` · ${importPreview.skipped} rows without a diagnostic test ignored`
                : ''}
              . Rows already in the table are skipped.
            </Typography>

            <TableContainer sx={{ maxHeight: 360, mb: 2 }}>
              <Table size="small" stickyHeader>
                <TableBody>
                  <TableRow>
                    {IMAGING_TEMPLATE_HEADERS.map((header) => (
                      <TableCell key={header} sx={{ fontWeight: 600 }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                  {importPreview.rows.map((row, i) => (
                    <TableRow key={`${row.international_code}-${row.diagnostic_test}-${i}`}>
                      <TableCell>{row.international_code}</TableCell>
                      <TableCell>{row.diagnostic_test}</TableCell>
                      <TableCell>{row.imagining_group}</TableCell>
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
                {importing ? 'Importing…' : `Import ${importPreview.rows.length}`}
              </Button>
            </Stack>
          </Box>
        )}
      </Dialog>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name } = filters;

  const stabilizedThis = inputData?.map((el, index, idx) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el, idx) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) =>
        (data?.imagining_group &&
          data?.imagining_group?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1) ||
        (data?.diagnostic_test &&
          data?.diagnostic_test?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1) ||
        (data?.international_code &&
          data?.international_code?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
