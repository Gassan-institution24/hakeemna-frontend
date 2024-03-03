import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useGetAppointmentTypes, useGetEmployeeAppointments } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { RouterLink } from 'src/routes/components';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import AppointmentsRow from '../appointment-row';
import PatientHistoryToolbar from '../appointment-toolbar';
import HistoryFiltersResult from '../appointment-filters-result';
import AddEmegencyAppointment from '../add-emergency-appointment';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'all',
  types: '',
  shift: '',
  group: '',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function AppointmentsView({ employeeData }) {
  const { t } = useTranslate();
  const TABLE_HEAD = [
    { id: 'sequence_number', label: t('sequence') },
    { id: 'appoint_number', label: t('number') },
    { id: 'appointment_type', label: t('appointment type') },
    { id: 'work_group', label: t('work group') },
    { id: 'work_shift', label: t('work shift') },
    { id: 'patient', label: t('patient') },
    { id: 'start_time', label: t('start time') },
    { id: 'status', label: t('status') },
    { id: '' },
  ];

  const checkAcl = useAclGuard();

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultOrderBy: 'code' });

  const { user } = useAuthContext();

  const addModal = useBoolean();
  const confirm = useBoolean();
  const confirmUnCancel = useBoolean();
  const confirmDelay = useBoolean();

  const { appointmenttypesData } = useGetAppointmentTypes();

  const [filters, setFilters] = useState(defaultFilters);
  const [minToDelay, setMinToDelay] = useState(0);

  const {
    appointmentsData,
    appointmentsLength,
    refetch,
    all,
    available,
    notBooked,
    processing,
    canceled,
    finished,
    pending,
    loading,
  } = useGetEmployeeAppointments({
    id: user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id,
    page: table.page || 0,
    sortBy: table.orderBy || 'code',
    rowsPerPage: table.rowsPerPage || 5,
    order: table.order || 'asc',
    filters: filters || null,
  });

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = appointmentsData;
  // const dataFiltered = applyFilter({
  //   inputData: appointmentsData,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filters,
  //   dateError,
  // });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !isEqual(filters, defaultFilters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // const getAppointLength = (status) =>
  //   appointmentsData.filter((item) => item.status === status).length;

  const TABS = [
    { value: 'all', label: t('all'), color: 'default', count: all },
    {
      value: 'available',
      label: t('available'),
      color: 'secondary',
      count: available,
    },
    {
      value: 'pending',
      label: t('pending'),
      color: 'warning',
      count: pending,
    },
    {
      value: 'processing',
      label: t('processing'),
      color: 'info',
      count: processing,
    },
    {
      value: 'finished',
      label: t('finished'),
      color: 'success',
      count: finished,
    },
    {
      value: 'canceled',
      label: t('canceled'),
      color: 'error',
      count: canceled,
    },
    {
      value: 'not booked',
      label: t('not booked'),
      color: 'secondary',
      count: notBooked,
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
    async (row) => {
      try {
        await axiosInstance.patch(`${endpoints.tables.appointment(row._id)}/cancel`);
        socket.emit('updated', {
          user,
          link: paths.unitservice.appointments.root,
          msg: `canceled an appointment <strong>[ ${row.code} ]</strong>`,
        });
      } catch (error) {
        socket.emit('error', { error, user, location: window.location.pathname });
        enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
        console.error(error);
      }
      enqueueSnackbar('canceled successfully!');
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, enqueueSnackbar, user]
  );

  const handleDelayRow = useCallback(
    async (row, min) => {
      try {
        await axiosInstance.patch(`${endpoints.tables.appointment(row._id)}/delay`, {
          minutes: min,
        });
        socket.emit('updated', {
          user,
          link: paths.unitservice.appointments.root,
          msg: `delayed an appointment <strong>[ ${row.code} ]</strong>`,
        });
      } catch (error) {
        socket.emit('error', { error, user, location: window.location.pathname });
        enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
        console.error(error);
      }
      enqueueSnackbar('delayed successfully!');
      refetch();
      setMinToDelay(0);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, enqueueSnackbar, user]
  );

  const handleUnCancelRow = useCallback(
    async (row) => {
      try {
        await axiosInstance.patch(`${endpoints.tables.appointment(row._id)}/uncancel`);
        socket.emit('updated', {
          user,
          link: paths.unitservice.appointments.root,
          msg: `uncanceled an appointment <strong>[ ${row.code} ]</strong>`,
        });
      } catch (error) {
        socket.emit('error', { error, user, location: window.location.pathname });
        enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
        console.error(error);
      }
      enqueueSnackbar('uncanceled successfully!');
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, enqueueSnackbar, user]
  );

  const handleCancelRows = useCallback(
    async (id) => {
      try {
        await axiosInstance.patch(`${endpoints.tables.appointments}/cancel`, {
          ids: table.selected,
        });
        socket.emit('updated', {
          user,
          link: paths.unitservice.appointments.root,
          msg: `canceled many appointments`,
        });
      } catch (error) {
        socket.emit('error', { error, user, location: window.location.pathname });
        enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
        console.error(error);
      }
      enqueueSnackbar('canceled successfully!');
      refetch();
      table.onUpdatePageDeleteRows({
        totalRows: appointmentsLength,
        totalRowsInPage: dataInPage.length,
        totalRowsFiltered: dataFiltered.length,
      });
    },
    [
      refetch,
      dataFiltered.length,
      dataInPage.length,
      appointmentsLength,
      table,
      enqueueSnackbar,
      user,
    ]
  );

  const handleDelayRows = useCallback(async () => {
    try {
      await axiosInstance.patch(`${endpoints.tables.appointments}/delay`, {
        ids: table.selected,
        minutes: minToDelay,
      });
      socket.emit('updated', {
        user,
        link: paths.unitservice.appointments.root,
        msg: `dealayed many appointments`,
      });
      enqueueSnackbar('delayed successfully!');
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.pathname });
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
      console.error(error);
    }
    refetch();
    setMinToDelay(0);
    table.onUpdatePageDeleteRows({
      totalRows: appointmentsLength,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    refetch,
    dataFiltered.length,
    dataInPage.length,
    appointmentsLength,
    table,
    minToDelay,
    enqueueSnackbar,
    user,
  ]);

  const handleUnCancelRows = useCallback(
    async (id) => {
      try {
        await axiosInstance.patch(`${endpoints.tables.appointments}/uncancel`, {
          ids: table.selected,
        });
        enqueueSnackbar('uncanceled successfully!');
        socket.emit('updated', {
          user,
          link: paths.unitservice.appointments.root,
          msg: `uncanceled many appointments`,
        });
      } catch (error) {
        socket.emit('error', { error, user, location: window.location.pathname });
        enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRows({
        totalRows: appointmentsLength,
        totalRowsInPage: dataInPage.length,
        totalRowsFiltered: dataFiltered.length,
      });
    },
    [
      refetch,
      dataFiltered.length,
      dataInPage.length,
      appointmentsLength,
      table,
      user,
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
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('appointments')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('appointments') },
          ]}
          action={
            checkAcl({ category: 'employee', subcategory: 'appointments', acl: 'create' }) && (
              <Button
                component={RouterLink}
                onClick={() => addModal.onTrue()}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                sx={{
                  bgcolor: 'error.dark',
                  '&:hover': {
                    bgcolor: 'error.main',
                  },
                }}
              >
                {t('new emergency appointment')}
              </Button>
            )
          }
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
                    lang="ar"
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
            options={appointmenttypesData}
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
                  dataFiltered?.map((row) => row._id)
                )
              }
              action={
                checkAcl({
                  category: 'employee',
                  subcategory: 'appointments',
                  acl: 'update',
                }) && (
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
                )
              }
              color={
                checkAcl({ category: 'employee', subcategory: 'appointments', acl: 'update' }) &&
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
                  rowCount={appointmentsLength}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered?.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    // .slice(
                    //   table.page * table.rowsPerPage,
                    //   table.page * table.rowsPerPage + table.rowsPerPage
                    // )
                    ?.map((row) => (
                      <AppointmentsRow
                        refetch={refetch}
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onDelayRow={handleDelayRow}
                        onCancelRow={() => handleCancelRow(row)}
                        onUnCancelRow={() => handleUnCancelRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, appointmentsLength)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={appointmentsLength}
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
        title={t('delay')}
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
            {t('delay')}{' '}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

// function applyFilter({ inputData, comparator, filters, dateError }) {
//   const { name, status, types, startDate, endDate } = filters;

//   const stabilizedThis = inputData?.map((el, index) => [el, index]);

//   stabilizedThis?.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis?.map((el) => el[0]);

//   if (name) {
//     inputData = inputData.filter(
//       (appointment) =>
//         (appointment?.work_shift?.name_english &&
//           appointment?.work_shift?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
//         (appointment?.work_shift?.name_arabic &&
//           appointment?.work_shift?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
//         (appointment?.work_group?.name_english &&
//           appointment?.work_group?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
//         (appointment?.work_group?.name_arabic &&
//           appointment?.work_group?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
//         appointment?._id === name ||
//         JSON.stringify(appointment.code) === name
//     );
//   }

//   if (status !== 'all') {
//     inputData = inputData.filter((appointment) => appointment.status === status);
//   }

//   if (!dateError) {
//     if (startDate && endDate) {
//       inputData = inputData.filter(
//         (appointment) =>
//           fTimestamp(appointment.start_time) >= fTimestamp(startDate) &&
//           fTimestamp(appointment.start_time) <= fTimestamp(endDate)
//       );
//     } else if (startDate) {
//       const endOfDay = new Date(startDate);
//       endOfDay.setDate(endOfDay.getDate() + 1);
//       inputData = inputData.filter(
//         (appointment) =>
//           fTimestamp(appointment.start_time) >= fTimestamp(startDate) &&
//           fTimestamp(appointment.start_time) < fTimestamp(endOfDay)
//       );
//     }
//   }
//   if (types.length > 0) {
//     inputData = inputData.filter((appoint) => types?.includes(appoint.appointment_type._id));
//   }

//   return inputData;
// }
AppointmentsView.propTypes = {
  employeeData: PropTypes.object,
};
