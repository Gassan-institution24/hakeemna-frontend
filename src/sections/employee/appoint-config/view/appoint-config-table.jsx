import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useGetEmployeeAppointmentConfigs } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import AppointConfigRow from '../appoint-config-row';
import AppointConfigToolbar from '../appointment-toolbar';
import ConfigFiltersResult from '../appointment-filters-result';
// import AddEmegencyAppointment from '../add-emergency-appointment';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'active',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function AppointConfigView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const TABLE_HEAD = [
    { id: 'sequence_number', label: t('number') },
    { id: 'start_date', label: t('start date') },
    { id: 'end_date', label: t('end date') },
    { id: 'work_shift', label: t('work shift') },
    { id: 'work_group', label: t('work group') },
    { id: 'status', label: t('status') },
    { id: '' },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const checkAcl = useAclGuard();

  const { user } = useAuthContext();

  const { appointmentConfigData, refetch } = useGetEmployeeAppointmentConfigs(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
  );

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  const confirm = useBoolean();
  const confirmUnCancel = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: appointmentConfigData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name || filters.status !== 'active' || !!filters.startDate || !!filters.endDate;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getConfigLength = (status) =>
    appointmentConfigData.filter((item) => item.status === status).length;

  const TABS = [
    // { value: 'all', label: t('all'), color: 'default', count: appointmentConfigData.length },
    {
      value: 'active',
      label: t('active'),
      color: 'success',
      count: getConfigLength('active'),
    },
    {
      value: 'inactive',
      label: t('inactive'),
      color: 'error',
      count: getConfigLength('inactive'),
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
        await axiosInstance.delete(endpoints.appointment_configs.one(row._id));
        refetch();
        socket.emit('updated', {
          user,
          link: paths.unitservice.employees.appointmentconfig.root(
            user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
          ),
          msg: `deleted an appointment configuration <strong>[ ${row.code} ]</strong>`,
        });
        refetch();
      } catch (error) {
        socket.emit('error', { error, user, location: window.location.pathname });
        enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
        console.error(error);
      }
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user, enqueueSnackbar, curLangAr]
  );

  const handleUnCancelRow = useCallback(
    async (row) => {
      try {
        await axiosInstance.patch(`${endpoints.appointment_configs.one(row._id)}/uncancel`);
        refetch();
        socket.emit('updated', {
          user,
          link: paths.unitservice.employees.appointmentconfig.root(
            user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
          ),
          msg: `uncanceled an appointment configuration <strong>[ ${row.code} ]</strong>`,
        });
        refetch();
      } catch (error) {
        socket.emit('error', { error, user, location: window.location.pathname });
        enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
        console.error(error);
      }
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user, enqueueSnackbar, curLangAr]
  );

  const handleCancelRows = useCallback(async () => {
    try {
      await axiosInstance.patch(`${endpoints.appointment_configs.all}/cancel`, {
        ids: table.selected,
      });
      refetch();
      socket.emit('updated', {
        user,
        link: paths.unitservice.employees.appointmentconfig.root(
          user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
        ),
        msg: `canceled many appointment configurations`,
      });
      refetch();
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.pathname });
      enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
      console.error(error);
    }
    table.onUpdatePageDeleteRows({
      totalRows: appointmentConfigData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    refetch,
    dataFiltered.length,
    dataInPage.length,
    appointmentConfigData.length,
    table,
    user,
    curLangAr,
    enqueueSnackbar,
  ]);

  const handleUnCancelRows = useCallback(async () => {
    try {
      await axiosInstance.patch(`${endpoints.appointment_configs.all}/uncancel`, {
        ids: table.selected,
      });
      refetch();
      socket.emit('updated', {
        user,
        link: paths.unitservice.employees.appointmentconfig.root(
          user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
        ),
        msg: `uncanceled many appointment configurations`,
      });
      refetch();
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.pathname });
      enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
      console.error(error);
    }
    table.onUpdatePageDeleteRows({
      totalRows: appointmentConfigData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    refetch,
    dataFiltered.length,
    dataInPage.length,
    appointmentConfigData.length,
    table,
    user,
    curLangAr,
    enqueueSnackbar,
  ]);

  const handleViewRow = useCallback(
    (_id) => {
      router.push(paths.employee.appointmentconfiguration.edit(_id));
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

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('appointment configuration')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('appointment configuration') },
          ]}
          action={
            checkAcl({
              category: 'work_group',
              subcategory: 'appointment_configs',
              acl: 'create',
            }) && (
              <Button
                component={RouterLink}
                href={paths.employee.appointmentconfiguration.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('new configuration')}
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

          <AppointConfigToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            dateError={dateError}
            // serviceOptions={appointmenttypesData.map((option, idx)  => option)}
          />

          {canReset && (
            <ConfigFiltersResult
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
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row, idx) => row._id)
                )
              }
              action={
                checkAcl({
                  category: 'work_group',
                  subcategory: 'appointment_configs',
                  acl: 'update',
                }) && (
                  <>
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
                checkAcl({
                  category: 'work_group',
                  subcategory: 'appointment_configs',
                  acl: 'update',
                }) &&
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
                  rowCount={appointmentConfigData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row, idx) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, idx) => (
                      <AppointConfigRow
                        key={idx}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onCancelRow={() => handleCancelRow(row)}
                        onUnCancelRow={() => handleUnCancelRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      appointmentConfigData.length
                    )}
                  />

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
      (config) =>
        (config?.work_shift?.name_english &&
          config?.work_shift?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (config?.work_shift?.name_arabic &&
          config?.work_shift?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (config?.work_group?.name_english &&
          config?.work_group?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (config?.work_group?.name_arabic &&
          config?.work_group?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        config?._id === name ||
        JSON.stringify(config.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((config) => config.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (config) =>
          (fTimestamp(config.start_date) <= fTimestamp(startDate) &&
            fTimestamp(config.end_date) >= fTimestamp(startDate)) ||
          (fTimestamp(config.start_date) <= fTimestamp(endDate) &&
            fTimestamp(config.end_date) >= fTimestamp(endDate))
      );
    } else if (startDate) {
      inputData = inputData.filter(
        (config) =>
          fTimestamp(config.start_date) <= fTimestamp(startDate) &&
          fTimestamp(config.end_date) > fTimestamp(startDate)
      );
    }
  }

  return inputData;
}
