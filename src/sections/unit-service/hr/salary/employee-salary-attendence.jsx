import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';
import { Stack, Typography, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';
import { fDate, fTime, fHourMin } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetEmployeeAttendence } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  useTable,
  MobileRow,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import EmployeeAttendenceRow from './attendance-row';
import EmployeeAttendanceToolbar from './attendance-toolbar';
import AttendanceEdit from '../employee-profile/attendance-edit';
import AtteendanceFiltersResult from './attendance-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  startDate: null,
  endDate: null,
  reported: null,
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
    { id: 'note', label: t('note') },
    { id: '' },
  ].filter(Boolean);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const isMobile = useMediaQuery('(max-width:899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
  const table = useTable({ defaultOrderBy: 'code' });
  const [open, setOpen] = useState(false);
  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const {
    attendence,
    length,
    hours,
    annual,
    sick,
    unpaid,
    other,
    public: publicHolidays,
    ids,
    refetch,
  } = useGetEmployeeAttendence(employee?._id, {
    page: table.page,
    rowsPerPage: table.rowsPerPage,
    order: table.order,
    sortBy: table.orderBy,
    ...filters,
  });
  // here
  // const dateError =
  //   filters.startDate && filters.endDate
  //     ? filters.startDate.getTime() > filters.endDate.getTime()
  //     : false;

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

  const deleteHandler = useCallback(
    async (id) => {
      await axiosInstance.delete(endpoints.attendence.one(id));
      refetch();
    },
    [refetch]
  );
  const getMobileRowColor = (row) => {
    if (filters.reported !== null) return 'inherit';
    if (row.reported) return 'green';
    return 'red';
  };

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
          <Typography>{publicHolidays}</Typography>
        </Stack>
        <Stack alignItems="center" direction="row" gap={1}>
          <Typography>{t('other days off')}:</Typography>
          <Typography>{other}</Typography>
        </Stack>
      </Stack>
      {filters.reported === null && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <b>{t('Note:')}</b> {t('Rows highlighted in')}{' '}
          <span style={{ color: 'red' }}>{t('red')}</span>{' '}
          {t('are not assigned to a specific monthly report, and rows highlighted in')}{' '}
          <span style={{ color: 'green' }}>{t('green')}</span>{' '}
          {t('are assigned to a specific monthly report.')}
        </Typography>
      )}
      <Card>
        <EmployeeAttendanceToolbar
          filters={filters}
          onFilters={handleFilters}
          hours={hours}
          annual={annual}
          sick={sick}
          unpaid={unpaid}
          publicHolidays={publicHolidays}
          other={other}
          ids={ids}
          refetch={refetch}
          length={length}
          showReported
          //
          // dateError={dateError}
        />

        {canReset && (
          <AtteendanceFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        {isMobile ? (
          <>
            {attendence
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <MobileRow
                  fields={[
                    {
                      label: t('Day'),
                      value: fDate(row.date, 'EEEE, dd MMMMMMMM yyyy'),
                    },
                    {
                      label: t('check in'),
                      value: fTime(row.check_in_time),
                    },
                    {
                      label: t('check out'),
                      value: fTime(row.check_out_time),
                    },
                    {
                      label: t('leave time'),
                      value: fHourMin(row.leaveTime),
                    },
                    {
                      label: t('work time'),
                      value: fHourMin(row.workTime),
                    },
                    {
                      label: t('work type'),
                      value: row.work_type ? t(row.work_type) : '-',
                    },
                    {
                      label: t('note'),
                      value: row.note ? t(row.note) : '-',
                    },
                  ]}
                  actions={[
                    {
                      label: t('DDL'),
                      icon: 'carbon:data-quality-definition',
                      onClick: (event) => {
                        setDdlRow(row);
                        setDdlAnchorEl(event.currentTarget);
                      },
                    },
                    {
                      label: t('Edit'),
                      icon: 'fluent:edit-32-filled',
                      onClick: () => {
                        setSelectedRow(row);
                        setOpen(true);
                      },
                    },
                    {
                      label: t('Delete'),
                      icon: 'mdi:trash',
                      color: 'error.main',
                      onClick: () => {
                        setDeleteRow(row);
                      },
                    },
                  ]}
                  sx={{
                    color: getMobileRowColor(row),
                  }}
                />
              ))}
          </>
        ) : (
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
                    <EmployeeAttendenceRow
                      key={idx}
                      row={row}
                      refetch={refetch}
                      onDeleteRow={deleteHandler}
                      reported={row.reported}
                      selectedReported={filters.reported}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

        {open && selectedRow && (
          <AttendanceEdit
            row={selectedRow}
            open={open}
            refetch={refetch}
            onClose={() => {
              setOpen(false);
              setSelectedRow(null);
            }}
            isMissingAttendance={filters.showUnattendance}
          />
        )}

        <ConfirmDialog
          open={Boolean(deleteRow)}
          onClose={() => setDeleteRow(null)}
          title={t('Deleting Attendence')}
          content={t('Are you sure to delete this?')}
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (deleteRow?._id) {
                  deleteHandler(deleteRow._id);
                }
                setDeleteRow(null);
              }}
            >
              {t('Delete')}
            </Button>
          }
        />

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
              <Box sx={{ fontWeight: 600 }}>{t('creation time')}:</Box>
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
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.user_creation?.email}
              </Box>

              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by IP')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.ip_address_user_creation}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editing time')}:</Box>
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
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.user_modification?.email}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor IP')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
                {ddlRow.ip_address_user_modification}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>
                {t('modifications no')}: {ddlRow.modifications_nums}
              </Box>
            </>
          )}
        </CustomPopover>

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
