import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { getDemoState, DEMO_ACCOUNT_TYPES, filterByAccountType } from 'src/utils/demo';

import socket from 'src/socket';
import { useTranslate } from 'src/locales';
import { useGetUsers, extendDemoAccount } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
// import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { fDateTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import CustomPopover from 'src/components/custom-popover';

import TableDetailRow from '../table-details-row'; /// edit
import MobileRow from '../../mobile-row';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  // { value: 'all', label: 'all' },
  { value: 'active', label: 'active' },
  { value: 'inactive', label: 'inactive' },
];

const TABLE_HEAD = [
  /// to edit
  { id: 'code', label: 'code' },
  { id: 'name', label: 'username' },
  { id: 'email', label: 'email' },
  { id: 'role', label: 'role' },
  { id: 'online', label: 'online' },
  { id: 'last_online', label: 'last view' },
  // Demo/trial columns. Order here must match the cell order in table-details-row.jsx.
  { id: 'isDemo', label: 'account type' },
  { id: 'demoExpiresAt', label: 'demo expiry' },
  { id: 'status', label: 'status' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: 'all',
  status: 'active',
  // 'all' keeps the pre-existing result set unchanged by default.
  accountType: DEMO_ACCOUNT_TYPES.ALL,
};

// ----------------------------------------------------------------------

export default function UsersTableView() {
  /// edit
  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
  // const settings = useSettingsContext();

  const router = useRouter();

  const confirmActivate = useBoolean();
  const confirmInactivate = useBoolean();

  // Demo trial extension dialog state.
  const extendDemo = useBoolean();
  const [demoRowToExtend, setDemoRowToExtend] = useState(null);
  const [extendDays, setExtendDays] = useState('3');
  const [extending, setExtending] = useState(false);

  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();

  const { usersData, loading, refetch } = useGetUsers();

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: usersData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset =
    !!filters?.name ||
    filters.role !== 'all' ||
    filters.status !== 'active' ||
    filters.accountType !== DEMO_ACCOUNT_TYPES.ALL;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownload = () => {
    const excelBody = dataFiltered.reduce((acc, data) => {
      acc.push({
        code: data.code,
        name: data.name_english,
        country: data.country?.name_english,
        status: data.status,
      });
      return acc;
    }, []);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelBody);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, 'countriesTable.xlsx'); /// edit
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

  const handleActivate = useCallback(
    async (id) => {
      await axiosInstance.patch(
        `${endpoints.countries.one(id)}/updatestatus`, /// to edit
        { status: 'active' }
      );
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch]
  );

  const handleInactivate = useCallback(
    async (id) => {
      await axiosInstance.patch(
        `${endpoints.countries.one(id)}/updatestatus`, /// to edit
        { status: 'inactive' }
      );
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch]
  );

  const handleActivateRows = useCallback(async () => {
    axiosInstance.patch(
      `${endpoints.countries.all}/updatestatus`, /// to edit
      { status: 'active', ids: table.selected }
    );
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: usersData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, usersData, refetch]);

  const handleInactivateRows = useCallback(async () => {
    axiosInstance.patch(
      `${endpoints.countries.all}/updatestatus`, /// edit
      { status: 'inactive', ids: table.selected }
    );
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: usersData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, usersData, refetch]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.superadmin.users.edit(id)); /// edit
    },
    [router]
  );

  // ── Demo trial extension ────────────────────────────────────────────────
  // Opens a small dialog rather than extending straight from the menu, so the super admin can
  // choose the number of days. The backend re-activates the user, the demo clinic and the
  // licence window in one call (see extendDemoUser in utils/demoAccount.js).
  const handleOpenExtendDemo = useCallback(
    (row) => {
      setDemoRowToExtend(row);
      setExtendDays('3');
      extendDemo.onTrue();
    },
    [extendDemo]
  );

  const handleExtendDemo = useCallback(async () => {
    if (!demoRowToExtend) return;

    setExtending(true);
    try {
      await extendDemoAccount(demoRowToExtend._id, Number(extendDays) || 3);
      enqueueSnackbar(t('Demo account extended'));
      extendDemo.onFalse();
      setDemoRowToExtend(null);
      refetch();
    } catch (error) {
      // The axios interceptor rejects with the raw server payload, not an AxiosError.
      enqueueSnackbar(
        (typeof error === 'string' ? error : error?.message) || t('Something went wrong'),
        { variant: 'error' }
      );
    } finally {
      setExtending(false);
    }
  }, [demoRowToExtend, extendDays, extendDemo, refetch, enqueueSnackbar, t]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // const handleViewRow = useCallback(
  //   (id) => {
  //     router.push(paths.dashboard.order.details(id));
  //   },
  //   [router]
  // );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  /* eslint-disable */
  useEffect(() => {
    socket.on('employeeStatusUpdated', () => {
      refetch();
    });
  }, []);
  /* eslint-enable */

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading="Users" /// edit
          links={[
            {
              name: 'dashboard',
              href: paths.superadmin.root,
            },
            { name: 'users' }, /// edit
          ]}
          action={
            <Stack direction="row" spacing={1}>
              {/* Demo provisioning is a separate flow: it creates a clinic, an owner engagement
                  and a 3-day licence window, not just a user row. */}
              <Button
                component={RouterLink}
                href={paths.superadmin.users.demoNew}
                variant="outlined"
                color="warning"
                startIcon={<Iconify icon="mdi:clock-fast" />}
              >
                {t('New demo account')}
              </Button>

              <Button
                component={RouterLink}
                href={paths.superadmin.users.new} /// edit
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New user
              </Button>
            </Stack>
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
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab, idx) => (
              <Tab
                key={idx}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'inactive' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && usersData.length}
                    {tab.value === 'active' &&
                      usersData.filter((order) => order.status === 'active').length}
                    {tab.value === 'inactive' &&
                      usersData.filter((order) => order.status === 'inactive').length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <TableDetailToolbar
            onPrint={printHandler}
            filters={filters}
            onFilters={handleFilters}
            onDownload={handleDownload}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
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

          {isMobile ? (
            <>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <MobileRow
                    key={row._id}
                    title={row.userName}
                    fields={[
                      {
                        label: 'Code',
                        value: row.code,
                      },
                      {
                        label: 'Email',
                        value: row.email,
                      },
                      {
                        label: 'Role',
                        value: row.role,
                      },
                      {
                        label: 'Online',
                        value: (
                          <Iconify
                            icon={row.online ? 'noto:green-circle' : 'noto:red-circle'}
                            sx={{ width: 12, height: 12 }}
                          />
                        ),
                      },
                      {
                        label: 'Last View',
                        value: row.last_online ? new Date(row.last_online).toLocaleString() : '-',
                      },
                      {
                        label: t('account type'),
                        value: (
                          <Label variant="soft" color={getDemoState(row).isDemo ? 'warning' : 'default'}>
                            {t(getDemoState(row).isDemo ? 'demo account' : 'normal account')}
                          </Label>
                        ),
                      },
                      {
                        label: t('demo expiry'),
                        value: getDemoState(row).isDemo ? (
                          <Label
                            variant="soft"
                            color={getDemoState(row).expired ? 'error' : 'success'}
                          >
                            {`${fDateTime(getDemoState(row).expiresAt)} · ${t(
                              getDemoState(row).expired ? 'Expired' : 'Active'
                            )}`}
                          </Label>
                        ) : (
                          '-'
                        ),
                      },
                      {
                        label: 'Status',
                        value: (
                          <Label
                            variant="soft"
                            color={
                              (row.status === 'active' && 'success') ||
                              (row.status === 'inactive' && 'error') ||
                              'default'
                            }
                          >
                            {row.status}
                          </Label>
                        ),
                      },
                    ]}
                    actions={[
                      ...(getDemoState(row).isDemo
                        ? [
                            {
                              label: t('Extend demo'),
                              icon: 'mdi:calendar-plus',
                              onClick: () => handleOpenExtendDemo(row),
                            },
                          ]
                        : []),
                      {
                        label: 'DDL',
                        icon: 'carbon:data-quality-definition',
                        onClick: (event) => {
                          setDdlRow(row);
                          setDdlAnchorEl(event.currentTarget);
                        },
                      },
                    ]}
                  />
                ))}
            </>
          ) : (
            <TableContainer>
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
                  <>
                    {dataFiltered
                      .filter((row) => table.selected.includes(row._id))
                      .some((data) => data.status === 'inactive') ? (
                      <Tooltip title="Activate all">
                        <IconButton color="primary" onClick={confirmActivate.onTrue}>
                          <Iconify icon="codicon:run-all" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Inactivate all">
                        <IconButton color="error" onClick={confirmInactivate.onTrue}>
                          <Iconify icon="iconoir:pause-solid" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                }
                color={
                  dataFiltered
                    .filter((row) => table.selected.includes(row._id))
                    .some((data) => data.status === 'inactive')
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
                    // onSelectAllRows={(checked) =>
                    //   table.onSelectAllRows(
                    //     checked,
                    //     dataFiltered.map((row, idx) => row._id)
                    //   )
                    // }
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row, idx) => (
                        <TableDetailRow
                          key={idx}
                          row={row}
                          selected={table.selected.includes(row._id)}
                          onSelectRow={() => table.onSelectRow(row._id)}
                          onActivate={() => handleActivate(row._id)}
                          onInactivate={() => handleInactivate(row._id)}
                          onEditRow={() => handleEditRow(row._id)}
                          onExtendDemo={() => handleOpenExtendDemo(row)}
                        />
                      ))}
                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          )}

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
        open={confirmInactivate.value}
        onClose={confirmInactivate.onFalse}
        title="Inactivate"
        content={
          <>
            Are you sure want to Inactivate <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleInactivateRows();
              confirmInactivate.onFalse();
            }}
          >
            Inactivate
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmActivate.value}
        onClose={confirmActivate.onFalse}
        title="Activate"
        content={
          <>
            Are you sure want to Activate <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleActivateRows();
              confirmActivate.onFalse();
            }}
          >
            Activate
          </Button>
        }
      />
      {/* Extend a demo trial. Days is capped server-side (1-365) so a demo cannot quietly
          become an unlimited free licence. */}
      <Dialog open={extendDemo.value} onClose={extendDemo.onFalse} fullWidth maxWidth="xs">
        <DialogTitle>{t('Extend demo')}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {demoRowToExtend?.email}
            </Typography>

            <TextField
              fullWidth
              type="number"
              label={t('days')}
              value={extendDays}
              onChange={(event) => setExtendDays(event.target.value)}
              inputProps={{ min: 1, max: 365 }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={extendDemo.onFalse}>
            {t('cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            color="warning"
            loading={extending}
            onClick={handleExtendDemo}
          >
            {t('Extend demo')}
          </LoadingButton>
        </DialogActions>
      </Dialog>

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
            <Box sx={{ fontWeight: 600 }}>Creation Time:</Box>
            <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{fDateTime(ddlRow.created_at)}</Box>
            <Box sx={{ pt: 1, fontWeight: 600 }}>created by:</Box>
            <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow.user_creation?.email}</Box>

            <Box sx={{ pt: 1, fontWeight: 600 }}>created by IP:</Box>
            <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
              {ddlRow.ip_address_user_creation}
            </Box>
            <Box sx={{ pt: 1, fontWeight: 600 }}>Editing Time:</Box>
            <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{fDateTime(ddlRow.updated_at)}</Box>
            <Box sx={{ pt: 1, fontWeight: 600 }}>Editor:</Box>
            <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
              {ddlRow.user_modification?.email}
            </Box>
            <Box sx={{ pt: 1, fontWeight: 600 }}>Editor IP:</Box>
            <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
              {ddlRow.ip_address_user_modification}
            </Box>
            <Box sx={{ pt: 1, fontWeight: 600 }}>Modifications No: {ddlRow.modifications_nums}</Box>
          </>
        )}
      </CustomPopover>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, role, accountType } = filters;

  const stabilizedThis = inputData.map((el, index, idx) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el, idx) => el[0]);

  if (role !== 'all') {
    inputData = inputData.filter((data) => data.role === role);
  }

  if (name) {
    inputData = inputData.filter(
      (data) =>
        (data?.userName && data?.userName?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.email && data?.email?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  // Demo vs normal. Delegated to src/utils/demo.js so the rule lives in one place.
  inputData = filterByAccountType(inputData, accountType);

  return inputData;
}
