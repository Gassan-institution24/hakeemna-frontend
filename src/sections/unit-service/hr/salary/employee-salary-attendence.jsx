import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useGetEmployeeAttendence } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { Stack, Typography } from '@mui/material';

import EmployeeAttendenceRow from './attendance-row';
import EmployeeAttendanceToolbar from './attendance-toolbar';
import AtteendanceFiltersResult from './attendance-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function EmployeeSalaryAttendence({ employee }) {
  const { t } = useTranslate();

  const TABLE_HEAD = [
    { id: 'date', label: t('Day') },
    { id: 'check_in_time', label: t('check in') },
    { id: 'check_out_time', label: t('check out') },
    { id: 'leave_time', label: t('leave time') },
    { id: 'work_time', label: t('work time') },
    { id: 'work_type', label: t('work type') },
    { id: 'leave', label: t('leave') },
    { id: '' },
  ].filter(Boolean);

  const table = useTable({ defaultOrderBy: 'code' });

  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const { attendence, length, hours, annual, sick, unpaid, other, refetch } =
    useGetEmployeeAttendence(employee?._id, {
      page: table.page,
      rowsPerPage: table.rowsPerPage,
      order: table.order,
      sortBy: table.orderBy,
      reported: 1,
      ...filters,
    });

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const canReset = !!filters.startDate && !!filters.endDate;

  const notFound = (!attendence.length && canReset) || !attendence.length;

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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

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
          <Typography>{t('other days off')}:</Typography>
          <Typography>{other}</Typography>
        </Stack>
      </Stack>
      <Card>
        <EmployeeAttendanceToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          dateError={dateError}
        />

        {canReset && (
          <AtteendanceFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={attendence.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={attendence.length}
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
                rowCount={attendence.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {attendence.map((row, idx) => (
                  <EmployeeAttendenceRow key={idx} row={row} refetch={refetch} />
                ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={length}
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

EmployeeSalaryAttendence.propTypes = {
  employee: PropTypes.object,
};
