import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetUSsFeedbackes } from 'src/api';

import Scrollbar from 'src/components/scrollbar';
// import { useSettingsContext } from 'src/components/settings';
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
} from 'src/components/table';

import QCTableRow from './quality-control-table-row';
import QCTableToolbar from './quality-control-table-toolbar';
import QCTableFiltersResult from './quality-control-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'unit_service', label: 'Unit Service' },
  { id: 'rate', label: 'Rate' },
  { id: 'count', label: 'Rates no.' },
  { id: 'read', label: 'Read Rates' },
  { id: 'notRead', label: 'Not Read Rates' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  rate: [],
  status: 'active',
};

// ----------------------------------------------------------------------

export default function USsFeedbacks() {
  // const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  const { feedbackData, loading } = useGetUSsFeedbackes();

  const separateEachunitServiceFeedbacks = useCallback(() => {
    const results = {};

    feedbackData.forEach((feedback) => {
      const unitServiceId = feedback.unit_service._id;

      if (!results[unitServiceId]) {
        results[unitServiceId] = { unit_service: feedback.unit_service };
      }

      results[unitServiceId].count = (results[unitServiceId].count || 0) + 1;
      results[unitServiceId].rate = (results[unitServiceId].rate || 0) + feedback.Rate;

      if (feedback.status === 'read') {
        results[unitServiceId].read = (results[unitServiceId].read || 0) + 1;
      } else {
        results[unitServiceId].notRead = (results[unitServiceId].notRead || 0) + 1;
      }
    });

    const resultsArr = Object.keys(results).map((key, idx) => ({ id: key, ...results[key] }));
    return resultsArr;
  }, [feedbackData]);

  const [filters, setFilters] = useState(defaultFilters);

  // const dateError =
  //   filters.startDate && filters.endDate
  //     ? filters.startDate.getTime() > filters.endDate.getTime()
  //     : false;

  const dataFiltered = applyFilter({
    inputData: separateEachunitServiceFeedbacks(),
    comparator: getComparator(table.order, table.orderBy),
    filters,
    // dateError,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.name || filters.status !== 'active';

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
      router.push(paths.superadmin.unitservices.feedback(id));
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
      <CustomBreadcrumbs
        heading="Unit Services Quality Control"
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Unit Services Quality Control',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card>
        <QCTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <QCTableFiltersResult
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
                rowCount={separateEachunitServiceFeedbacks().length}
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
                    <QCTableRow key={idx} row={row} onViewRow={() => handleViewRow(row.id)} />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    separateEachunitServiceFeedbacks().length
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

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, rate } = filters;

  const stabilizedThis = inputData.map((el, index, idx) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el, idx) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (feedback) =>
        (feedback?.unit_service?.name_english &&
          feedback?.unit_service?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (feedback?.unit_service?.name_arabic &&
          feedback?.unit_service?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        feedback?.unit_service._id === name ||
        JSON.stringify(feedback.unit_service.code) === name
    );
  }
  if (rate.length) {
    inputData = inputData.filter((feedback) =>
      rate.includes(Math.round(feedback.rate / feedback.count))
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((feedback) => feedback.status === status);
  }

  return inputData;
}
