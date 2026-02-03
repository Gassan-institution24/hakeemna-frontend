import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';
import { Stack, Typography, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';
import { fDate, fHourMin, useFDateTimeUnit } from 'src/utils/format-time';

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

import AttendanceEdit from './attendance-edit';
import EmployeeAttendenceRow from './attendance-row';
import EmployeeAttendanceToolbar from './attendance-toolbar';
import AtteendanceFiltersResult from './attendance-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  startDate: null,
  endDate: null,
  showUnattendance: false,
};

// ----------------------------------------------------------------------

export default function EmployeeAttendence({ employee, setLastAttendance }) {
  const { t } = useTranslate();

  const [showUnattendance, setShowUnattendance] = useState(false);

  const TABLE_HEAD = showUnattendance
    ? [{ id: 'date', label: t('Day') }, { id: 'note', label: t('note') }, { id: '' }].filter(
        Boolean
      )
    : [
        { id: 'date', label: t('Day') },
        { id: 'check_in_time', label: t('check in') },
        { id: 'check_out_time', label: t('check out') },
        { id: 'leave_time', label: t('leave time') },
        { id: 'work_time', label: t('work time') },
        { id: 'work_type', label: t('work type') },
        // { id: 'leave', label: t('leave') },
        { id: 'note', label: t('note') },
        { id: 'Activity', label: t('Activity') },
        { id: '' },
      ].filter(Boolean);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const isMobile = useMediaQuery('(max-width:899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
  const table = useTable({ defaultOrderBy: 'code' });
  const { fTimeUnit } = useFDateTimeUnit();
  const [open, setOpen] = useState(false);

  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);
  const [setExpandedRows] = useState({});

  // Synchronize showUnattendance state with filters
  useEffect(() => {
    setShowUnattendance(filters.showUnattendance || false);
  }, [filters.showUnattendance]);

  const {
    attendence,
    length,
    hours,
    annual,
    sick,
    public: publicHolidays,
    unpaid,
    other,
    missingAttendanceData,
    missingAttendanceDataLength,
    refetch,
  } = useGetEmployeeAttendence(employee?._id, {
    page: table.page,
    rowsPerPage: table.rowsPerPage,
    order: table.order,
    sortBy: table.orderBy,
    ...filters,
  });

  const displayData = filters.showUnattendance ? missingAttendanceData || [] : attendence || [];
  const displayLength = filters.showUnattendance ? missingAttendanceDataLength || 0 : length || 0;

  const paginatedDisplayData =
    filters.showUnattendance && missingAttendanceData
      ? missingAttendanceData.slice(
          table.page * table.rowsPerPage,
          (table.page + 1) * table.rowsPerPage
        )
      : displayData;

  const finalDisplayData = filters.showUnattendance ? paginatedDisplayData : displayData;
  const finalDisplayLength = filters.showUnattendance
    ? missingAttendanceData?.length || 0
    : displayLength;

  useEffect(() => {
    const maxPage = Math.ceil(finalDisplayLength / table.rowsPerPage) - 1;
    if (table.page > maxPage && maxPage >= 0) {
      table.onResetPage();
    }
  }, [finalDisplayLength, table.rowsPerPage, table.page, table.onResetPage, table]);

  if (attendence && attendence.length) {
    setLastAttendance(attendence[0]);
  }

  const dateError =
    filters.startDate && filters.endDate
      ? new Date(filters.startDate).getTime() > new Date(filters.endDate).getTime()
      : false;

  const canReset = !!filters.startDate && !!filters.endDate;

  const notFound = (!finalDisplayData.length && canReset) || !finalDisplayData.length;
  const [taskDialog, setTaskDialog] = useState({
    open: false,
    tasks: [],
  });

  const openTaskDialog = (tasksArray) => {
    setTaskDialog({
      open: true,
      tasks: Array.isArray(tasksArray) ? tasksArray : [],
    });
  };

  const closeTaskDialog = () => {
    setTaskDialog({
      open: false,
      tasks: [],
    });
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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleShowUnattendanceChange = useCallback(
    (isChecked) => {
      setShowUnattendance(isChecked);
      table.onResetPage();
    },
    [table]
  );

  const deleteHandler = useCallback(
    async (id) => {
      await axiosInstance.delete(endpoints.attendence.one(id));
      refetch();
    },
    [refetch]
  );

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
      <Card>
        <EmployeeAttendanceToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          dateError={dateError}
          onShowUnattendanceChange={handleShowUnattendanceChange}
        />

        {canReset && (
          <AtteendanceFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={finalDisplayLength}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}
        {isMobile ? (
          <>
            {finalDisplayData
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <MobileRow
                  fields={[
                    {
                      label: t('Day'),
                      value: fTimeUnit(row.date, 'EEE dd MMM', true),
                    },
                    {
                      label: t('check in'),
                      value: fTimeUnit(row.check_in_time, 'p', true),
                    },
                    {
                      label: t('check out'),
                      value: fTimeUnit(row.check_out_time, 'p', true),
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
                      value: t(row.work_type),
                    },
                    {
                      label: t('note'),
                      value: t(row.note),
                    },
                    {
                      label: t('Activity'),
                      value: (() => {
                        // eslint-disable-next-line no-nested-ternary
                        const normalizedTasks = row.tasks?.length
                          ? row.tasks
                          : row.task
                            ? [{ activity: row.task, hours: row.time_doing_the_task }]
                            : [];

                        return (
                          <>
                            <Typography variant="body2">
                              {normalizedTasks.length
                                ? `${normalizedTasks[0].activity.slice(0, 6)}${
                                    normalizedTasks.length > 1 ? '...' : ''
                                  }`
                                : t('No Data')}
                            </Typography>

                            {normalizedTasks.length > 0 && (
                              <Typography
                                variant="caption"
                                sx={{
                                  cursor: 'pointer',
                                  color: 'primary.main',
                                  display: 'block',
                                  mt: 0.5,
                                }}
                                onClick={() => openTaskDialog(normalizedTasks)}
                              >
                                {t('View')}
                              </Typography>
                            )}
                          </>
                        );
                      })(),
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
                />
              ))}
          </>
        ) : (
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={finalDisplayData.length}
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
                  rowCount={finalDisplayData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {finalDisplayData.map((row, idx) => (
                    <EmployeeAttendenceRow
                      key={idx}
                      row={row}
                      refetch={refetch}
                      onDeleteRow={deleteHandler}
                      showUnattendance={showUnattendance}
                      isMissingAttendance={filters.showUnattendance}
                      setExpandedRows={setExpandedRows}
                      onViewTask={openTaskDialog}
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
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('login location')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow.checkInLocation}</Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('logout location')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow.checkOutLocation}</Box>
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

        {finalDisplayLength > 0 && (
          <TablePaginationCustom
            count={finalDisplayLength}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        )}
      </Card>
      <Dialog open={taskDialog.open} onClose={closeTaskDialog} fullWidth maxWidth="sm">
        {/* Title */}
        <DialogTitle
          sx={{
            fontWeight: 600,
            pb: 1,
          }}
        >
          {t('Activity details')}
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          {taskDialog.tasks.length ? (
            taskDialog.tasks.map((task, index) => (
              <Box
                key={task._id || index}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 1.5,
                  bgcolor: 'background.neutral',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    lineHeight: 1.7,
                    fontWeight: 500,
                  }}
                >
                  {task.activity}
                </Typography>

                <Box
                  sx={{
                    mt: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Iconify icon="mdi:clock-outline" width={18} />
                  <Typography variant="caption" color="text.secondary">
                    {task.hours} {t('hours')}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">-</Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeTaskDialog} variant="contained">
            {t('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// ----------------------------------------------------------------------

EmployeeAttendence.propTypes = {
  employee: PropTypes.object,
  setLastAttendance: PropTypes.func,
};
