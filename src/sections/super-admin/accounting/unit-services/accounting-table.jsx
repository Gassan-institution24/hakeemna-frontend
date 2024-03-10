import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetUSLicenseMovements } from 'src/api';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import AccountingTableRow from './accounting-table-row';
import MovementTableToolbar from './accounting-table-toolbar';
import MovementTableFiltersResult from './accounting-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'unit_service', label: 'Unit Service' },
  { id: 'Start_date', label: 'Start Subscription' },
  { id: 'End_date', label: 'End Subscription' },
  { id: 'count', label: 'Subscriptions no.' },
  { id: 'payment', label: 'Total Payment' },
  { id: 'End_date', label: 'Status' },
  { id: 'Users_num', label: 'Users Number' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  status: 'active',
};

// ----------------------------------------------------------------------

export default function LicenseMovementsView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  const { licenseMovements, loading } = useGetUSLicenseMovements();

  const separateEachUsMovement = useCallback(() => {
    const results = {};
    const now = new Date();
    licenseMovements.forEach((movement) => {
      if (!results[movement?.unit_service?._id]) {
        results[movement?.unit_service?._id] = {};
        results[movement?.unit_service?._id].unit_service = movement?.unit_service;
      }
      if (results[movement?.unit_service?._id].count) {
        results[movement?.unit_service?._id].count += 1;
      } else {
        results[movement?.unit_service?._id].count = 1;
      }
      if (results[movement?.unit_service?._id].payments) {
        results[movement?.unit_service?._id].payments += movement.price;
      } else {
        results[movement?.unit_service?._id].payments = movement.price;
      }
      if (
        !results[movement?.unit_service?._id].start_date ||
        results[movement?.unit_service?._id].start_date > movement?.Start_date
      ) {
        results[movement?.unit_service?._id].start_date = movement?.Start_date;
      }

      if (
        !results[movement?.unit_service?._id].end_date ||
        results[movement?.unit_service?._id].end_date < movement?.End_date
      ) {
        results[movement?.unit_service?._id].end_date = movement?.End_date;
        results[movement?.unit_service?._id].user_no = movement?.Users_num;
      }
    });
    const resultsArr = Object.keys(results).map((key) => ({
      id: key,
      ...results[key],
      status:
        new Date(results[key].end_date) >= now && new Date(results[key].start_date) <= now
          ? 'active'
          : 'inactive',
    }));
    return resultsArr;
  }, [licenseMovements]);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: separateEachUsMovement(),
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.name || filters.status !== 'active';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status) => dataFiltered.filter((item) => item.status === status).length;

  const getInvoiceLengthForTabs = (status) => {
    const filterdData = applyFilter({
      inputData: separateEachUsMovement(),
      comparator: getComparator(table.order, table.orderBy),
      filters: { ...filters, status: 'all' },
      dateError,
    });
    if (!status) {
      return filterdData.length;
    }
    return filterdData.filter((item) => item.status === status).length;
  };

  const TABS = [
    // { value: 'all', label: 'All', color: 'default', count: getInvoiceLengthForTabs() },
    {
      value: 'active',
      label: 'Active',
      color: 'success',
      count: getInvoiceLength('active'),
    },
    {
      value: 'inactive',
      label: 'Inactive',
      color: 'error',
      count: getInvoiceLength('inactive'),
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

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.superadmin.accounting.unitservice.root(id));
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
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

        <MovementTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          dateError={dateError}
          // serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option.name)}
        />

        {canReset && (
          <MovementTableFiltersResult
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
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={separateEachUsMovement().length}
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
                    <AccountingTableRow
                      key={row.id}
                      row={row}
                      onViewRow={() => handleViewRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    separateEachUsMovement().length
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status } = filters;

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
        data?.unit_service._id === name ||
        JSON.stringify(data.unit_service.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  return inputData;
}
