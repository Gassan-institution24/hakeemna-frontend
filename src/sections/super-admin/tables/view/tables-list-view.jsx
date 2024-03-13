import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';

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
  TablePaginationCustom,
} from 'src/components/table';

import TablesTableRow from '../tables-table-row';
import TablesTableToolbar from '../tables-table-toolbar';
import TablesTableFiltersResult from '../tables-table-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  // status: 'all',
  // startDate: null,
  // endDate: null,
};

export default function TablesListView() {
  const table = useTable({ defaultOrderBy: 'code' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  // const { tableData, loading } = useGetTables();

  const [filters, setFilters] = useState(defaultFilters);

  const TABLE_HEAD = [
    /// to edit
    { id: 'Table Name', label: 'Table Name' },
    { id: 'Notes', label: 'Notes' },
    { id: '', width: 190 },
  ];

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;
  const dataFiltered = applyFilter({
    inputData: [
      { tableName: 'cities', documents: [] }, //
      { tableName: 'surgeries', documents: [] }, //
      { tableName: 'diseases', documents: [] }, //
      { tableName: 'insurance_companies', documents: [] }, //
      { tableName: 'unit_service_types', documents: [] },
      { tableName: 'activities', documents: [] },
      { tableName: 'employee_types', documents: [] },
      { tableName: 'payment_methods', documents: [] },
      { tableName: 'stakeholder_types', documents: [] },
      { tableName: 'work_shifts', documents: [] },
      { tableName: 'service_types', documents: [] },
      { tableName: 'measurement_types', documents: [] },
      { tableName: 'hospital_list', documents: [] },
      { tableName: 'deduction_config', documents: [] },
      // { tableName: 'rooms', documents: [] },
      { tableName: 'specialities', documents: [] }, //
      { tableName: 'sub_specialities', documents: [] }, //
      { tableName: 'countries', documents: [] }, //
      { tableName: 'added_value_tax_GD', documents: [] },
      { tableName: 'departments', documents: [] }, //
      { tableName: 'medicines', documents: [] }, //
      { tableName: 'unit_services', documents: [] }, //
      { tableName: 'appointment_types', documents: [] }, //
      { tableName: 'free_subscriptions', documents: [] }, //
      { tableName: 'symptoms', documents: [] }, //
      { tableName: 'patients', documents: [] },
      { tableName: 'diets', documents: [] }, //
      { tableName: 'currencies', documents: [] }, //
      { tableName: 'analyses', documents: [] }, //
      { tableName: 'medical_categories', documents: [] }, //
      { tableName: 'medicines_families', documents: [] }, //
    ],
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name ;

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

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

  const handleViewRow = useCallback(
    (tablename) => {
      router.push(paths.superadmin.tables.details(tablename));
    },
    [router]
  );

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tables"
          links={[
            {
              name: 'superadmin',
              href: paths.superadmin.root,
            },
            {
              name: 'management tables',
              href: paths.superadmin.tables.list,
            },
            { name: 'tables' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <TablesTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <TablesTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered?.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    ?.map((row, idx) => (
                      <TablesTableRow
                        key={idx}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onViewRow={() => handleViewRow(row.tableName)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered?.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered?.length}
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
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData?.map((el, index, idx) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el, idx) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) => data.tableName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (order) =>
          fTimestamp(order.createdAt) >= fTimestamp(startDate) &&
          fTimestamp(order.createdAt) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
