import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';
// import { StatusOptions } from 'src/assets/data/status-options';
import { useGetUnitservice, useGetInsuranceCos } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
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

import InsuranceRow from '../insurance-row'; /// edit
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  // status: 'active',
};

// ----------------------------------------------------------------------

export default function UnitServicesInsuranceView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const checkAcl = useAclGuard();

  const TABLE_HEAD = [
    /// to edit
    { id: 'code', label: t('code') },
    { id: 'name_english', label: t('name') },
    { id: 'type', label: t('type') },
    // { id: 'status', label: t('status') },
    { id: 'webpage', label: t('webpage') },
    { id: 'phone', label: t('phone') },
    { id: 'address', label: t('address') },
    { id: '', width: 88 },
  ];

  const { enqueueSnackbar } = useSnackbar();

  // const { STATUS_OPTIONS } = StatusOptions();

  /// edit
  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  const popover = usePopover();

  // const settings = useSettingsContext();

  const { user } = useAuthContext();

  const [filters, setFilters] = useState(defaultFilters);

  const { insuranseCosData, loading } = useGetInsuranceCos();

  const { data, refetch } = useGetUnitservice(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service._id
  );
  const filteredInsuranceCos = insuranseCosData.filter(
    (company) => !data?.insurance?.some((info) => info._id === company._id)
  );

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: data?.insurance,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset = !!filters?.name;

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
      try {
        const info = [...data.insurance, id];
        await axiosInstance.patch(
          endpoints.unit_services.one(data?._id), /// to edit
          { insurance: info }
        );
        socket.emit('updated', {
          user,
          link: paths.unitservice.insurance.root,
          msg: `added an insurance`,
        });
        enqueueSnackbar('added successfully');
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(
          curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
          {
            variant: 'error',
          }
        );
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage?.length);
    },
    [
      dataInPage?.length,
      table,
      refetch,
      data?._id,
      data?.insurance,
      user,
      enqueueSnackbar,
      curLangAr,
    ]
  );
  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const info = data?.insurance?.filter((company) => company?._id !== id);
        await axiosInstance.patch(
          endpoints.unit_services.one(data?._id), /// to edit
          { insurance: info }
        );
        socket.emit('updated', {
          user,
          link: paths.unitservice.insurance.root,
          msg: `removed an insurance`,
        });
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(
          curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
          {
            variant: 'error',
          }
        );
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage?.length);
    },
    [
      dataInPage?.length,
      table,
      refetch,
      data?._id,
      data?.insurance,
      user,
      enqueueSnackbar,
      curLangAr,
    ]
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
  // const handleFilterStatus = useCallback(
  //   (event, newValue) => {
  //     handleFilters('status', newValue);
  //   },
  //   [handleFilters]
  // );
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={t('Insurance')} /// edit
          links={[
            {
              name: t('dashboard'),
              href: paths.unitservice.root,
            },
            { name: t('Insurance') }, /// edit
          ]}
          action={
            checkAcl({
              category: 'unit_service',
              subcategory: 'unit_service_info',
              acl: 'create',
            }) && (
              <Button
                component={RouterLink}
                onClick={popover.onOpen}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('new insurance')}
              </Button>
            ) /// edit
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          {/* <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab, idx)  => (
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
                    {tab.value === 'all' && data?.insurance?.length}
                    {tab.value === 'active' &&
                      data?.insurance.filter((order) => order.status === 'active').length}
                    {tab.value === 'inactive' &&
                      data?.insurance.filter((order) => order.status === 'inactive').length}
                  </Label>
                }
              />
            ))}
          </Tabs> */}
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
            count={dataFiltered?.length || 0}
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
            <MenuItem lang="ar" key={idx} onClick={() => handleAddRow(company._id)}>
              {/* <Iconify icon="ic:baseline-add" /> */}
              {curLangAr ? company?.name_arabic : company?.name_english}
            </MenuItem>
          ))}
        </div>
      </CustomPopover>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

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

  return inputData;
}
// UnitServicesInsuranceView.propTypes = {
//   refetch: PropTypes.func,
// };
