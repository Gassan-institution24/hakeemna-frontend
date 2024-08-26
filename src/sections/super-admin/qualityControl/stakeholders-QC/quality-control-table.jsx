import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetStakeholdersFeedbackes } from 'src/api';

import Scrollbar from 'src/components/scrollbar';
// import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import QCTableRow from './quality-control-table-row';
import QCTableToolbar from './quality-control-table-toolbar';
import QCTableFiltersResult from './quality-control-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'stakeholder', label: 'Stakeholder' },
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

export default function StakeholdersFeedbacks() {
  const { t } = useTranslate();

  // const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  const { feedbackData, loading } = useGetStakeholdersFeedbackes();

  const separateEachStakeholderFeedbacks = useCallback(() => {
    const results = {};

    feedbackData.forEach((feedback) => {
      const stakeholderId = feedback.stakeholder._id;

      if (!results[stakeholderId]) {
        results[stakeholderId] = { stakeholder: feedback.stakeholder };
      }

      results[stakeholderId].count = (results[stakeholderId].count || 0) + 1;
      results[stakeholderId].rate = (results[stakeholderId].rate || 0) + feedback.Rate;

      if (feedback.status === 'read') {
        results[stakeholderId].read = (results[stakeholderId].read || 0) + 1;
      } else {
        results[stakeholderId].notRead = (results[stakeholderId].notRead || 0) + 1;
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
    inputData: separateEachStakeholderFeedbacks(),
    comparator: getComparator(table.order, table.orderBy),
    filters,
    // dateError,
  });

  const canReset = !!filters.name || filters.status !== 'active';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // const getInvoiceLength = (status) => dataFiltered.filter((item) => item.status === status).length;

  // const getInvoiceLengthForTabs = (status) => {
  //   const filterdData = applyFilter({
  //     inputData: separateEachStakeholderFeedbacks(),
  //     comparator: getComparator(table.order, table.orderBy),
  //     filters: { ...filters, status: 'all' },
  //     // dateError,
  //   });
  //   if (!status) {
  //     return filterdData.length;
  //   }
  //   return filterdData.filter((item) => item.status === status).length;
  // };

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
      router.push(paths.superadmin.stakeholders.feedback(id));
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
        heading={t('Stakeholders Quality Control')}
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: t('Stakeholders Quality Control'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card>
        <QCTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          // dateError={dateError}
        />

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
                rowCount={separateEachStakeholderFeedbacks().length}
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
      (data) =>
        (data?.stakeholder?.name_english &&
          data?.stakeholder?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.stakeholder?.name_arabic &&
          data?.stakeholder?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?.stakeholder._id === name ||
        JSON.stringify(data.stakeholder.code) === name
    );
  }
  if (rate.length) {
    inputData = inputData.filter((feedback) =>
      rate.includes(Math.round(feedback.rate / feedback.count))
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  return inputData;
}
