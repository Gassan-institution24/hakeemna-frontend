import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
import { useState, useCallback } from 'react';

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
import { useTranslate } from 'src/locales';
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
import { useGetStakeholderLicenseMovement } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';
import TableAnalytic from '../../patients/history/table-analytic';
import AccountingTableRow from './accounting-table-row';
import MovementTableToolbar from './accounting-table-toolbar';
import MovementTableFiltersResult from './accounting-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'Start_date', label: 'Start Date' },
  { id: 'End_date', label: 'End Date' },
  { id: 'Users_num', label: 'Users no.' },
  { id: 'price', label: 'Price' },
  { id: 'status', label: 'Status' },
  { id: 'note', label: 'note' },
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

export default function StakeholderlicenseMovementView({ stakeholderData }) {
  const theme = useTheme();

  const { t } = useTranslate();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  // const confirm = useBoolean();

  const { licenseMovements, loading, refetch } = useGetStakeholderLicenseMovement(
    stakeholderData._id
  );

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: licenseMovements,
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

  const getInvoiceLength = (status) => dataFiltered.filter((item) => item.status === status).length;

  const getInvoiceLengthForTabs = (status) => {
    const filterdData = applyFilter({
      inputData: licenseMovements,
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
      value: 'active',
      label: 'active',
      color: 'success',
      count: getInvoiceLengthForTabs('active'),
    },
    {
      value: 'inactive',
      label: 'inactive',
      color: 'warning',
      count: getInvoiceLengthForTabs('inactive'),
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

  // const handleDeleteRow = useCallback(
  //   (id) => {
  //     const deleteRow = licenseMovements.filter((row) => row.id !== id);
  //   (deleteRow);

  //     table.onUpdatePageDeleteRow(dataInPage.length);
  //   },
  //   [dataInPage.length, table, licenseMovements]
  // );

  // const handleDeleteRows = useCallback(() => {
  //   const deleteRows = licenseMovements.filter((row) => !table.selected.includes(row.id));
  // (deleteRows);

  //   table.onUpdatePageDeleteRows({
  //     totalRows: licenseMovements.length,
  //     totalRowsInPage: dataInPage.length,
  //     totalRowsFiltered: dataFiltered.length,
  //   });
  // }, [dataFiltered.length, dataInPage.length, table, licenseMovements]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.superadmin.accounting.stakeholder.edit(stakeholderData._id, id));
    },
    [router, stakeholderData._id]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.superadmin.accounting.info(id));
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
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('accounting')}
          links={[
            {
              name: t('dashboard'),
              href: paths.superadmin.root,
            },
            {
              name: t('accounting'),
              href: paths.superadmin.accounting.root,
            },
            {
              name: `${stakeholderData?.name_english || 'Stkeholder'} Accounting`,
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.superadmin.accounting.stakeholder.add(stakeholderData._id)} /// edit
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New License
            </Button>
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
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={licenseMovements.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  licenseMovements.map((row) => row.id)
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
                  rowCount={licenseMovements.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     licenseMovements.map((row) => row.id)
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
                      <AccountingTableRow
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
                    emptyRows={emptyRows(table.page, table.rowsPerPage, licenseMovements.length)}
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

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) =>
        (data?.subscription?.name_english &&
          data?.subscription?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.subscription?.name_arabic &&
          data?.subscription?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.free_subscription?.name_english &&
          data?.free_subscription?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.free_subscription?.name_arabic &&
          data?.free_subscription?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
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
        (movement) =>
          fTimestamp(movement.Start_date) <= fTimestamp(endDate) &&
          fTimestamp(movement.End_date) >= fTimestamp(startDate)
      );
    }
  }

  return inputData;
}
StakeholderlicenseMovementView.propTypes = {
  stakeholderData: PropTypes.object,
};
