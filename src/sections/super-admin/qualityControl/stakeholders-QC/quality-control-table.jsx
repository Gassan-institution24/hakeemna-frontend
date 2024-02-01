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

import { useTranslate } from 'src/locales';
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
import { useGetStakeholdersFeedbackes } from 'src/api/tables';

import { LoadingScreen } from 'src/components/loading-screen';
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
  status: 'all',
};

// ----------------------------------------------------------------------

export default function StakeholdersFeedbacks() {
  const theme = useTheme();

  const { t } = useTranslate();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const { feedbackData, loading, refetch } = useGetStakeholdersFeedbackes();

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

    const resultsArr = Object.keys(results).map((key) => ({ id: key, ...results[key] }));
    return resultsArr;
  }, [feedbackData]);

  console.log('separateEachStakeholderFeedbacks', separateEachStakeholderFeedbacks());

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

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const now = new Date();

  const getInvoiceLength = (status) => dataFiltered.filter((item) => item.status === status).length;

  const getInvoiceLengthForTabs = (status) => {
    const filterdData = applyFilter({
      inputData: separateEachStakeholderFeedbacks(),
      comparator: getComparator(table.order, table.orderBy),
      filters: { ...filters, status: 'all' },
      // dateError,
    });
    if (!status) {
      return filterdData.length;
    }
    return filterdData.filter((item) => item.status === status).length;
  };

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: getInvoiceLengthForTabs() },
    {
      value: 'active',
      label: 'Active',
      color: 'success',
      count: getInvoiceLength('active'),
    },
    {
      value: 'inactive',
      label: 'Inactive',
      color: 'error',
      count: getInvoiceLength('inactive'),
    },
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

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.superadmin.stakeholders.feedback(id));
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
          heading={t('Stakeholders Quality Control')}
          links={[
            {
              name: t('dashboard'),
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
            serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option.name)}
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
                    .map((row) => (
                      <QCTableRow key={row.id} row={row} onViewRow={() => handleViewRow(row.id)} />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      separateEachStakeholderFeedbacks().length
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
