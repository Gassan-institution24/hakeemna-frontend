import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUSPatientAppointments } from 'src/api';
import useUSTypeGuard from 'src/auth/guard/USType-guard';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
// import { useSettingsContext } from 'src/components/settings';
import {
  useTable,

  TableNoData,
  getComparator,

  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import PatientHistoryRow from './appoint-history-row';
// import PatientHistoryToolbar from './appoint-history-toolbar';
// import HistoryFiltersResult from './appoint-history-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'pending',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function AppointHistoryView({ patient }) {
  const theme = useTheme();
  const { t } = useTranslate();
  const { isMedLab } = useUSTypeGuard();

  // const settings = useSettingsContext();
  const TABLE_HEAD = [
    { id: 'start_time', label: t('start time') },
    { id: 'sequence_number', label: t('sequence') },
    { id: 'appointment_type', label: t('appointment type') },
    { id: 'work_group', label: t('work group') },
    { id: 'note', label: t('note') },
    isMedLab && { id: 'medicalAnalysis', label: t('medical analysis') },
    { id: 'status', label: t('status') },
    { id: '' },
  ].filter(Boolean);

  const router = useRouter();

  const { user } = useAuthContext();

  const table = useTable({ defaultOrderBy: 'code' });

  const confirm = useBoolean();

  const { appointmentsData, refetch } = useGetUSPatientAppointments(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient?.patient?._id,
    patient?._id
  );

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



  const canReset =
    !!filters.name || filters.status !== 'pending' || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getAppointLength = (status) =>
    appointmentsData.filter((item) => item.status === status).length;

  const TABS = isMedLab
    ? [
      {
        value: 'pending',
        label: t('pending'),
        color: 'secondary',
        count: getAppointLength('pending'),
      },
      {
        value: 'finished',
        label: t('finished'),
        color: 'success',
        count: getAppointLength('finished'),
      },
      {
        value: 'canceled',
        label: t('canceled'),
        color: 'error',
        count: getAppointLength('canceled'),
      },
    ]
    : [
      // { value: 'all', label: 'All', color: 'default', count: appointmentsData.length },
      {
        value: 'pending',
        label: t('pending'),
        color: 'secondary',
        count: getAppointLength('pending'),
      },
      {
        value: 'processing',
        label: t('processing'),
        color: 'info',
        count: getAppointLength('processing'),
      },
      {
        value: 'finished',
        label: t('finished'),
        color: 'success',
        count: getAppointLength('finished'),
      },
      {
        value: 'canceled',
        label: t('canceled'),
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

  const handleCancelRow = useCallback(
    async (_id) => {
      await axiosInstance.patch(`${endpoints.appointments.one(_id)}/cancel`);
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch]
  );
  const handleCancelRows = useCallback(async () => {
    await axiosInstance.patch(`${endpoints.appointments.all}/cancel`, { ids: table.selected });
    await axiosInstance.patch(`${endpoints.appointments.all}/cancel`, { ids: table.selected });
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: appointmentsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [refetch, dataFiltered.length, dataInPage.length, appointmentsData.length, table]);

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

  return (
    <>
      <Container maxWidth="xl">
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

          {/* <PatientHistoryToolbar
            filters={filters}
            onFilters={handleFilters}
            onAdd={handleAddRow}
            //
            dateError={dateError}
            serviceOptions={appointmenttypesData.map((option, idx) => option)}
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
          )} */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
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
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, idx) => (
                      <PatientHistoryRow
                        key={idx}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        refetch={refetch}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onCancelRow={() => handleCancelRow(row._id)}
                      />
                    ))}

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
        title="Cancel"
        content={
          <>
            {t('Are you sure want to cancel')} <strong> {table.selected.length} </strong>{' '}
            {t('items')}?
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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index, idx) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el, idx) => el[0]);

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
  patient: PropTypes.object,
};
