import { useRef, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetUSEmployeeEngs } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { LoadingScreen } from 'src/components/loading-screen';

import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';
import EmployeeSalaryRow from './employee-salary-row';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function MonthlyReportsView() {
  const { t } = useTranslate();
  const TABLE_HEAD = [
    { id: 'sequence_number', label: t('number') },
    { id: 'name_english', label: t('name') },
    { id: 'employee_type', label: t('employee type') },
    { id: 'salary', label: t('salary') },
    { id: '', width: 88 },
  ];

  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  const { user } = useAuthContext();

  const confirmActivate = useBoolean();
  const confirmInactivate = useBoolean();

  const router = useRouter();

  const { employeesData, loading } = useGetUSEmployeeEngs(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service._id
  );

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: employeesData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const canReset = !!filters?.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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
      router.push(paths.unitservice.hr.employee(id)); /// edit
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="xl">
      <Card>
        <TableDetailToolbar
          filters={filters}
          onFilters={handleFilters}
          // onDownload={handleDownload}
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
          <TableSelectedAction
            dense={table.dense}
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
                    <EmployeeSalaryRow
                      key={idx}
                      row={row}
                      filters={filters}
                      setFilters={setFilters}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                    />
                  ))}
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
        (data?.employee?.name_english &&
          data?.employee?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.name_arabic &&
          data?.employee?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.name_english &&
          data?.employee?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.country?.name_english &&
          data?.employee?.country?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        (data?.employee?.country?.name_arabic &&
          data?.employee?.country?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.city?.name_english &&
          data?.employee?.city?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.city?.name_arabic &&
          data?.employee?.city?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.nationality?.name_english &&
          data?.employee?.nationality?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        (data?.employee?.nationality?.name_arabic &&
          data?.employee?.nationality?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        (data?.employee?.email &&
          data?.employee?.email?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  return inputData;
}
