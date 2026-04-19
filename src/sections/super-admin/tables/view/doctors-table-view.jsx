import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useSnackbar } from 'notistack';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { ListItemText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useGetDoctors } from 'src/api/doctors';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
// import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import CustomPopover from 'src/components/custom-popover';

import TableDetailRow from '../doctors/table-details-row'; /// edit
import MobileRow from '../../mobile-row';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  phone: '',
  city: '',
  notes: '',
  communication_date: '',
};

// ----------------------------------------------------------------------

export default function CompaniesTableView() {
  /// edit
  const [showAll, setShowAll] = useState(false);
  const TABLE_HEAD = [
    /// to edit
    { id: 'code', label: 'code' },
    { id: 'name', label: 'name' },
    { id: 'phone', label: 'phone' },
    { id: 'contact', label: 'contact' },
    { id: 'city', label: 'city' },
    { id: 'notes', label: 'notes' },
    { id: 'communication_date', label: 'communication date' },
    { id: 'status', label: 'status' },
    { id: '', label: '' },
    { id: '', width: 50 },
  ].filter(Boolean);
  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
  // const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [savingNotes, setSavingNotes] = useState({});

  const router = useRouter();

  const { doctorsData, loading } = useGetDoctors();
  const [notesMap, setNotesMap] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [savingStatus, setSavingStatus] = useState({});

  const [filters, setFilters] = useState(defaultFilters);

  const searchParams = useSearchParams();

  const upload_record = searchParams.get('upload_record');

  useEffect(() => {
    if (upload_record) {
      setFilters((prev) => ({ ...prev, name: upload_record }));
    }
  }, [upload_record]);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: doctorsData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const canReset = !!filters?.name;

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownload = () => {
    const excelBody = dataFiltered.reduce((acc, data) => {
      acc.push({
        code: data.code,
        name: data.name,
        phone: data.phone,
        notes: data.notes,
      });
      return acc;
    }, []);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelBody);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, 'doctors.xlsx'); /// edit
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
      router.push(paths.superadmin.tables.companies.edit(id)); /// edit
    },
    [router]
  );
  const handleStatusChange = (id, value) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleSaveStatus = async (id, status) => {
    if (!status) return;

    try {
      setSavingStatus((prev) => ({ ...prev, [id]: true }));

      await axiosInstance.patch(endpoints.doctors.one(id), { status });

      enqueueSnackbar('done ✅', { variant: 'success' });
    } catch (e) {
      console.log(e);
    } finally {
      setSavingStatus((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleNoteChange = (id, value) => {
    setNotesMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleSaveNote = async (id) => {
    const notes = notesMap[id];
    if (notes === undefined) return;

    try {
      setSavingNotes((prev) => ({ ...prev, [id]: true }));

      await axiosInstance.patch(endpoints.doctors.one(id), { notes });

      enqueueSnackbar('done ✅', { variant: 'success' });
    } catch (e) {
      console.log(e);
    } finally {
      setSavingNotes((prev) => ({ ...prev, [id]: false }));
    }
  };
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // const handleViewRow = useCallback(
  //   (id) => {
  //     router.push(paths.dashboard.order.details(id));
  //   },
  //   [router]
  // );

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Container maxWidth="">
      <CustomBreadcrumbs
        heading="doctors" /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Tables',
            href: paths.superadmin.tables.list,
          },
          { name: 'doctors' }, /// edit
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.superadmin.tables.doctors.new} /// edit
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New doctor
          </Button> /// edit
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
            results={dataFiltered?.length}
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
                  title={row?.name}
                  fields={[
                    {
                      label: 'Code',
                      value: row?.code,
                    },
                    {
                      label: 'Phone',
                      value: <a href={`tel:${row?.phone}`}>{row?.phone}</a>,
                    },
                    {
                      label: 'Contact',
                      value: (
                        <Stack direction="row" spacing={2} justifyContent="flex-start">
                          <a href={`tel:${row.phone}`} style={{ color: 'green' }}>
                            <Iconify icon="material-symbols:call" />
                          </a>

                          <a href={`sms:${row.phone}`} style={{ color: 'green' }}>
                            <Iconify icon="solar:chat-round-dots-bold" />
                          </a>

                          <a
                            href={`https://wa.me/${row.phone}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'green' }}
                          >
                            <Iconify icon="flowbite:whatsapp-solid" />
                          </a>
                        </Stack>
                      ),
                    },
                    {
                      label: 'City',
                      value: row?.city,
                    },
                    {
                      label: 'Notes',
                      value: row?.notes,
                    },
                    {
                      label: 'Communication Date',
                      value: row?.communication_date,
                    },
                    {
                      label: 'Status',
                      value: (
                        <TextField
                          select
                          fullWidth
                          size="small"
                          value={statusMap[row._id] ?? row.status}
                          disabled={savingStatus[row._id]}
                          onChange={(e) => {
                            const newStatus = e.target.value;

                            handleStatusChange(row._id, newStatus); // تحديث UI
                            handleSaveStatus(row._id, newStatus); // حفظ مباشر
                          }}
                        >
                          <MenuItem value="not contact">لم يتم التواصل</MenuItem>
                          <MenuItem value="agreed">قبول</MenuItem>
                          <MenuItem value="refused">رفض</MenuItem>
                          <MenuItem value="no number">لا يوجد رقم</MenuItem>
                          <MenuItem value="wrong number">رقم خاطئ</MenuItem>
                        </TextField>
                      ),
                    },
                    {
                      label: 'Edit Notes',
                      value: (
                        <TextField
                          fullWidth
                          multiline
                          size="small"
                          value={notesMap[row._id] ?? row.notes}
                          onChange={(e) => handleNoteChange(row._id, e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => handleSaveNote(row._id)}>
                                  <Iconify icon="icon-park-solid:correct" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      ),
                    },
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
            <Scrollbar sx={{ height: '60vh', position: 'relative' }}>
              <Table ref={componentRef} size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  sx={{ position: { sm: 'sticky' }, top: 0, zIndex: 5 }}
                />

                <TableBody sx={{ position: 'relative' }}>
                  {dataFiltered
                    ?.slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    ?.map((row, idx) => (
                      <TableDetailRow
                        key={idx}
                        index={idx}
                        row={row}
                        showAll={showAll}
                        selected={table.selected.includes(row._id)}
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
          count={dataFiltered?.length}
          page={table.page}
          setPage={table.setPage}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name } = filters;

  const stabilizedThis = inputData?.map((el, index, idx) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el, idx) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) =>
        (data?.name && data?.name?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.phone && data?.phone?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?.upload_record === name ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  return inputData;
}
