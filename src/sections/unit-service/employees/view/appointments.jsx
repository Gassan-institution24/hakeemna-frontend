import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useAuthContext } from 'src/auth/hooks';

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
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { endpoints } from 'src/utils/axios';
import axiosHandler from 'src/utils/axios-handler';
import { useSnackbar } from 'src/components/snackbar';

import { useGetAppointmentTypes, useGetUSEmployeeAppointments } from 'src/api/tables';
import AppointmentsRow from '../appointments/appointment-row';
import PatientHistoryToolbar from '../appointments/appointment-toolbar';
import HistoryFiltersResult from '../appointments/appointment-filters-result';
import AddEmegencyAppointment from '../appointments/add-emergency-appointment';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'appointment_type', label: 'Appointment Type' },
  { id: 'work_group', label: 'Work Group' },
  { id: 'work_shift', label: 'Work Shift' },
  { id: 'patient', label: 'Patient' },
  { id: 'start_time', label: 'Start Time' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  status: 'all',
  types: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function AppointmentsView({ employeeData }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const { user } = useAuthContext();

  const addModal = useBoolean();
  const confirm = useBoolean();
  const confirmUnCancel = useBoolean();
  const confirmDelay = useBoolean();

  const { appointmentsData, refetch } = useGetUSEmployeeAppointments(
    user?.unit_service._id,
    employeeData._id
  );
  console.log('employeeData', employeeData);
  console.log('appointmentsData', appointmentsData);

  const { appointmenttypesData } = useGetAppointmentTypes();

  const [filters, setFilters] = useState(defaultFilters);
  const [minToDelay, setMinToDelay] = useState(0);

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
    !!filters.name ||
    filters.status !== 'all' ||
    !!filters.startDate ||
    !!filters.endDate ||
    filters.types.length > 0;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getAppointLength = (status) =>
    appointmentsData.filter((item) => item.status === status).length;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: appointmentsData.length },
    {
      value: 'available',
      label: 'Available',
      color: 'secondary',
      count: getAppointLength('available'),
    },
    {
      value: 'pending',
      label: 'Pending',
      color: 'warning',
      count: getAppointLength('pending'),
    },
    {
      value: 'processing',
      label: 'Processing',
      color: 'info',
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
    {
      value: 'not booked',
      label: 'Not Booked',
      color: 'secondary',
      count: getAppointLength('not booked'),
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

  const handleCancelRow = useCallback(
    async (id) => {
      await axiosHandler({ method: 'PATCH', path: `${endpoints.tables.appointment(id)}/cancel` });
      enqueueSnackbar('canceled successfully!');
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, enqueueSnackbar]
  );

  const handleDelayRow = useCallback(
    async (id, min) => {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.appointment(id)}/delay`,
        data: { minutes: min },
      });
      enqueueSnackbar('delayed successfully!');
      refetch();
      setMinToDelay(0);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, enqueueSnackbar]
  );

  const handleUnCancelRow = useCallback(
    async (id) => {
      await axiosHandler({ method: 'PATCH', path: `${endpoints.tables.appointment(id)}/uncancel` });
      enqueueSnackbar('uncanceled successfully!');
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, enqueueSnackbar]
  );

  const handleCancelRows = useCallback(
    async (id) => {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.appointments}/cancel`,
        data: { ids: table.selected },
      });
      enqueueSnackbar('canceled successfully!');
      refetch();
      table.onUpdatePageDeleteRows({
        totalRows: appointmentsData.length,
        totalRowsInPage: dataInPage.length,
        totalRowsFiltered: dataFiltered.length,
      });
    },
    [
      refetch,
      dataFiltered.length,
      dataInPage.length,
      appointmentsData.length,
      table,
      enqueueSnackbar,
    ]
  );

  const handleDelayRows = useCallback(async () => {
    await axiosHandler({
      method: 'PATCH',
      path: `${endpoints.tables.appointments}/delay`,
      data: { ids: table.selected, minutes: minToDelay },
    });
    enqueueSnackbar('delayed successfully!');
    refetch();
    setMinToDelay(0);
    table.onUpdatePageDeleteRows({
      totalRows: appointmentsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    refetch,
    dataFiltered.length,
    dataInPage.length,
    appointmentsData.length,
    table,
    minToDelay,
    enqueueSnackbar,
  ]);

  const handleUnCancelRows = useCallback(
    async (id) => {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.appointments}/uncancel`,
        data: { ids: table.selected },
      });
      enqueueSnackbar('uncanceled successfully!');
      refetch();
      table.onUpdatePageDeleteRows({
        totalRows: appointmentsData.length,
        totalRowsInPage: dataInPage.length,
        totalRowsFiltered: dataFiltered.length,
      });
    },
    [
      refetch,
      dataFiltered.length,
      dataInPage.length,
      appointmentsData.length,
      table,
      enqueueSnackbar,
    ]
  );

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
        <CustomBreadcrumbs
          heading="Appointments" /// edit
          links={[
            {
              name: 'Dashboard',
              href: paths.unitservice.root,
            },
            { name: 'Appointments' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
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
            onAdd={() => addModal.onTrue()}
            //
            dateError={dateError}
            options={appointmenttypesData.map((option) => option)}
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
                <>
                  <Tooltip title="delay all">
                    <IconButton color="info" onClick={confirmDelay.onTrue}>
                      <Iconify icon="mdi:timer-sync" />
                    </IconButton>
                  </Tooltip>
                  {dataFiltered
                    .filter((row) => table.selected.includes(row._id))
                    .some((data) => data.status === 'canceled') ? (
                    <Tooltip title="uncancel all">
                      <IconButton color="primary" onClick={confirmUnCancel.onTrue}>
                        <Iconify icon="material-symbols-light:notifications-active-rounded" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="cancel all">
                      <IconButton color="error" onClick={confirm.onTrue}>
                        <Iconify icon="mdi:bell-cancel" />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              }
              color={
                dataFiltered
                  .filter((row) => table.selected.includes(row._id))
                  .some((data) => data.status === 'canceled')
                  ? 'primary'
                  : 'error'
              }
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
                      <AppointmentsRow
                        refetch={refetch}
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onDelayRow={handleDelayRow}
                        onCancelRow={() => handleCancelRow(row._id)}
                        onUnCancelRow={() => handleUnCancelRow(row._id)}
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

      <AddEmegencyAppointment refetch={refetch} open={addModal.value} onClose={addModal.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Cancel"
        content={
          <>
            Are you sure want to cancel <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
              handleCancelRows();
            }}
          >
            Cancel
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmUnCancel.value}
        onClose={confirmUnCancel.onFalse}
        title="UnCancel"
        content={
          <>
            Are you sure want to uncancel <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirmUnCancel.onFalse();
              handleUnCancelRows();
            }}
          >
            uncancel
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmDelay.value}
        onClose={confirmDelay.onFalse}
        title="Delay"
        content={
          <>
            How many minutes do you want to delay items?
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ fontSize: '0.8rem' }}>min</Box>
                  </InputAdornment>
                ),
              }}
              type="number"
              sx={{ p: 2, width: '100%' }}
              size="small"
              onChange={(e) => setMinToDelay(e.target.value)}
            />
          </>
        }
        action={
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              confirmDelay.onFalse();
              handleDelayRows();
            }}
          >
            Delay
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
        (appointment?.work_shift?.name_english &&
          appointment?.work_shift?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (appointment?.work_shift?.name_arabic &&
          appointment?.work_shift?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (appointment?.work_group?.name_english &&
          appointment?.work_group?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (appointment?.work_group?.name_arabic &&
          appointment?.work_group?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
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
          fTimestamp(appointment.start_time) >= fTimestamp(startDate) &&
          fTimestamp(appointment.start_time) <= fTimestamp(endDate)
      );
    } else if (startDate) {
      const endOfDay = new Date(startDate);
      endOfDay.setDate(endOfDay.getDate() + 1);
      inputData = inputData.filter(
        (appointment) =>
          fTimestamp(appointment.start_time) >= fTimestamp(startDate) &&
          fTimestamp(appointment.start_time) < fTimestamp(endOfDay)
      );
    }
  }
  if (types.length > 0) {
    inputData = inputData.filter((appoint) => types?.includes(appoint.appointment_type._id));
  }

  return inputData;
}
AppointmentsView.propTypes = {
  employeeData: PropTypes.object,
};
