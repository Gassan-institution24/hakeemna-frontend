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

// import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEconomicMovements } from 'src/api';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import InvoiceAnalytic from '../invoice-analytic';
import InvoiceTableRow from '../invoice-table-row';
import InvoiceTableToolbar from '../invoice-table-toolbar';
import InvoiceTableFiltersResult from '../invoice-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sequence_number', label: 'sequence' },
  { id: 'created_at', label: 'date' },
  { id: 'patient', label: 'patient' },
  { id: 'stakeholder', label: 'stakeholder' },
  { id: 'Balance', label: 'total amount' },
  // { id: 'sent', label: 'Sent', align: 'center' },
  { id: 'status', label: 'status' },
  { id: '' },
];

const defaultFilters = {
  employee: '',
  patient: '',
  service: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function InvoiceListView() {
  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'created_at' });
  // const confirm = useBoolean();
  const { user } = useAuthContext();

  const { t } = useTranslate();

  const [filters, setFilters] = useState(defaultFilters);

  const { economecMovementsData, lengths, totals, unitServices, patients, stakeholders } =
    useGetEconomicMovements({
      unit_service:
        user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
          ?._id,
      page: table.page || 0,
      sortBy: table.orderBy || 'created_at',
      rowsPerPage: table.rowsPerPage || 10,
      order: table.order || 'desc',
      select: 'sequence_number created_at unit_service patient employee Balance status updated_at',
      populate: [
        { path: 'unit_service', select: 'name_english name_arabic' },
        { path: 'stakeholder', select: 'name_english name_arabic' },
        { path: 'patient', select: 'name_english name_arabic' },
        { path: 'unit_service_patient', select: 'name_english name_arabic' },
      ],
      ...filters,
    });

  const dateError = isAfter(filters.startDate, filters.endDate);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !!filters.startDate || !!filters.endDate;

  const notFound = (!economecMovementsData.length && canReset) || !economecMovementsData.length;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: lengths.allLength || 0 },
    {
      value: 'paid',
      label: 'paid',
      color: 'success',
      count: lengths.paidLength || 0,
    },
    {
      value: 'installment',
      label: 'installment',
      color: 'warning',
      count: lengths.installmentLength || 0,
    },
    {
      value: 'insurance',
      label: 'insurance',
      color: 'info',
      count: lengths.insuranceLength || 0,
    },
    // {
    //   value: 'draft',
    //   label: 'draft',
    //   color: 'default',
    //   count: lengths.draftLength || 0,
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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // const handleEditRow = useCallback(
  //   (id) => {
  //     router.push(paths.unitservice.accounting.economicmovements.edit(id));
  //   },
  //   [router]
  // );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.unitservice.accounting.economicmovements.info(id));
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
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('invoices')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('invoices'),
          },
        ]}
        // action={
        //   <Button
        //     component={RouterLink}
        //     href={paths.unitservice.accounting.economicmovements.add}
        //     variant="contained"
        //     startIcon={<Iconify icon="mingcute:add-line" />}
        //   >
        //     {t('new invoice')}
        //   </Button>
        // }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

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
            <InvoiceAnalytic
              title={t('total')}
              total={lengths.allLength}
              percent={100}
              price={totals.allTotal}
              icon="solar:bill-list-bold-duotone"
              color={theme.palette.secondary.main}
            />

            <InvoiceAnalytic
              title={t('paid')}
              total={lengths.paidLength}
              percent={(lengths.paidLength / lengths.allLength) * 100}
              price={totals.paidTotal}
              icon="solar:file-check-bold-duotone"
              color={theme.palette.success.main}
            />

            <InvoiceAnalytic
              title={t('installment')}
              total={lengths.installmentLength}
              percent={(lengths.installmentLength / lengths.allLength) * 100}
              price={totals.installmentTotal}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.warning.main}
            />

            <InvoiceAnalytic
              title={t('insurance')}
              total={lengths.insuranceLength}
              percent={(lengths.insuranceLength / lengths.allLength) * 100}
              price={totals.insuranceTotal}
              icon="solar:bell-bing-bold-duotone"
              color={theme.palette.info.main}
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
              label={t(tab.label)}
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

        <InvoiceTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          dateError={dateError}
          unitServices={unitServices}
          patients={patients}
          stakeholders={stakeholders}
        />

        {canReset && (
          <InvoiceTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={economecMovementsData.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          {/* <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={economecMovementsData.length}
            onSelectAllRows={(checked) => {
              table.onSelectAllRows(
                checked,
                economecMovementsData.map((row) => row.id)
              );
            }}
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
                //     economecMovementsData.map((row) => row.id)
                //   )
                // }
              />

              <TableBody>
                {economecMovementsData.map((row) => (
                  <InvoiceTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onViewRow={() => handleViewRow(row.id)}
                    // onEditRow={() => handleEditRow(row.id)}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, lengths.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={lengths.length}
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
