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
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useGetAppointmentTypes, useGetEmployeeAppointments } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
// import { useSettingsContext } from 'src/components/settings';
// import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { LoadingScreen } from 'src/components/loading-screen';

import AppointmentsRow from '../appointment-row';
import PatientHistoryToolbar from '../appointment-toolbar';
import HistoryFiltersResult from '../appointment-filters-result';
import AddEmegencyAppointment from '../add-emergency-appointment';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'pending',
  types: '',
  shift: '',
  group: '',
  startDate: null,
  endDate: null,
  startTime: null,
  endTime: null,
};

// ----------------------------------------------------------------------

export default function AppointmentsView({ employeeData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const TABLE_HEAD = [
    { id: 'start_time', label: t('start time') },
    { id: 'appoint_number', label: t('number') },
    { id: 'appointment_type', label: t('appointment type') },
    { id: 'patient', label: t('patient') },
    { id: 'note', label: t('note') },
    { id: 'coming', label: t('is coming') },
    { id: 'work_group', label: t('work group') },
    { id: 'status', label: t('status') },
    { id: '' },
  ];

  const checkAcl = useAclGuard();

  const theme = useTheme();

  // const settings = useSettingsContext();

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
    // all,
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
    rowsPerPage: table.rowsPerPage || 25,
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
    // { value: 'all', label: t('all'), color: 'default', count: all },
    {
      value: 'processing',
      label: t('current appointments'),
      color: 'info',
      count: processing,
    },
    {
      value: 'pending',
      label: t('Booked Appointments'),
      color: 'warning',
      count: pending,
    },
    {
      value: 'finished',
      label: t('finished'),
      color: 'success',
      count: finished,
    },
    {
      value: 'available',
      label: t('available'),
      color: 'secondary',
      count: available,
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

  const handleBookRow = useCallback(
    async (row) => {
      const queryParams = new URLSearchParams({
        day: row.start_time,
        appointment: row._id,
      });

      router.push({
        pathname: paths.employee.appointments.book,
        search: `?${queryParams.toString()}`,
      });
    },
    [router]
  );

  const handleCancelRow = useCallback(
    async (row) => {
      try {
        await axiosInstance.patch(`${endpoints.appointments.one(row._id)}/cancel`);
        enqueueSnackbar(t('canceled successfully!'));
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(
          curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
          {
            variant: 'error',
          }
        );
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, enqueueSnackbar, t, curLangAr]
  );

  const handleDelayRow = useCallback(
    async (row, min) => {
      try {
        await axiosInstance.patch(`${endpoints.appointments.one(row._id)}/delay`, {
          minutes: min,
        });
        enqueueSnackbar(t('delayed successfully!'));
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(
          curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
          {
            variant: 'error',
          }
        );
        console.error(error);
      }
      refetch();
      setMinToDelay(0);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, t, refetch, enqueueSnackbar, curLangAr]
  );

  const handleUnCancelRow = useCallback(
    async (row) => {
      try {
        await axiosInstance.patch(`${endpoints.appointments.one(row._id)}/uncancel`);
        enqueueSnackbar(t('uncanceled successfully!'));
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(
          curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
          {
            variant: 'error',
          }
        );
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, t, refetch, enqueueSnackbar, curLangAr]
  );

  const handleCancelRows = useCallback(
    async (id) => {
      try {
        await axiosInstance.patch(`${endpoints.appointments.all}/cancel`, {
          ids: table.selected,
        });
        enqueueSnackbar(t('canceled successfully!'));
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(
          curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
          {
            variant: 'error',
          }
        );
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
      t,
      curLangAr,
      enqueueSnackbar,
    ]
  );

  const handleDelayRows = useCallback(async () => {
    try {
      await axiosInstance.patch(`${endpoints.appointments.all}/delay`, {
        ids: table.selected,
        minutes: minToDelay,
      });
      enqueueSnackbar(t('delayed successfully!'));
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
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
    t,
    curLangAr,
    minToDelay,
    enqueueSnackbar,
  ]);

  const handleUnCancelRows = useCallback(
    async (id) => {
      try {
        await axiosInstance.patch(`${endpoints.appointments.all}/uncancel`, {
          ids: table.selected,
        });
        enqueueSnackbar(t('uncanceled successfully!'));
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(
          curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
          {
            variant: 'error',
          }
        );
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
      t,
      curLangAr,
      enqueueSnackbar,
    ]
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
    return(
      <LoadingScreen />
    )
  }

  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={t('appointments')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('appointments') },
          ]}
          action={
            checkAcl({ category: 'work_group', subcategory: 'appointments', acl: 'create' }) && (
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
                {t('new urgent appointment')}
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
            {TABS.map((tab, idx) => (
              <Tab
                key={idx}
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
                  dataFiltered?.map((row, idx) => row._id)
                )
              }
              action={
                checkAcl({
                  category: 'work_group',
                  subcategory: 'appointments',
                  acl: 'update',
                }) && (
                  <>
                    <Tooltip title="delay all">
                      <IconButton color="info" onClick={confirmDelay.onTrue}>
                        <Iconify icon="mdi:timer-sync" />
                      </IconButton>
                    </Tooltip>
                    {/* {dataFiltered
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
                    )} */}
                  </>
                )
              }
              color={
                checkAcl({ category: 'work_group', subcategory: 'appointments', acl: 'update' }) &&
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
                      dataFiltered?.map((row, idx) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    // .slice(
                    //   table.page * table.rowsPerPage,
                    //   table.page * table.rowsPerPage + table.rowsPerPage
                    // )
                    ?.map((row, idx) => (
                      <AppointmentsRow
                        refetch={refetch}
                        key={idx}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDelayRow={handleDelayRow}
                        onCancelRow={() => handleCancelRow(row)}
                        onBookAppoint={() => handleBookRow(row)}
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
        title={t('cancel')}
        content={
          <>
            {t('Are you sure want to cancel')} <strong> {table.selected.length} </strong>{' '}
            {t('items?')}
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
            {t('cancel')}
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmUnCancel.value}
        onClose={confirmUnCancel.onFalse}
        title={t('uncancel')}
        content={
          <>
            {t('Are you sure want to uncancel')} <strong> {table.selected.length} </strong>{' '}
            {t('items?')}
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
            {t('uncancel')}
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmDelay.value}
        onClose={confirmDelay.onFalse}
        title={t('delay')}
        content={
          <>
            {t('How many minutes do you want to delay items?')}
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ fontSize: '0.8rem' }}>{t('min')}</Box>
                  </InputAdornment>
                ),
              }}
              type="number"
              sx={{ p: 2, width: '100%' }}
              size="small"
              onChange={(e) => setMinToDelay(e.target.value)}
              helperText={t('knowing that you can type a negative value to make it earlier')}
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

//   const stabilizedThis = inputData?.map((el, index, idx)  => [el, index]);

//   stabilizedThis?.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis?.map((el, idx)  => el[0]);

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
