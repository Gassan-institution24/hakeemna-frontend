import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { endpoints } from 'src/utils/axios';
import axiosHandler from 'src/utils/axios-handler';
import { useGetAppointmentTypes, useGetPatientAppointments } from 'src/api/tables';
// import PatientHistoryAnalytic from './appoint-history-analytic';
import PatientHistoryRow from './appoint-history-row';
import PatientHistoryToolbar from './appoint-history-toolbar';
import HistoryFiltersResult from './appoint-history-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'name_english', label: 'Name', align: 'center' },
  { id: 'unit_service', label: 'Unit Service' },
  { id: 'appointment_type', label: 'Appointment Type' },
  { id: 'payment_method', label: 'Payment Method' },
  { id: 'start_time', label: 'Start Time' },
  { id: 'end_time', label: 'End Time' },
  { id: 'price_in_JOD', label: 'Price in JOD' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function AppointHistoryView({ patientData }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const { appointmentsData, refetch } = useGetPatientAppointments(patientData._id);

  const { appointmenttypesData } = useGetAppointmentTypes();

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: appointmentsData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getAppointLength = (status) =>
    appointmentsData.filter((item) => item.status === status).length;

  // const getTotalAmount = (status) =>
  //   sumBy(
  //     appointmentsData.filter((item) => item.status === status),
  //     'totalAmount'
  //   );

  // const getPercentByStatus = (status) => (getAppointLength(status) / appointmentsData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: appointmentsData.length },
    {
      value: 'pending',
      label: 'Pending',
      color: 'warning',
      count: getAppointLength('pending'),
    },
    {
      value: 'processing',
      label: 'Processing',
      color: 'default',
      count: getAppointLength('processing'),
    },
    {
      value: 'finished',
      label: 'Finished',
      color: 'success',
      count: getAppointLength('finished'),
    },
    {
      value: 'canceled',
      label: 'Canceled',
      color: 'error',
      count: getAppointLength('canceled'),
    },
  ];

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

  const handleUnbookRow = useCallback(
    async (id) => {
      await axiosHandler({ method: 'PATCH', path: `${endpoints.tables.appointment(id)}/unbook` });
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table,refetch]
  );
  const handleUnbookRows = useCallback(
    async (id) => {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.appointments}/unbook`,
        data: { ids: table.selected },
      });
      refetch();
      table.onUpdatePageDeleteRows({
        totalRows: appointmentsData.length,
        totalRowsInPage: dataInPage.length,
        totalRowsFiltered: dataFiltered.length,
      });
    },
    [refetch,dataFiltered.length, dataInPage.length,appointmentsData.length, table]
  );
  const handleAddRow = useCallback(() => {
    router.push(paths.superadmin.patients.history.addAppointment(patientData._id));
  }, [router, patientData._id]);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <PatientHistoryToolbar
            filters={filters}
            onFilters={handleFilters}
            onAdd={handleAddRow}
            //
            dateError={dateError}
            serviceOptions={appointmenttypesData.map((option) => option)}
          />

          {canReset && (
            <HistoryFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              // dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Unbook all">
                  <IconButton color="error" onClick={confirm.onTrue}>
                    <Iconify icon="mdi:bell-cancel" />
                  </IconButton>
                </Tooltip>
              }
              color="error"
            />
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={appointmentsData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <PatientHistoryRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onUnbookRow={() => handleUnbookRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, appointmentsData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

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
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Unbook"
        content={
          <>
            Are you sure want to Unbook <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
              handleUnbookRows();
            }}
          >
            Unbook
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, types, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (appointment) =>
        (appointment?.unit_service?.name_english &&
          appointment?.unit_service?.name_english.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        (appointment?.unit_service?.name_arabic &&
          appointment?.unit_service?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        (appointment?.name_english &&
          appointment?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (appointment?.name_arabic &&
          appointment?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        appointment?._id === name ||
        JSON.stringify(appointment.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((appointment) => appointment.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (appointment) =>
          fTimestamp(appointment.date) >= fTimestamp(startDate) &&
          fTimestamp(appointment.date) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
AppointHistoryView.propTypes = {
  patientData: PropTypes.object,
};
