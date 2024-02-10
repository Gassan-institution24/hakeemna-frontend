import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';

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
import { useGetPatientIncomePaymentControl } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';
import PaymentControlAnalytic from '../table-analytic';
import PaymentControlRow from './payment-control-row';
import PaymentControlTableToolbar from './payment-table-toolbar';
import PaymentTableFiltersResult from './payment-control-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'unit_service', label: 'Unit Service' },
  { id: 'stakeholder', label: 'Stakeholder' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'required_amount', label: 'Required Amount' },
  { id: 'due_date', label: 'Due Date' },
  { id: 'amount', label: 'Amount' },
  { id: 'recieved_real_date', label: 'Recieved Real Date' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  service: [],
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function IncomePaymentControlView({ patientData }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  // const confirm = useBoolean();

  const { incomePaymentData, loading, refetch } = useGetPatientIncomePaymentControl(
    patientData._id
  );

  const unitServiceOptions = incomePaymentData.reduce((arr, data) => {
    // Check if the name_english is not already in the array
    if (!arr.includes(data.unit_service.name_english)) {
      // Add the name_english to the array
      arr.push(data.unit_service.name_english);
    }
    return arr;
  }, []);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: incomePaymentData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage
  // );

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    !!filters.service.length ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLengthForTabs = (status) => {
    const filterdData = applyFilter({
      inputData: incomePaymentData,
      comparator: getComparator(table.order, table.orderBy),
      filters: { ...filters, status: 'all' },
      dateError,
    });
    if (!status) {
      return filterdData.length;
    }
    return filterdData.filter((item) => item.status === status).length;
  };

  const getInvoiceLength = (status) =>
    status ? dataFiltered.filter((item) => item.status === status).length : dataFiltered.length;

  const getTotalAmount = (status) =>
    sumBy(
      dataFiltered.filter((item) => item.status === status),
      status === 'paid' ? 'amount' : 'required_amount'
    );
  const getSumTotal = dataFiltered.reduce((sum, item) => {
    const amount = typeof item.amount === 'number' ? item.amount : 0;
    const requiredAmount = typeof item.required_amount === 'number' ? item.required_amount : 0;
    return sum + amount - requiredAmount;
  }, 0);

  const getPercentByStatus = (status) => (getInvoiceLength(status) / dataFiltered.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: getInvoiceLengthForTabs() },
    {
      value: 'paid',
      label: 'Paid',
      color: 'success',
      count: getInvoiceLengthForTabs('paid'),
    },
    {
      value: 'pending',
      label: 'Pending',
      color: 'warning',
      count: getInvoiceLengthForTabs('pending'),
    },
    {
      value: 'overdue',
      label: 'Overdue',
      color: 'error',
      count: getInvoiceLengthForTabs('overdue'),
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

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.superadmin.patients.history.payment.edit(patientData._id, id));
    },
    [router, patientData._id]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.superadmin.patients.history.payment.info(patientData._id, id));
    },
    [router, patientData._id]
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <PaymentControlAnalytic
                title="Total"
                total={getInvoiceLength()}
                percent={100}
                price={getSumTotal}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <PaymentControlAnalytic
                title="Paid"
                total={getInvoiceLength('paid')}
                percent={getPercentByStatus('paid')}
                price={getTotalAmount('paid')}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.success.main}
              />

              <PaymentControlAnalytic
                title="Pending"
                total={getInvoiceLength('pending')}
                percent={getPercentByStatus('pending')}
                price={getTotalAmount('pending')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
              />

              <PaymentControlAnalytic
                title="Overdue"
                total={getInvoiceLength('overdue')}
                percent={getPercentByStatus('overdue')}
                price={getTotalAmount('overdue')}
                icon="solar:bell-bing-bold-duotone"
                color={theme.palette.error.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

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

          <PaymentControlTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            dateError={dateError}
            serviceOptions={unitServiceOptions.map((option) => option)}
          />

          {canReset && (
            <PaymentTableFiltersResult
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
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={incomePaymentData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  incomePaymentData.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            /> */}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={incomePaymentData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     incomePaymentData.map((row) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <PaymentControlRow
                        key={row.id}
                        row={row}
                        // selected={table.selected.includes(row.id)}
                        // onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        // onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, incomePaymentData.length)}
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

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) =>
        (data?.unit_service?.name_english &&
          data?.unit_service?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.unit_service?.name_arabic &&
          data?.unit_service?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.stakeholder?.name_english &&
          data?.stakeholder?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.stakeholder?.name_arabic &&
          data?.stakeholder?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data?.invoice?.code) === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((payment) => payment.status === status);
  }

  if (service.length) {
    inputData = inputData.filter(
      (payment) => payment.unit_service && service.includes(payment.unit_service.name_english)
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (payment) =>
          (fTimestamp(payment.due_date) >= fTimestamp(startDate) &&
            fTimestamp(payment.due_date) <= fTimestamp(endDate)) ||
          (fTimestamp(payment.recieved_real_date) >= fTimestamp(startDate) &&
            fTimestamp(payment.recieved_real_date) <= fTimestamp(endDate))
      );
    }
  }

  return inputData;
}
IncomePaymentControlView.propTypes = {
  patientData: PropTypes.object,
};
