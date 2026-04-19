import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import { ListItemText } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useGetSubscriptions } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
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
import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import CustomPopover from 'src/components/custom-popover';

import TableDetailRow from './table-details-row'; /// edit
import MobileRow from '../mobile-row';
import TableDetailToolbar from './table-details-toolbar';
import TableDetailFiltersResult from './table-details-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  // { value: 'all', label: 'all' },
  { value: 'active', label: 'active' },
  { value: 'inactive', label: 'inactive' },
];

const TABLE_HEAD = [
  /// edit
  { id: 'code', label: 'Code' },
  { id: 'name_english', label: 'Name' },
  { id: 'country', label: 'Country' },
  { id: 'city', label: 'City' },
  { id: 'US_type', label: 'unit of service Type' },
  { id: 'unit_service', label: 'unit of service' },
  { id: 'packages', label: 'Packages' },
  { id: 'period_months_offer', label: 'Period in Months' },
  { id: 'price_in_usd', label: 'Cost' },
  { id: 'status', label: 'Status' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  status: 'active',
  fees: [],
};

// ----------------------------------------------------------------------

export default function SubscriptionTableView() {
  const table = useTable({ defaultOrderBy: 'code' });

  const { t } = useTranslate();
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
  const componentRef = useRef();

  // const settings = useSettingsContext();

  const router = useRouter();

  const confirmActivate = useBoolean();
  const confirmInactivate = useBoolean();

  const { subscriptionsData, loading, refetch } = useGetSubscriptions();

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: subscriptionsData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset = !!filters?.name || filters.status !== 'active';

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
    saveAs(data, 'subscriptionsTable.xlsx'); /// edit
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
        `${endpoints.subscriptions.one(id)}/updatestatus`, /// edit
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
        `${endpoints.subscriptions.one(id)}/updatestatus`, /// edit
        { status: 'inactive' }
      );
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch]
  );

  const handleActivateRows = useCallback(async () => {
    axiosInstance.patch(
      `${endpoints.subscriptions.all}/updatestatus`, /// edit
      { status: 'active', ids: table.selected }
    );
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: subscriptionsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, subscriptionsData, refetch]);

  const handleInactivateRows = useCallback(async () => {
    axiosInstance.patch(
      `${endpoints.subscriptions.all}/updatestatus`, /// edit
      { status: 'inactive', ids: table.selected }
    );
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: subscriptionsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, subscriptionsData, refetch]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.superadmin.subscriptions.edit(id));
    },
    [router]
  );

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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={t('Subscriptions')} /// edit
          links={[
            {
              name: 'dashboard',
              href: paths.superadmin.root,
            },
            { name: t('Subscriptions') }, /// edit
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.superadmin.subscriptions.new} /// edit
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Subscription
            </Button> /// edit
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
                    {tab.value === 'all' && subscriptionsData.length}
                    {tab.value === 'active' &&
                      subscriptionsData.filter((order) => order.status === 'active').length}
                    {tab.value === 'inactive' &&
                      subscriptionsData.filter((order) => order.status === 'inactive').length}
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
                    title={row.name_english}
                    fields={[
                      {
                        label: 'Code',
                        value: row.code,
                      },
                      {
                        label: 'country',
                        value: row?.country,
                      },
                      {
                        label: 'city',
                        value: row?.city,
                      },
                      {
                        label: 'unit of service Type',
                        value: row.US_type?.name_english,
                      },
                      {
                        label: 'unit of service',
                        value: row.unit_service?.name_english,
                      },
                      {
                        label: 'Packages',
                        value: (
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.5,
                            }}
                          >
                            {row.package_appointment && <span>• Appointments</span>}
                            {row.package_accounting && <span>• Accounting</span>}
                            {row.package_docotor_report && <span>• Doctor Report</span>}
                            {row.package_final_reporting && <span>• Final Reporting</span>}
                            {row.package_old_files_Management && (
                              <span>• Old Files Management</span>
                            )}
                            {row.package_TAX_Income_reporting && (
                              <span>• Package TAX Income Reporting</span>
                            )}
                          </Box>
                        ),
                      },
                      {
                        label: 'Period in Months',
                        value: row.period_in_months,
                      },
                      {
                        label: 'Cost',
                        value: row.price_in_usd ? `$${row.price_in_usd}` : 'Free',
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
                      {
                        label: row.status === 'active' ? 'Inactivate' : 'Activate',
                        icon: row.status === 'active' ? 'ic:baseline-pause' : 'bi:play-fill',
                        color: row.status === 'active' ? 'error.main' : 'success.main',
                        onClick:
                          row.status === 'active'
                            ? () => handleInactivate(row._id)
                            : () => handleActivate(row._id),
                      },
                      {
                        label: 'Edit',
                        icon: 'fluent:edit-32-filled',
                        onClick: () => handleEditRow(row._id),
                      },
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
                // dense={table.dense}
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
                        <TableDetailRow
                          key={idx}
                          row={row}
                          filters={filters}
                          setFilters={setFilters}
                          selected={table.selected.includes(row._id)}
                          onSelectRow={() => table.onSelectRow(row._id)}
                          onActivate={() => handleActivate(row._id)}
                          onInactivate={() => handleInactivate(row._id)}
                          onEditRow={() => handleEditRow(row._id)}
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
        <Box sx={{ pt: 1, fontWeight: 600 }}>created by:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow.user_creation?.email}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>created by IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow.ip_address_user_creation}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editing Time:</Box>
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
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editor:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow.user_modification?.email}</Box>
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
  const { status, name, fees } = filters;

  const stabilizedThis = inputData.map((el, index, idx) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el, idx) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) =>
        (data?.name_english &&
          data?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.name_arabic &&
          data?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.country?.name_english &&
          data?.country?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.country?.name_arabic &&
          data?.country?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.city?.name_english &&
          data?.city?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.city?.name_arabic &&
          data?.city?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.US_type?.name_english &&
          data?.US_type?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.US_type?.name_arabic &&
          data?.US_type?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.unit_service?.name_english &&
          data?.unit_service?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.unit_service?.name_arabic &&
          data?.unit_service?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }
  if (fees.length) {
    inputData = inputData.filter((subscription) => {
      if (fees.includes('Free')) {
        return !subscription.price_in_usd;
      }
      if (fees.includes('$50 and less')) {
        return subscription.price_in_usd <= 50;
      }
      if (fees.includes('$100 and less')) {
        return subscription.price_in_usd <= 100;
      }
      if (fees.includes('More than $100')) {
        return subscription.price_in_usd > 100;
      }
      return false;
    });
  }
  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
