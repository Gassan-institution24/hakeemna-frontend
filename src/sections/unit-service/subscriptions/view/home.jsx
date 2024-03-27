import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { useGetUSLicenseMovement } from 'src/api';
import { StatusOptions } from 'src/assets/data/status-options';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { Button } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import AccountingRow from '../subscription-row'; /// edit
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'active',
};

// ----------------------------------------------------------------------

export default function UnitServicesAccountingView() {
  const { t } = useTranslate();
  const TABLE_HEAD = [
    /// to edit
    { id: 'code', label: t('code') },
    // { id: 'unit_service', label: t('Unit Service') },
    { id: 'free_subscription', label: t('free subscription') },
    { id: 'subscription', label: t('subscription') },
    { id: 'status', label: t('status') },
    { id: 'Start_date', label: t('start date') },
    { id: 'End_date', label: t('end date') },
    { id: 'Users_num', label: t('users no') },
    { id: 'price', label: t('price') },
    // { id: 'Payment_method', label: t('payment method') },
    // { id: 'Payment_frequency', label: t('payment frequency') },
    // { id: 'notes', label: t('notes') },
    { id: '', width: 88 },
  ];

  const { STATUS_OPTIONS } = StatusOptions();

  /// edit
  const table = useTable({ defaultOrderBy: 'code' });

  const { user } = useAuthContext();

  const componentRef = useRef();

  const settings = useSettingsContext();

  const router = useRouter();

  const { licenseMovements, loading } = useGetUSLicenseMovement(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
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

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters?.name || filters.status !== 'active';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleDownload = () => {
    const excelBody = dataFiltered.reduce((acc, info) => {
      acc.push({
        code: info.code,
        name: info.name_english,
        category: info.category?.name_english,
        symptoms: info.symptoms?.map((symptom, idx) => symptom?.name_english),
      });
      return acc;
    }, []);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelBody);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(file, 'unitservicesTable.xlsx'); /// edit
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

  const handleEditRow = useCallback(
    (ID) => {
      router.push(paths.superadmin.unitservices.editAccounting(ID)); /// edit
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);
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
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('subscriptions')} /// edit
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          { name: t('subscriptions') }, /// edit
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.unitservice.subscriptions.new} /// edit
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('new license')}
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
                  {tab.value === 'all' && licenseMovements.length}
                  {tab.value === 'active' &&
                    licenseMovements.filter((order) => order.status === 'active').length}
                  {tab.value === 'inactive' &&
                    licenseMovements.filter((order) => order.status === 'inactive').length}
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

        <TableContainer>
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
                //     dataFiltered.map((row, idx)  => row._id)
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
                    <AccountingRow
                      key={idx}
                      row={row}
                      filters={filters}
                      setFilters={setFilters}
                      // selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name } = filters;

  const stabilizedThis = inputData?.map((el, index, idx) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el, idx) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) =>
        (data?.free_subscription?.name_english &&
          data?.free_subscription?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        (data?.free_subscription?.name_arabic &&
          data?.free_subscription?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.subscription?.name_english &&
          data?.subscription?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.subscription?.name_arabic &&
          data?.subscription?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.Payment_method?.name_english &&
          data?.Payment_method?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.Payment_method?.name_arabic &&
          data?.Payment_method?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
