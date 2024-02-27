import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
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
import { useParams } from 'src/routes/hooks';

import { useGetStakeholderFeedbacks } from 'src/api';

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
import { useTranslate } from 'src/locales';

import FeedbackRow from './feedback-row'; /// edit
import FeedbackToolbar from './feedback-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  /// to edit
  { id: 'code', label: 'Code' },
  { id: 'title', label: 'Title' },
  { id: 'status', label: 'Status' },
  { id: 'Body', label: 'Body' },
  { id: 'Rate', label: 'Rate' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  status: 'all',
  rate: [],
};

// ----------------------------------------------------------------------
const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'read', label: 'Read' },
  { value: 'unread', label: 'Unread' },
];

export default function StakeholderFeedbackView({ stakeholderData }) {
  /// edit
  const table = useTable({ defaultOrderBy: 'code' });

  const params = useParams();
  const { id } = params;

  const componentRef = useRef();

  const settings = useSettingsContext();

  const { feedbackData, loading } = useGetStakeholderFeedbacks(id);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: feedbackData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const { t } = useTranslate();

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters?.name || filters.status !== 'all' || filters.rate.length > 0;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });
  // console.log(stakeholderData);
  const handleDownload = () => {
    const excelBody = dataFiltered.reduce((acc, info) => {
      acc.push({
        code: info.code,
        name: info.name_english,
        category: info.category?.name_english,
        symptoms: info.symptoms?.map((symptom) => symptom?.name_english),
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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );
  const stakeholderName = stakeholderData.name_english || 'Stakeholder';

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`${stakeholderName} feedback`} /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: t('stakeholders'),
            href: paths.superadmin.stakeholders.root,
          },
          { name: t(`${stakeholderName} feedback`) }, /// edit
        ]}
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
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={
                    (tab.value === 'read' && 'success') ||
                    (tab.value === 'unread' && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all' && feedbackData.length}
                  {tab.value === 'read' &&
                    feedbackData.filter((order) => order.status === 'read').length}
                  {tab.value === 'unread' &&
                    feedbackData.filter((order) => order.status === 'unread').length}
                </Label>
              }
            />
          ))}
        </Tabs>
        <FeedbackToolbar
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
                //     dataFiltered.map((row) => row._id)
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
                    <FeedbackRow
                      key={row._id}
                      row={row}
                      filters={filters}
                      setFilters={setFilters}
                      // selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      // onEditRow={() => handleEditRow(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, feedbackData.length)}
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
  const { status, name, rate } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) =>
        (data?.department?.name_english &&
          data?.department?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.department?.name_arabic &&
          data?.department?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.appointment?.name_english &&
          data?.appointment?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.appointment?.name_arabic &&
          data?.appointment?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.name_english &&
          data?.employee?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.name_arabic &&
          data?.employee?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.title && data?.title?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }
  if (rate.length > 0) {
    inputData = inputData.filter((order) => rate.includes(order.Rate));
  }

  return inputData;
}
StakeholderFeedbackView.propTypes = {
  stakeholderData: PropTypes.object,
};
