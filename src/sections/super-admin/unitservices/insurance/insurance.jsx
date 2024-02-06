import { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import TableContainer from '@mui/material/TableContainer';
import { RouterLink } from 'src/routes/components';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
import axiosHandler from 'src/utils/axios-handler';
import { endpoints } from 'src/utils/axios';

import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { LoadingScreen } from 'src/components/loading-screen';
import { enqueueSnackbar } from 'notistack';
import { useGetInsuranceCos } from 'src/api/tables';
import { useTranslate } from 'src/locales';
import InsuranceRow from './insurance-row'; /// edit
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  /// to edit
  { id: 'code', label: 'Code' },
  { id: 'name_english', label: 'Name' },
  { id: 'type', label: 'Type' },
  { id: 'status', label: 'Status' },
  { id: 'webpage', label: 'Webpage' },
  { id: 'phone', label: 'Phone' },
  { id: 'address', label: 'Address' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------
const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  // { value: 'public', label: 'public' },
  // { value: 'privet', label: 'privet' },
  // { value: 'charity', label: 'charity' },
];

export default function UnitServicesInsuranceView({ unitServiceData, refetch }) {
  /// edit
  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  const popover = usePopover();

  const settings = useSettingsContext();

  const [filters, setFilters] = useState(defaultFilters);

  const { insuranseCosData, loading } = useGetInsuranceCos();

  const filteredInsuranceCos = insuranseCosData
    .filter((company) => !unitServiceData?.insurance?.some((data) => data._id === company._id))
    .filter((data) => data.status === 'active');

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: unitServiceData?.insurance,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // console.log('dataata', unitServiceData);
  const { t } = useTranslate();

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters?.name || filters.status !== 'all';

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleDownload = () => {
    const excelBody = dataFiltered?.reduce((acc, info) => {
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

  const handleAddRow = useCallback(
    async (id) => {
      if (unitServiceData.insurance.some((company) => company._id === id)) {
        enqueueSnackbar('this company already exist', {
          variant: 'error',
        });
        return;
      }
      const info = [...unitServiceData.insurance, id];

      await axiosHandler({
        method: 'PATCH',
        path: endpoints.tables.unitservice(unitServiceData?._id), /// to edit
        data: { insurance: info },
      });
      refetch();
      table.onUpdatePageDeleteRow(dataInPage?.length);
    },
    [dataInPage?.length, table, refetch, unitServiceData?._id, unitServiceData?.insurance]
  );
  const handleDeleteRow = useCallback(
    async (id) => {
      const info = unitServiceData?.insurance?.filter((company) => company?._id !== id);
      await axiosHandler({
        method: 'PATCH',
        path: endpoints.tables.unitservice(unitServiceData?._id), /// to edit
        data: { insurance: info },
      });
      refetch();
      table.onUpdatePageDeleteRow(dataInPage?.length);
    },
    [dataInPage?.length, table, refetch, unitServiceData?._id, unitServiceData?.insurance]
  );

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
  const unitserviceName = unitServiceData?.name_english;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={`${unitserviceName} Insurance`} /// edit
          links={[
            {
              name: t('dashboard'),
              href: paths.superadmin.root,
            },
            {
              name: t('Unit Services'),
              href: paths.superadmin.unitservices.root,
            },
            { name: t(`${unitserviceName} Insurance`) }, /// edit
          ]}
          action={
            <Button
              component={RouterLink}
              onClick={popover.onOpen}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Insurance
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
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'inactive' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && unitServiceData?.insurance?.length}
                    {tab.value === 'active' &&
                      unitServiceData?.insurance.filter((order) => order.status === 'active')
                        .length}
                    {tab.value === 'inactive' &&
                      unitServiceData?.insurance.filter((order) => order.status === 'inactive')
                        .length}
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
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     dataFiltered?.map((row) => row._id)
                  //   )
                  // }
                />

                <TableBody>
                  {dataFiltered
                    ?.slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    ?.map((row) => (
                      <InsuranceRow
                        key={row?._id}
                        row={row}
                        filters={filters}
                        setFilters={setFilters}
                        // selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row?._id)}
                        onDeleteRow={() => handleDeleteRow(row?._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      unitServiceData?.insurance.length
                    )}
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
      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
        <div
          style={{
            maxHeight: '150px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: 'darkgray lightgray',
          }}
        >
          {filteredInsuranceCos?.map((company) => (
            <MenuItem onClick={() => handleAddRow(company._id)}>
              {/* <Iconify icon="ic:baseline-add" /> */}
              {company?.name_english}
            </MenuItem>
          ))}
        </div>
      </CustomPopover>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) =>
        (data?.name_english &&
          data?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.name_arabic &&
          data?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.type?.name_english &&
          data?.type?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.type?.name_arabic &&
          data?.type?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
UnitServicesInsuranceView.propTypes = {
  unitServiceData: PropTypes.object,
  refetch: PropTypes.func,
};
