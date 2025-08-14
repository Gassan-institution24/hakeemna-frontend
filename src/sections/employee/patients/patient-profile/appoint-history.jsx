import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import { useMediaQuery, Stack, Box, Paper, Typography, Divider } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp, fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUSPatientAppointments } from 'src/api';
import useUSTypeGuard from 'src/auth/guard/USType-guard';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

import PatientHistoryRow from './appoint-history-row';
import AddEmegencyAppointment from '../../appointments/add-emergency-appointment';


function MobileCardView({ row, t, isMedLab, onCancelRow, onViewRow }) {
  const popover = usePopover();
  const DDL = usePopover();

  return (
    <>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="subtitle2" color="primary">
                {t('Sequence')}: {row.sequence_number}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {fDate(row.start_time, 'dd MMMM yyyy')} - {fDate(row.start_time, 'p')}
              </Typography>
            </Box>
            <IconButton 
              color={popover.open ? 'inherit' : 'default'} 
              onClick={popover.onOpen}
              size="small"
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>

          <Divider />

          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('Appointment Type')}
            </Typography>
            <Typography variant="body2">
              {row.appointment_type?.name_english || '-'}
            </Typography>
          </Stack>

          {/* Work Group */}
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('Work Group')}
            </Typography>
            <Typography variant="body2">
              {row.work_group?.name_english || '-'}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('Note')}
            </Typography>
            <Typography variant="body2">
              {row.note || '-'}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('Status')}
            </Typography>
            <Label 
              variant="soft" 
              color={
                (row.status === 'pending' && 'secondary') ||
                (row.status === 'processing' && 'info') ||
                (row.status === 'finished' && 'success') ||
                (row.status === 'canceled' && 'error') ||
                'default'
              }
            >
              {t(row.status)}
            </Label>
          </Stack>

          {isMedLab && row.medical_analysis && (
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                {t('Medical Analysis')}
              </Typography>
              <Typography variant="body2">
                {row.medical_analysis}
              </Typography>
            </Stack>
          )}
        </Stack>

        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuItem lang="ar" onClick={DDL.onOpen}>
            <Iconify icon="carbon:data-quality-definition" sx={{ mr: 1 }} />
            {t('DDL')}
          </MenuItem>
          {row.status === 'pending' && (
            <MenuItem onClick={() => {
              onCancelRow();
              popover.onClose();
            }} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:close-circle-fill" sx={{ mr: 1 }} />
              {t('Cancel')}
            </MenuItem>
          )}
        </CustomPopover>

        <CustomPopover
          open={DDL.open}
          onClose={DDL.onClose}
          arrow="right-top"
          sx={{
            padding: 2,
            maxWidth: 320,
            fontSize: '14px',
          }}
        >
          <Box sx={{ fontWeight: 600 }}>{t('Creation Time')}:</Box>
          <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
            <ListItemText
              primary={fDate(row.created_at, 'dd MMMMMMMM yyyy')}
              secondary={fDate(row.created_at, 'p')}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />
          </Box>
          <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by')}:</Box>
          <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{row.user_creation?.email || '-'}</Box>
          <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by IP')}:</Box>
          <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{row.ip_address_user_creation || '-'}</Box>
          <Box sx={{ pt: 1, fontWeight: 600 }}>{t('Editing Time')}:</Box>
          <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
            <ListItemText
              primary={fDate(row.updated_at, 'dd MMMMMMMM yyyy')}
              secondary={fDate(row.updated_at, 'p')}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />
          </Box>
          <Box sx={{ pt: 1, fontWeight: 600 }}>{t('edited by')}:</Box>
          <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{row.user_modification?.email || '-'}</Box>
          <Box sx={{ pt: 1, fontWeight: 600 }}>{t('edited by IP')}:</Box>
          <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{row.ip_address_user_modification || '-'}</Box>
          <Box sx={{ pt: 1, fontWeight: 600 }}>{t('modifications nums')}:</Box>
          <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{row.modifications_nums || 0}</Box>
        </CustomPopover>
      </Paper>
    </>
  );
}


MobileCardView.propTypes = {
  row: PropTypes.shape({
    _id: PropTypes.string,
    sequence_number: PropTypes.number,
    start_time: PropTypes.string,
    appointment_type: PropTypes.shape({
      name_english: PropTypes.string,
    }),
    work_group: PropTypes.shape({
      name_english: PropTypes.string,
    }),
    note: PropTypes.string,
    status: PropTypes.string,
    medical_analysis: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    user_creation: PropTypes.shape({
      email: PropTypes.string,
    }),
    user_modification: PropTypes.shape({
      email: PropTypes.string,
    }),
    ip_address_user_creation: PropTypes.string,
    ip_address_user_modification: PropTypes.string,
    modifications_nums: PropTypes.number,
  }).isRequired,
  t: PropTypes.func.isRequired,
  isMedLab: PropTypes.bool.isRequired,
  onCancelRow: PropTypes.func.isRequired,
  onViewRow: PropTypes.func.isRequired,
};


function DesktopTableView({ 
  table, 
  dataFiltered, 
  TABLE_HEAD, 
  appointmentsData, 
  handleViewRow, 
  handleCancelRow, 
  notFound,
  isMedLab
}) {
  return (
    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
      <TableSelectedAction
        dense={table.dense}
        numSelected={table.selected.length}
        rowCount={dataFiltered.length}
        color="error"
      />
      <Scrollbar>
        <Table size={table.dense ? 'small' : 'medium'}>
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
              .map((row) => (
                <PatientHistoryRow
                  key={row._id}
                  row={row}
                  selected={table.selected.includes(row._id)}
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
  );
}


DesktopTableView.propTypes = {
  table: PropTypes.object.isRequired,
  dataFiltered: PropTypes.array.isRequired,
  TABLE_HEAD: PropTypes.array.isRequired,
  appointmentsData: PropTypes.array.isRequired,
  handleViewRow: PropTypes.func.isRequired,
  handleCancelRow: PropTypes.func.isRequired,
  notFound: PropTypes.bool.isRequired,
  isMedLab: PropTypes.bool.isRequired,
};



const defaultFilters = {
  name: '',
  status: 'pending',
  startDate: null,
  endDate: null,
};



export default function AppointHistoryView({ patient }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslate();
  const { isMedLab } = useUSTypeGuard();

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
  const table = useTable({ defaultOrderBy: 'start_time' });
  const confirm = useBoolean();
  const addModal = useBoolean();

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
      <Container 
        maxWidth="xl" 
        sx={{ 
          px: { xs: 1, sm: 2 },
          py: { xs: 1, sm: 2 }
        }}
      >
        <Card 
          sx={{ 
            boxShadow: { xs: 0, sm: 1 },
            border: { xs: '1px solid', sm: 'none' },
            borderColor: 'divider'
          }}
        >
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="flex-end" 
            margin={{ xs: 1, sm: 2 }}
            spacing={{ xs: 1, sm: 0 }}
          >
            <Button
              component={RouterLink}
              onClick={() => addModal.onTrue()}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                bgcolor: 'error.dark',
                '&:hover': {
                  bgcolor: 'error.main',
                },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {t('new urgent appointment')}
            </Button>
          </Stack>
          
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile}
            allowScrollButtonsMobile={isMobile}
            sx={{
              px: { xs: 1, sm: 2.5 },
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              '& .MuiTab-root': {
                minHeight: { xs: 40, sm: 48 },
                fontSize: { xs: 12, sm: 14 }
              }
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
                    sx={{ 
                      fontSize: { xs: 10, sm: 12 },
                      minWidth: { xs: 20, sm: 24 },
                      height: { xs: 20, sm: 24 },
                      padding: { xs: 0.5, sm: 1 }
                    }}
                  >
                    {tab.count}
                  </Label>
                }
                sx={{ 
                  padding: { xs: 1, sm: 2 },
                  minWidth: { xs: 'auto', sm: 120 }
                }}
              />
            ))}
          </Tabs>

          {/* Responsive Content */}
          {isMobile ? (
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              {dataFiltered.length > 0 ? (
                dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <MobileCardView
                      key={row._id}
                      row={row}
                      t={t}
                      isMedLab={isMedLab}
                      onCancelRow={() => handleCancelRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                    />
                  ))
              ) : (
                <TableNoData notFound={notFound} />
              )}
            </Box>
          ) : (
            <DesktopTableView
              table={table}
              dataFiltered={dataFiltered}
              TABLE_HEAD={TABLE_HEAD}
              appointmentsData={appointmentsData}
              handleViewRow={handleViewRow}
              handleCancelRow={handleCancelRow}
              notFound={notFound}
              isMedLab={isMedLab}
            />
          )}

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
            sx={{
              '& .MuiTablePagination-select': {
                fontSize: { xs: 12, sm: 14 }
              },
              '& .MuiTablePagination-displayedRows': {
                fontSize: { xs: 12, sm: 14 }
              },
              '& .MuiTablePagination-actions': {
                '& .MuiIconButton-root': {
                  fontSize: { xs: 18, sm: 22 }
                }
              }
            }}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t("Cancel")}
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
            size={isMobile ? 'small' : 'medium'}
          >
            {t('cancel')}
          </Button>
        }
        sx={{
          '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
            px: { xs: 2, sm: 3 }
          }
        }}
      />
      <AddEmegencyAppointment 
        refetch={refetch} 
        open={addModal.value} 
        onClose={addModal.onFalse} 
        isMobile={isMobile}
      />
    </>
  );
}



function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, startDate, endDate } = filters;

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