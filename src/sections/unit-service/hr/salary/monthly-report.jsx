import PropTypes from 'prop-types';
import { useRef, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { useSnackbar } from 'notistack';

import { Stack, Typography } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetMonthlyReports } from 'src/api/monthly_reports';

import { LoadingScreen } from 'src/components/loading-screen';

import MonthlyReportRow from './monthly-report-row';
import AttendanceToolbar from './attendance-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  reported: null,
};

// ----------------------------------------------------------------------

export default function MonthlyReportsView({ employee }) {
  const { t } = useTranslate();
  const TABLE_HEAD = [
    { id: 'code', label: t('number') },
    ...(!employee ? [{ id: 'employee_engagement', label: t('employee name') }] : []),
    { id: 'start_date', label: t('Start Date') },
    { id: 'end_date', label: t('End Date') },
    { id: 'working_time', label: t('Working hours') },
    { id: 'annual', label: t('annual days off') },
    { id: 'sick', label: t('sick days off') },
    { id: 'unpaid', label: t('unpaid days off') },
    { id: 'public', label: t('public days off') },
    { id: 'other', label: t('other days off') },
    { id: 'salary', label: t('salary') },
    { id: 'total', label: t('total') },
    { id: '', width: 88 },
  ].filter(Boolean);

  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);

  const {
    reportsData,
    refetch,
    loading,
    hours,
    annual,
    sick,
    unpaid,
    salary,
    total,
    other,
    public: publicCount,
    ids,
  } = useGetMonthlyReports({
    populate: [
      {
        path: 'employee_engagement',
        select: 'employee',
        populate: { path: 'employee', select: 'name_english name_arabic' },
      },
    ],
    employee_engagement: employee,
    startDate: filters?.startDate,
    endDate: filters?.endDate,
    reported: filters?.reported,
  });

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: reportsData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const canReset = !!filters?.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.unitservice.hr.employee(id)); /// edit
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await axiosInstance.delete(endpoints.monthlyReport.one(id));
        refetch();
      } catch (error) {
        console.log('error', error);
        enqueueSnackbar(error?.message, { variant: 'error' });
      }
    },
    [enqueueSnackbar, refetch]
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="xl">
      <Stack direction={{ md: 'row' }} justifyContent="space-around" mb={2}>
        <Stack alignItems="center" direction="row" gap={1}>
          <Typography>{t('working hours')}:</Typography>
          <Typography>
            {hours > 60
              ? `${Math.floor(hours / 60)} ${t('hr')} : ${(hours % 60)
                  .toString()
                  .padStart(2, '0')} ${t('min')}`
              : `${hours} ${t('min')}`}
          </Typography>
        </Stack>
        <Stack alignItems="center" direction="row" gap={1}>
          <Typography>{t('annual days off')}:</Typography>
          <Typography>{annual}</Typography>
        </Stack>
        <Stack alignItems="center" direction="row" gap={1}>
          <Typography>{t('sick days off')}:</Typography>
          <Typography>{sick}</Typography>
        </Stack>
        <Stack alignItems="center" direction="row" gap={1}>
          <Typography>{t('unpaid days off')}:</Typography>
          <Typography>{unpaid}</Typography>
        </Stack>
        <Stack alignItems="center" direction="row" gap={1}>
          <Typography>{t('public days off')}:</Typography>
          <Typography>{publicCount}</Typography>
        </Stack>
        <Stack alignItems="center" direction="row" gap={1}>
          <Typography>{t('other days off')}:</Typography>
          <Typography>{other}</Typography>
        </Stack>
        <Stack alignItems="center" direction="row" gap={1}>
          <Typography>{t('salary')}:</Typography>
          <Typography>{salary}</Typography>
        </Stack>
        <Stack alignItems="center" direction="row" gap={1}>
          <Typography>{t('total')}:</Typography>
          <Typography>{total}</Typography>
        </Stack>
      </Stack>
      {filters.reported === null && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <b>Note:</b> Rows highlighted in <span style={{ color: 'red' }}>red</span> are not assigned to a specific yearly report, and rows highlighted in <span style={{ color: 'green' }}>green</span> are assigned to a specific yearly report.
        </Typography>
      )}
      <Card>
        <AttendanceToolbar
          filters={filters}
          onFilters={handleFilters}
          monthly
          hours={hours}
          annual={annual}
          sick={sick}
          unpaid={unpaid}
          other={other}
          ids={ids}
          publicHolidays={publicCount}
          refetch={refetch}
          // onDownload={handleDownload}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          showReported
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

        <TableContainer>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            color={
              dataFiltered
                .filter((row) => table.selected.includes(row._id))
                .some((info) => info.status === 'inactive')
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
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, idx) => (
                    <MonthlyReportRow
                      key={idx}
                      row={row}
                      filters={filters}
                      setFilters={setFilters}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      hideEmployee={!!employee}
                      refetch={refetch}
                      selectedReported={filters.reported}
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name } = filters;

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
        (data?.employee?.name_english &&
          data?.employee?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.name_arabic &&
          data?.employee?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.name_english &&
          data?.employee?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.country?.name_english &&
          data?.employee?.country?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        (data?.employee?.country?.name_arabic &&
          data?.employee?.country?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.city?.name_english &&
          data?.employee?.city?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.city?.name_arabic &&
          data?.employee?.city?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.nationality?.name_english &&
          data?.employee?.nationality?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        (data?.employee?.nationality?.name_arabic &&
          data?.employee?.nationality?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        (data?.employee?.email &&
          data?.employee?.email?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  return inputData;
}
MonthlyReportsView.propTypes = {
  employee: PropTypes.string,
};
