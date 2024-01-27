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

import { _invoices, INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
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
import { useGetUSsFeedbackes } from 'src/api/tables';

import QCTableRow from './quality-control-table-row';
import QCTableToolbar from './quality-control-table-toolbar';
import QCTableFiltersResult from './quality-control-filters-result';
import { LoadingScreen } from 'src/components/loading-screen';

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
  status: 'all',
};

// ----------------------------------------------------------------------

export default function USsFeedbacks() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const { feedbackData, loading, refetch } = useGetUSsFeedbackes();
  
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

    const resultsArr = Object.keys(results).map((key) => ({ id: key, ...results[key] }));
    return resultsArr;
  }, [feedbackData]);

  console.log('separateEachunitServiceFeedbacks', separateEachunitServiceFeedbacks());

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

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const now = new Date();

  const getInvoiceLength = (status) => dataFiltered.filter((item) => item.status === status).length;

  const getInvoiceLengthForTabs = (status) => {
    const filterdData = applyFilter({
      inputData: separateEachunitServiceFeedbacks(),
      comparator: getComparator(table.order, table.orderBy),
      filters: { ...filters, status: 'all' },
      // dateError,
    });
    if (!status) {
      return filterdData.length;
    }
    return filterdData.filter((item) => item.status === status).length;
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

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.superadmin.unitservices.feedback(id));
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

  if(loading) {return(<LoadingScreen/>)}

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Unit Services Quality Control"
          links={[
            {
              name: 'Dashboard',
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
                    .map((row) => (
                      <QCTableRow key={row.id} row={row} onViewRow={() => handleViewRow(row.id)} />
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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, rate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

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
