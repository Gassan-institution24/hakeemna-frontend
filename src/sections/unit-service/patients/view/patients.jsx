import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { useGetUSPatient } from 'src/api';
import { useTranslate } from 'src/locales';

import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
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
} from 'src/components/table'; /// edit

import { Button } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';

import Iconify from 'src/components/iconify';

import TableDetailRow from '../patients_row'; /// edit
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'name_english', label: 'Name' },
  { id: 'name_arabic', label: 'Name in arabic' },
  // { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  status: 'active',
};

// ----------------------------------------------------------------------

export default function PatientTableView() {
  const table = useTable({ defaultOrderBy: 'code' });

  const { t } = useTranslate();

  const checkAcl = useAclGuard();

  const componentRef = useRef();

  const { user } = useAuthContext();

  const { patientsData, loading } = useGetUSPatient(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id
  );

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: patientsData,
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Patients" /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          { name: t('institution patients') }, /// edit
        ]}
        action={
          checkAcl({
            category: 'unit_service',
            subcategory: 'unit_service_info',
            acl: 'create',
          }) && (
            <Button
              component={RouterLink}
              href={paths.unitservice.patients.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('new patient')}
            </Button>
          ) /// edit
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <TableDetailToolbar
          onPrint={printHandler}
          filters={filters}
          onFilters={handleFilters}
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
          <TableSelectedAction
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            color={
              dataFiltered
                .filter((row) => table.selected.includes(row._id))
                .some((info) => info.status === 'inactive')
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
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, patientsData.length)}
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
        (data?.name_english &&
          data?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.country?.name_english &&
          data?.country?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.country?.name_arabic &&
          data?.country?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.city?.name_english &&
          data?.city?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.city?.name_arabic &&
          data?.city?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.nationality?.name_english &&
          data?.nationality?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.nationality?.name_arabic &&
          data?.nationality?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
