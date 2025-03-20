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

import { useGetSystemErrors } from 'src/api';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
// // import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import axiosInstance, { endpoints } from 'src/utils/axios';

import ErrosRow from './errors-row'; /// edit
import FeedbackToolbar from './errors-toolbar';
import TableDetailFiltersResult from './table-details-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  /// to edit
  // { id: 'code', label: 'Code' },
  { id: 'Error Code', label: 'code' },
  { id: 'Error Code', label: 'method' },
  { id: 'Error Code', label: 'URL' },
  { id: 'Error Message', label: 'message' },
  { id: 'status', label: 'status' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  status: 'not read',
  errorCodes: [],
};

// ----------------------------------------------------------------------
const STATUS_OPTIONS = [
  // { value: 'all', label: 'All' },
  { value: 'read', label: 'Read' },
  { value: 'not read', label: 'not read' },
];

export default function DoctornaSystemErrorsView() {
  /// edit
  const table = useTable({ defaultOrderBy: 'code', defaultOrder: 'desc' });

  const componentRef = useRef();

  // // const settings = useSettingsContext();

  const { systemErrorsData, loading, refetch } = useGetSystemErrors();

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: systemErrorsData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const codeOptions = Array.from(new Set(systemErrorsData.map((data, idx) => data.error_code)));

  const canReset =
    !!filters?.name || filters.status !== 'not read' || filters.errorCodes?.length > 0;

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleRead = useCallback(
    async (id) => {
      await axiosInstance.patch(
        `${endpoints.systemErrors.one(id)}/updatestatus`, /// edit
        { status: 'read' }
      );
      refetch();
      table.onUpdatePageDeleteRow(dataInPage?.length);
    },
    [dataInPage?.length, table, refetch]
  );

  const handleUnread = useCallback(
    async (id) => {
      await axiosInstance.patch(
        `${endpoints.systemErrors.one(id)}/updatestatus`, /// edit
        { status: 'not read' }
      );
      refetch();
      table.onUpdatePageDeleteRow(dataInPage?.length);
    },
    [dataInPage?.length, table, refetch]
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="xl">
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
                    (tab.value === 'read' && 'success') ||
                    (tab.value === 'not read' && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all' && systemErrorsData?.length}
                  {tab.value === 'read' &&
                    systemErrorsData.filter((order) => order.status === 'read')?.length}
                  {tab.value === 'not read' &&
                    systemErrorsData.filter((order) => order.status === 'not read')?.length}
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
          codeOptions={codeOptions}
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
            results={dataFiltered?.length}
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
                rowCount={dataFiltered?.length}
                numSelected={table.selected?.length}
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
                    <ErrosRow
                      key={idx}
                      row={row}
                      filters={filters}
                      setFilters={setFilters}
                      onRead={() => handleRead(row._id)}
                      onUnread={() => handleUnread(row._id)}
                      // selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      // onEditRow={() => handleEditRow(row._id)}
                    />
                  ))}

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
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, errorCodes } = filters;

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
        (data?.error_msg && data?.error_msg?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.error_code && data?.error_code?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((error) => error.status === status);
  }
  if (errorCodes?.length > 0) {
    inputData = inputData.filter((error) => errorCodes.includes(error.error_code));
  }

  return inputData;
}
