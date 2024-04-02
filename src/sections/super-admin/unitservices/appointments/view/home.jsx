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
import { useParams, useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

// import { fTimestamp } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

// import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useGetUSAppointments, useGetAppointmentTypes } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  // getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import AppointmentsRow from '../appointment-row';
import PatientHistoryToolbar from '../appointment-toolbar';
// import HistoryFiltersResult from '../appointment-filters-result';
import AddEmegencyAppointment from '../add-emergency-appointment';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'pending',
  types: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function AppointmentsView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const TABLE_HEAD = [
    { id: 'start_time', label: t('start time') },
    { id: 'appoint_number', label: t('number') },
    { id: 'appointment_type', label: t('appointment type') },
    { id: 'patient', label: t('patient') },
    { id: 'note', label: t('note') },
    { id: 'work_group', label: t('work group') },
    { id: 'status', label: t('status') },
    { id: '' },
  ];

  const theme = useTheme();

  const checkAcl = useAclGuard();

  const settings = useSettingsContext();

  const router = useRouter();

  const params = useParams();
  const { id } = params;

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultOrderBy: 'code' });

  // const { user } = useAuthContext();

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
    // loading,
  } = useGetUSAppointments({
    id,
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

  // const appointmentsData = applyFilter({
  //   inputData: appointmentsData,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filters,
  //   dateError,
  // });

  const dataInPage = appointmentsData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    filters.status !== 'pending' ||
    !!filters.startDate ||
    !!filters.endDate ||
    filters.types.length > 0;

  const notFound = (!appointmentsData.length && canReset) || !appointmentsData.length;

  // const getAppointLength = (status) =>
  //   appointmentsData.filter((item) => item.status === status).length;

  const TABS = [
    // { value: 'all', label: t('all'), color: 'default', count: appointmentsLength },
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
      value: 'available',
      label: t('available'),
      color: 'secondary',
      count: available,
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
        await axiosInstance.patch(`${endpoints.appointments.one(row._id)}/cancel`);
        enqueueSnackbar(t('canceled successfully!'));
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
          variant: 'error',
        });
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, t, enqueueSnackbar, curLangAr]
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
        enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
          variant: 'error',
        });
        console.error(error);
      }
      refetch();
      setMinToDelay(0);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, t, enqueueSnackbar, curLangAr]
  );

  const handleUnCancelRow = useCallback(
    async (row) => {
      try {
        await axiosInstance.patch(`${endpoints.appointments.one(row._id)}/uncancel`);
        enqueueSnackbar(t('uncanceled successfully!'));
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
          variant: 'error',
        });
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, t, enqueueSnackbar, curLangAr]
  );

  const handleCancelRows = useCallback(async () => {
    try {
      await axiosInstance.patch(`${endpoints.appointments.all}/cancel`, {
        ids: table.selected,
      });
      enqueueSnackbar(t('canceled successfully!'));
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      console.error(error);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: appointmentsLength,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: appointmentsData.length,
    });
  }, [
    refetch,
    appointmentsData.length,
    dataInPage.length,
    appointmentsLength,
    table,
    t,
    enqueueSnackbar,

    curLangAr,
  ]);

  const handleDelayRows = useCallback(async () => {
    try {
      await axiosInstance.patch(`${endpoints.appointments.all}/delay`, {
        ids: table.selected,
        minutes: minToDelay,
      });
      enqueueSnackbar(t('delayed successfully!'));
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      console.error(error);
    }
    refetch();
    setMinToDelay(0);
    table.onUpdatePageDeleteRows({
      totalRows: appointmentsLength,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: appointmentsData.length,
    });
  }, [
    refetch,
    appointmentsData.length,
    dataInPage.length,
    appointmentsLength,
    table,

    curLangAr,
    t,
    minToDelay,
    enqueueSnackbar,
  ]);

  const handleUnCancelRows = useCallback(async () => {
    try {
      await axiosInstance.patch(`${endpoints.appointments.all}/uncancel`, {
        ids: table.selected,
      });
      enqueueSnackbar(t('uncanceled successfully!'));
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      console.error(error);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: appointmentsLength,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: appointmentsData.length,
    });
  }, [
    refetch,
    appointmentsData.length,
    dataInPage.length,
    appointmentsLength,
    table,
    curLangAr,
    t,
    enqueueSnackbar,
  ]);

  const handleViewRow = useCallback(
    (_id) => {
      router.push(paths.dashboard.invoice.details(_id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  // const handleResetFilters = useCallback(() => {
  //   setFilters(defaultFilters);
  // }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* <CustomBreadcrumbs
          heading={t('appointments')} /// edit
          links={[
            {
              name: t('dashboard'),
              href: paths.unitservice.root,
            },
            { name: t('appointments') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        /> */}
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

          {/* {canReset && (
            <HistoryFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={appointmentsData.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              // dense={table.dense}
              numSelected={table.selected.length}
              rowCount={appointmentsData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  appointmentsData?.map((row, idx) => row._id)
                )
              }
              action={
                checkAcl({
                  category: 'unit_service',
                  subcategory: 'appointments',
                  acl: 'update',
                }) && (
                  <>
                    <Tooltip title="delay all">
                      <IconButton color="info" onClick={confirmDelay.onTrue}>
                        <Iconify icon="mdi:timer-sync" />
                      </IconButton>
                    </Tooltip>
                    {/* {appointmentsData
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
                appointmentsData
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
                      appointmentsData?.map((row, idx) => row._id)
                    )
                  }
                />
                <TableBody>
                  {appointmentsData
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    ?.map((row, idx) => (
                      <AppointmentsRow
                        refetch={refetch}
                        key={idx}
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
            count={appointmentsData.length}
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

//   const stabilizedThis = inputData?.map((el, index, idx) => [el, index]);

//   stabilizedThis?.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis?.map((el, idx) => el[0]);

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
