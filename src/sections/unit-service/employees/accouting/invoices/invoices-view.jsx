import sumBy from 'lodash/sumBy';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fTimestamp } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useGetUSEconomicMovements } from 'src/api';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import MovementRow from './invoice-table-row';
import MovementsAnalytic from '../table-analytic';
import MovementTableToolbar from './invoices-table-toolbar';
import MovementTableFiltersResult from './invoices-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'unit_service', label: 'Unit Service' },
  { id: 'appointment', label: 'Appointment' },
  { id: 'stakeholder', label: 'Stakeholder' },
  { id: 'Provided_services', label: 'Provided Services' },
  // { id: 'type', label: 'Type' },
  // { id: 'hospital', label: 'Hospital' },
  { id: 'Balance', label: 'Balance' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  service: [],
  status: 'active',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function EconomicMovementsView({ employeeData }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  // const confirm = useBoolean();

  const { economecMovementsData } = useGetUSEconomicMovements(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  // console.log('employeeData', employeeData);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: economecMovementsData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // console.log('dataFiltered', dataFiltered);

  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage
  // );

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    !!filters.service.length ||
    filters.status !== 'active' ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status) => dataFiltered.filter((item) => item.status === status).length;

  const getInvoiceLengthForTabs = (status) => {
    const filterdData = applyFilter({
      inputData: economecMovementsData,
      comparator: getComparator(table.order, table.orderBy),
      filters: { ...filters, status: 'all' },
      dateError,
    });
    if (!status) {
      return filterdData.length;
    }
    return filterdData.filter((item) => item.status === status).length;
  };

  const getTotalAmount = (status) =>
    sumBy(
      dataFiltered.filter((item) => item.status === status),
      'Balance'
    );

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
    // {
    //   value: 'overdue',
    //   label: 'Overdue',
    //   color: 'error',
    //   count: getInvoiceLengthForTabs('overdue'),
    // },
    // {
    //   value: 'draft',
    //   label: 'Draft',
    //   color: 'default',
    //   count: getInvoiceLength('draft'),
    // },
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
    (inid) => {
      router.push(paths.superadmin.patients.history.invoices.edit(employeeData._id, inid));
    },
    [router, employeeData._id]
  );

  const handleViewRow = useCallback(
    (inid) => {
      router.push(paths.superadmin.patients.history.invoices.info(employeeData._id, inid));
    },
    [router, employeeData._id]
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
              <MovementsAnalytic
                title="Total"
                total={dataFiltered.length}
                percent={100}
                price={sumBy(dataFiltered, 'Balance')}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <MovementsAnalytic
                title="Paid"
                total={getInvoiceLength('paid')}
                percent={getPercentByStatus('paid')}
                price={getTotalAmount('paid')}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.success.main}
              />

              <MovementsAnalytic
                title="Pending"
                total={getInvoiceLength('pending')}
                percent={getPercentByStatus('pending')}
                price={getTotalAmount('pending')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
              />
              {/* 
              <MovementsAnalytic
                title="Overdue"
                total={getInvoiceLength('overdue')}
                percent={getPercentByStatus('overdue')}
                price={getTotalAmount('overdue')}
                icon="solar:bell-bing-bold-duotone"
                color={theme.palette.error.main}
              /> */}
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

          <MovementTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            dateError={dateError}
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
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={economecMovementsData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  economecMovementsData.map((row, idx)  => row.id)
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
                  rowCount={economecMovementsData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     economecMovementsData.map((row, idx)  => row.id)
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
                      <MovementRow
                        key={idx}
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
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      economecMovementsData.length
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
      (data) =>
        (data?.unit_service?.name_english &&
          data?.unit_service?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.unit_service?.name_arabic &&
          data?.unit_service?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.appointment?.name_english &&
          data?.appointment?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.appointment?.name_arabic &&
          data?.appointment?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.stakeholder?.name_english &&
          data?.stakeholder?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.stakeholder?.name_arabic &&
          data?.stakeholder?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  // if (service.length) {
  //   inputData = inputData.filter((invoice) =>
  //     invoice.items.some((filterItem) => service.includes(filterItem.service))
  //   );
  // }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (invoice) =>
          fTimestamp(invoice.created_at) >= fTimestamp(startDate) &&
          fTimestamp(invoice.created_at) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
EconomicMovementsView.propTypes = {
  employeeData: PropTypes.object,
};
