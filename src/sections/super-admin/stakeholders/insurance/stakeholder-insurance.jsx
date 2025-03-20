import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import { enqueueSnackbar } from 'notistack';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useGetActiveInsuranceCos } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
// import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import InsuranceRow from './stakeholder-insurance-row'; /// edit
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
  status: 'active',
};

// ----------------------------------------------------------------------
const STATUS_OPTIONS = [
  // { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  // { value: 'public', label: 'public' },
  // { value: 'private', label: 'private' },
  // { value: 'charity', label: 'charity' },
];

export default function StakeholderInsuranceView({ stakeholderData, refetch }) {
  /// edit
  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  // const settings = useSettingsContext();

  const popover = usePopover();

  const [filters, setFilters] = useState(defaultFilters);

  const { insuranseCosData, loading } = useGetActiveInsuranceCos();

  const filteredInsuranceCos = insuranseCosData
    ?.filter((company) => !stakeholderData?.insurance?.some((data) => data._id === company._id))
    ?.filter((data) => data.status === 'active');

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: stakeholderData?.insurance,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const { t } = useTranslate();

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset = !!filters?.name || filters.status !== 'active';

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleDownload = () => {
    const excelBody = dataFiltered?.reduce((acc, info) => {
      acc.push({
        code: info?.code,
        name: info?.name_english,
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

  const handleAddRow = useCallback(
    async (id) => {
      if (stakeholderData.insurance.some((company) => company._id === id)) {
        enqueueSnackbar(t('this company already exist'), {
          variant: 'error',
        });
        return;
      }
      const info = [...stakeholderData.insurance, id];

      await axiosInstance.patch(
        endpoints.stakeholders.one(stakeholderData?._id), /// to edit
        { insurance: info }
      );
      refetch();
      table.onUpdatePageDeleteRow(dataInPage?.length);
    },
    [dataInPage?.length, table, refetch, stakeholderData?._id, t, stakeholderData?.insurance]
  );
  const handleDeleteRow = useCallback(
    async (id) => {
      const info = stakeholderData?.insurance?.filter((company) => company?._id !== id);
      await axiosInstance.patch(
        endpoints.stakeholders.one(stakeholderData?._id), /// to edit
        { insurance: info }
      );
      refetch();
      table.onUpdatePageDeleteRow(dataInPage?.length);
    },
    [dataInPage?.length, table, refetch, stakeholderData?._id, stakeholderData?.insurance]
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
  const stakeholderName = stakeholderData?.name_english || 'Stakeholder';

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={`${stakeholderName} Insurance`} /// edit
          links={[
            {
              name: 'dashboard',
              href: paths.superadmin.root,
            },
            {
              name: t('stakeholders'),
              href: paths.superadmin.stakeholders.root,
            },
            { name: t(`${stakeholderName} Insurance`) }, /// edit
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
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'inactive' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && stakeholderData?.insurance?.length}
                    {tab.value === 'active' &&
                      stakeholderData?.insurance?.filter((order) => order.status === 'active')
                        ?.length}
                    {tab.value === 'inactive' &&
                      stakeholderData?.insurance?.filter((order) => order.status === 'inactive')
                        ?.length}
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
                  //     dataFiltered?.map((row, idx)  => row._id)
                  //   )
                  // }
                />

                <TableBody>
                  {dataFiltered
                    ?.slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    ?.map((row, idx) => (
                      <InsuranceRow
                        key={idx}
                        row={row}
                        filters={filters}
                        setFilters={setFilters}
                        // selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row?._id)}
                        onDeleteRow={() => handleDeleteRow(row?._id)}
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
      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
        <div
          style={{
            maxHeight: '150px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: 'darkgray lightgray',
          }}
        >
          {filteredInsuranceCos?.map((company, idx) => (
            <MenuItem lang="ar" onClick={() => handleAddRow(company._id)}>
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

  const stabilizedThis = inputData?.map((el, index, idx) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el, idx) => el[0]);

  if (name) {
    inputData = inputData?.filter(
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
    inputData = inputData?.filter((order) => order.status === status);
  }

  return inputData;
}
StakeholderInsuranceView.propTypes = {
  stakeholderData: PropTypes.object,
  refetch: PropTypes.func,
};
