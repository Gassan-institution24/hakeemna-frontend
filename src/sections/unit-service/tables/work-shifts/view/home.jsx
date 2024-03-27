import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import socket from 'src/socket';
import { useGetUSWorkShifts } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { StatusOptions } from 'src/assets/data/status-options';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
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
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { useSnackbar } from 'notistack';

import axiosInstance, { endpoints } from 'src/utils/axios';

import TableDetailRow from '../table-details-row'; /// edit
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'active',
};

// ----------------------------------------------------------------------

export default function WorkGroupsTableView() {
  const checkAcl = useAclGuard();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'name', label: t('name') },
    { id: 'start_time', label: t('start time') },
    { id: 'end_time', label: t('end time') },
    { id: 'status', label: t('status') },
    { id: '', width: 88 },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const { STATUS_OPTIONS } = StatusOptions();

  const { user } = useAuthContext();

  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirmActivate = useBoolean();
  const confirmInactivate = useBoolean();

  const { workShiftsData, loading, refetch } = useGetUSWorkShifts(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: workShiftsData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );
  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters?.name || filters.status !== 'active';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownload = () => {
    const excelBody = dataFiltered.reduce((acc, data) => {
      acc.push({
        code: data.code,
        name: data.name_english,
        country: data.country?.name_english,
        status: data.status,
      });
      return acc;
    }, []);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelBody);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, 'RoomsTable.xlsx'); /// edit
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

  const handleActivate = useCallback(
    async (row) => {
      try {
        await axiosInstance.patch(
          `${endpoints.work_shifts.one(row._id)}/updatestatus`, /// edit
          { status: 'active' }
        );
        socket.emit('updated', {
          user,
          link: paths.unitservice.tables.workshifts.root,
          msg: `activated a work shift <strong>${row.name_english || ''}</strong>`,
        });
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user, curLangAr, enqueueSnackbar]
  );
  const handleInactivate = useCallback(
    async (row) => {
      try {
        await axiosInstance.patch(
          `${endpoints.work_shifts.one(row._id)}/updatestatus`, /// edit
          { status: 'inactive' }
        );
        socket.emit('updated', {
          user,
          link: paths.unitservice.tables.workshifts.root,
          msg: `inactivated a work shift <strong>${row.name_english || ''}</strong>`,
        });
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user, curLangAr, enqueueSnackbar]
  );

  const handleActivateRows = useCallback(async () => {
    try {
      await axiosInstance.patch(
        `${endpoints.work_shifts.all}/updatestatus`, /// edit
        { status: 'active', ids: table.selected }
      );
      socket.emit('updated', {
        user,
        link: paths.unitservice.tables.workshifts.root,
        msg: `activated many work shifts`,
      });
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
      console.error(error);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: workShiftsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    dataFiltered.length,
    dataInPage.length,
    table,
    workShiftsData,
    refetch,
    user,
    enqueueSnackbar,
    curLangAr,
  ]);

  const handleInactivateRows = useCallback(async () => {
    try {
      await axiosInstance.patch(
        `${endpoints.work_shifts.all}/updatestatus`, /// edit
        { status: 'inactive', ids: table.selected }
      );
      socket.emit('updated', {
        user,
        link: paths.unitservice.tables.workshifts.root,
        msg: `inactivated many work shifts`,
      });
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
      console.error(error);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: workShiftsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    dataFiltered.length,
    dataInPage.length,
    table,
    workShiftsData,
    refetch,
    user,
    enqueueSnackbar,
    curLangAr,
  ]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.unitservice.tables.workshifts.edit(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // const handleViewRow = useCallback(
  //   (id) => {
  //     router.push(paths.dashboard.order.details(id));
  //   },
  //   [router]
  // );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('work shifts')} /// edit
          links={[
            {
              name: t('dashboard'),
              href: paths.unitservice.root,
            },
            { name: t('work shifts') },
          ]}
          action={
            checkAcl({
              category: 'unit_service',
              subcategory: 'management_tables',
              acl: 'create',
            }) && (
              <Button
                component={RouterLink}
                href={paths.unitservice.tables.workshifts.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('new work shift')}
              </Button>
            )
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
                    {tab.value === 'all' && workShiftsData.length}
                    {tab.value === 'active' &&
                      workShiftsData.filter((order) => order.status === 'active').length}
                    {tab.value === 'inactive' &&
                      workShiftsData.filter((order) => order.status === 'inactive').length}
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
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer>
            <TableSelectedAction
              // dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row, idx) => row._id)
                )
              }
              action={
                checkAcl({
                  category: 'unit_service',
                  subcategory: 'management_tables',
                  acl: 'update',
                }) && (
                  <>
                    {dataFiltered
                      .filter((row) => table.selected.includes(row._id))
                      .some((data) => data.status === 'inactive') ? (
                      <Tooltip title="Activate all">
                        <IconButton color="primary" onClick={confirmActivate.onTrue}>
                          <Iconify icon="codicon:run-all" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Inactivate all">
                        <IconButton color="error" onClick={confirmInactivate.onTrue}>
                          <Iconify icon="iconoir:pause-solid" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )
              }
              color={
                checkAcl({
                  category: 'unit_service',
                  subcategory: 'management_tables',
                  acl: 'update',
                }) &&
                dataFiltered
                  .filter((row) => table.selected.includes(row._id))
                  .some((data) => data.status === 'inactive')
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
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row, idx) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, idx) => (
                      <TableDetailRow
                        key={idx}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onActivate={() => handleActivate(row)}
                        onInactivate={() => handleInactivate(row)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, workShiftsData.length)}
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

      <ConfirmDialog
        open={confirmInactivate.value}
        onClose={confirmInactivate.onFalse}
        title="Inactivate"
        content={
          <>
            Are you sure want to Inactivate <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleInactivateRows();
              confirmInactivate.onFalse();
            }}
          >
            Inactivate
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmActivate.value}
        onClose={confirmActivate.onFalse}
        title="Activate"
        content={
          <>
            Are you sure want to Activate <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleActivateRows();
              confirmActivate.onFalse();
            }}
          >
            Activate
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name } = filters;

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
        (data?.name_english &&
          data?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.name_arabic &&
          data?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employees &&
          data?.employees?.some(
            (employee) =>
              employee.employee.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1
          )) ||
        (data?.employees &&
          data?.employees?.some(
            (employee) =>
              employee.employee.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1
          )) ||
        // (data?.employees &&
        //   data?.employees?.some((employee) =>
        //     employee.employee.name_arabic.toLowerCase().indexOf(name.toLowerCase())
        //    !== -1))||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
