import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
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
import { Stack, Button, TextField, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
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

import EmployeeAttendenceRow from './attendance-row';
import MyAttendenceMobile from './MyAttendenceMobile';
import EmployeeAttendanceToolbar from './attendance-toolbar';
import AtteendanceFiltersResult from './attendance-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function MyAttendence() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const isMobile = useMediaQuery('(max-width: 899px)');

  const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement];

  const TABLE_HEAD = [
    { id: 'date', label: t('Day') },
    { id: 'check_in_time', label: t('check in') },
    { id: 'check_out_time', label: t('check out') },
    { id: 'leave_time', label: t('leave time') },
    { id: 'work_time', label: t('work time') },
    { id: 'work_type', label: t('work type') },
    { id: 'leave', label: t('leave') },
    { id: 'note', label: t('note') },
    { id: 'Activity', label: t('Activity') },
    { id: '' },
  ].filter(Boolean);

  const table = useTable({ defaultOrderBy: 'code' });

  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const {
    attendence,
    length,
    hours,
    annual,
    sick,
    public: publicHolidays,
    unpaid,
    other,
    refetch,
  } = useGetEmployeeAttendence(employee?._id, {
    page: table.page,
    rowsPerPage: table.rowsPerPage,
    order: table.order,
    sortBy: table.orderBy,
    ...filters,
  });

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const canReset = !!filters.startDate && !!filters.endDate;

  const notFound = (!attendence.length && canReset) || !attendence.length;
  const [taskDialog, setTaskDialog] = useState({
    open: false,
    tasks: [],
    attendanceId: null,
  });

  const openTaskDialog = (tasksArray, attendanceId) => {
    setTaskDialog({
      open: true,
      attendanceId,
      tasks: Array.isArray(tasksArray)
        ? tasksArray.map((task) => ({ ...task })) // clone
        : [{ activity: '', hours: '' }],
    });
  };

  const closeTaskDialog = () => {
    setTaskDialog({
      open: false,
      tasks: [],
      attendanceId: null,
    });
  };
  const handleTaskChange = (index, field, value) => {
    setTaskDialog((prev) => {
      const updated = [...prev.tasks];
      updated[index][field] = value;
      return { ...prev, tasks: updated };
    });
  };

  const addTask = () => {
    setTaskDialog((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { activity: '', hours: '' }],
    }));
  };

  const removeTask = (index) => {
    setTaskDialog((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
  };
  const saveTasks = async () => {
    try {
      await axiosInstance.patch(endpoints.attendence.tasks(taskDialog.attendanceId), {
        tasks: taskDialog.tasks.map((task) => ({
          activity: task.activity,
          hours: Number(task.hours),
        })),
      });
      enqueueSnackbar(t('Tasks updated successfully'), { variant: 'success' });
      refetch();
      closeTaskDialog();
    } catch (error) {
      enqueueSnackbar(t('Failed to update tasks'), { variant: 'error' });
    }
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
          <MyAttendenceMobile
            attendence={attendence}
            onDelete={deleteHandler}
            refetch={refetch}
            onViewTask={(tasks, id) => openTaskDialog(tasks, id)}
          />
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
                      onViewTask={(tasks, id) => openTaskDialog(tasks, id)}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

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

        <DialogContent dividers>
          <Stack spacing={2}>
            {taskDialog.tasks.map((task, index) => (
              <Box key={index} sx={{ p: 2, border: '1px solid', borderRadius: 2 }}>
                {index > 0 && (
                  <IconButton size="small" color="error" onClick={() => removeTask(index)}>
                    <Iconify icon="mdi:trash-outline" />
                  </IconButton>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={t('Activity')}
                  value={task.activity}
                  onChange={(e) => handleTaskChange(index, 'activity', e.target.value)}
                  sx={{ mb: 1 }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label={t('hours')}
                  value={task.hours}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === '' || Number(value) >= 0) {
                      handleTaskChange(index, 'hours', value);
                    }
                  }}
                />
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<Iconify icon="mdi:plus" />}
              sx={{ alignSelf: 'flex-start' }}
              onClick={addTask}
            >
              {t('Add another activity')}
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeTaskDialog}>{t('Cancel')}</Button>

          <Button variant="contained" onClick={saveTasks}>
            {t('Save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
