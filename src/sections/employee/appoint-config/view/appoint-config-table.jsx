import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { socket } from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';

import ACLGuard from 'src/auth/guard/acl-guard';
import { fTimestamp } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
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
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import { endpoints } from 'src/utils/axios';
import axiosHandler from 'src/utils/axios-handler';
import AppointConfigRow from '../appoint-config-row';
import AppointConfigToolbar from '../appointment-toolbar';
import ConfigFiltersResult from '../appointment-filters-result';
// import AddEmegencyAppointment from '../appointments/add-emergency-appointment';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function AppointConfigView({ appointmentConfigData, refetch }) {
  const { t } = useTranslate();
  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'start_date', label: t('start date') },
    { id: 'end_date', label: t('end date') },
    { id: 'work_shift', label: t('work shift') },
    { id: 'work_group', label: t('work group') },
    { id: 'status', label: t('status') },
    { id: '' },
  ];

  const { user } = useAuthContext();

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const addModal = useBoolean();
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
    !!filters.name || filters.status !== 'all' || !!filters.startDate || !!filters.endDate;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getConfigLength = (status) =>
    appointmentConfigData.filter((item) => item.status === status).length;

  const TABS = [
    { value: 'all', label: t('all'), color: 'default', count: appointmentConfigData.length },
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
        await axiosHandler({
          method: 'PATCH',
          path: `${endpoints.tables.appointment(row._id)}/cancel`,
        });
        socket.emit('updated', {
          user,
          link: paths.unitservice.employees.appointmentconfig.root(
            user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id
          ),
          msg: `canceled an appointment configuration <strong>[ ${row.code} ]</strong>`,
        });
      } catch (e) {
      socket.emit('error',{error:e,user,location:window.location.href})
        console.error(e);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user]
  );

  const handleUnCancelRow = useCallback(
    async (row) => {
      try {
        await axiosHandler({
          method: 'PATCH',
          path: `${endpoints.tables.appointment(row._id)}/uncancel`,
        });
        socket.emit('updated', {
          user,
          link: paths.unitservice.employees.appointmentconfig.root(
            user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id
          ),
          msg: `uncanceled an appointment configuration <strong>[ ${row.code} ]</strong>`,
        });
      } catch (e) {
      socket.emit('error',{error:e,user,location:window.location.href})
        console.error(e);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user]
  );

  const handleCancelRows = useCallback(async () => {
    try {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.appointments}/cancel`,
        data: { ids: table.selected },
      });
      socket.emit('updated', {
        user,
        link: paths.unitservice.employees.appointmentconfig.root(
          user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id
        ),
        msg: `canceled many appointment configurations`,
      });
    } catch (e) {
      socket.emit('error',{error:e,user,location:window.location.href})
      console.error(e);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: appointmentConfigData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [refetch, dataFiltered.length, dataInPage.length, appointmentConfigData.length, table, user]);
  const handleUnCancelRows = useCallback(async () => {
    try {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.appointments}/uncancel`,
        data: { ids: table.selected },
      });
      socket.emit('updated', {
        user,
        link: paths.unitservice.employees.appointmentconfig.root(
          user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id
        ),
        msg: `uncanceled an appointment configurations`,
      });
    } catch (e) {
      socket.emit('error',{error:e,user,location:window.location.href})
      console.error(e);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: appointmentConfigData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [refetch, dataFiltered.length, dataInPage.length, appointmentConfigData.length, table, user]);
  const handleAdd = useCallback(() => {
    router.push(paths.employee.appointmentconfiguration.new);
  }, [router]);

  const handleViewRow = useCallback(
    (_id) => {
      router.push(paths.employee.appointmentconfiguration.details(_id));
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
          heading={t('appointment configuration')} /// edit
          links={[
            {
              name: t('dashboard'),
              href: paths.employee.root,
            },
            { name: t('appointment configuration') },
          ]}
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
            onAdd={handleAdd}
            //
            dateError={dateError}
            // serviceOptions={appointmenttypesData.map((option) => option)}
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
                  dataFiltered.map((row) => row._id)
                )
              }
              action={
                ACLGuard({
                  category: 'employee',
                  subcategory: 'appointment_configs',
                  acl: 'update',
                }) && (
                  <>
                    {dataFiltered
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
                    )}
                  </>
                )
              }
              color={
                ACLGuard({
                  category: 'employee',
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
                      dataFiltered.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <AppointConfigRow
                        key={row._id}
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

      {/* <AddEmegencyAppointment open={addModal.value} onClose={addModal.onFalse} /> */}

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
  const { name, status, types, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

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
AppointConfigView.propTypes = {
  appointmentConfigData: PropTypes.array,
  refetch: PropTypes.func,
};
