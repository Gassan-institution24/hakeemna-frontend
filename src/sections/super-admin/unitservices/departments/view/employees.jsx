import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect, useCallback } from 'react';

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
import { RouterLink } from 'src/routes/components';
import { useParams, useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetDepartmentEmployeeEngs } from 'src/api';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { StatusOptions } from 'src/assets/data/status-options';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
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
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { useSnackbar } from 'notistack';

import TableDetailRow from '../employees/table-details-row'; /// edit
import TableDetailToolbar from '../employees/table-details-toolbar';
import TableDetailFiltersResult from '../employees/table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'active',
};

// ----------------------------------------------------------------------

export default function EmployeesTableView({ departmentData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const TABLE_HEAD = [
    /// to edit
    { id: 'code', label: t('code') },
    { id: 'name_english', label: t('name') },
    { id: 'employee_type', label: t('employee type') },
    { id: 'email', label: t('email') },
    { id: 'nationality', label: t('nationality') },
    { id: 'validatd_identity', label: t('validated identity') },
    { id: 'Adjust_schedule', label: t('adjust schedule') },
    { id: 'status', label: t('status') },
    { id: '', width: 88 },
  ];

  const { id } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const checkAcl = useAclGuard();

  const { STATUS_OPTIONS } = StatusOptions();

  /// edit
  const table = useTable({ defaultOrderBy: 'code' });

  const { user } = useAuthContext();

  const componentRef = useRef();

  // const settings = useSettingsContext();

  const confirmActivate = useBoolean();
  const confirmInactivate = useBoolean();

  const router = useRouter();

  const { employeesData, loading, refetch } = useGetDepartmentEmployeeEngs(departmentData._id);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: employeesData,
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

  // const handleDownload = () => {
  //   const excelBody = dataFiltered.reduce((acc, data) => {
  //     acc.push({
  //       code: data.code,
  //       name: data.name_english,
  //       category: data.category?.name_english,
  //       symptoms: data.symptoms?.map((symptom, idx)  => symptom?.name_english),
  //     });
  //     return acc;
  //   }, []);
  //   const wb = XLSX.utils.book_new();
  //   const ws = XLSX.utils.json_to_sheet(excelBody);
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
  //   const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   const data = new Blob([excelBuffer], {
  //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   });
  //   saveAs(data, 'unitservicesTable.xlsx'); /// edit
  // };
  const handleActivate = useCallback(
    async (row) => {
      try {
        await axiosInstance.patch(`${endpoints.employees.one(row._id)}/updatestatus`, {
          status: 'active',
        });
        socket.emit('updated', {
          user,
          link: paths.superadmin.unitservices.departments.employees.root(id, departmentData._id),
          msg: `activated an employee <strong>[ ${row.name_english} ]</strong> in department <strong>${departmentData.name_english}</strong>`,
        });
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
          variant: 'error',
        });
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user, departmentData, enqueueSnackbar, id, curLangAr]
  );
  const handleInactivate = useCallback(
    async (row) => {
      try {
        await axiosInstance.patch(`${endpoints.employees.one(row._id)}/updatestatus`, {
          status: 'inactive',
        });
        socket.emit('updated', {
          user,
          link: paths.superadmin.unitservices.departments.employees.root(id, departmentData._id),
          msg: `inactivated an employee <strong>[ ${row.name_english} ]</strong> in department <strong>${departmentData.name_english}</strong>`,
        });
      } catch (error) {
        // error emitted in backend
        enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
          variant: 'error',
        });
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user, departmentData, enqueueSnackbar, id, curLangAr]
  );

  const handleActivateRows = useCallback(async () => {
    try {
      await axiosInstance.patch(`${endpoints.employees.all}/updatestatus`, {
        status: 'active',
        ids: table.selected,
      });
      socket.emit('updated', {
        user,
        link: paths.superadmin.unitservices.departments.employees.root(id, departmentData._id),
        msg: `activated many employees in department <strong>${departmentData.name_english}</strong>`,
      });
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      console.error(error);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: employeesData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    dataFiltered.length,
    dataInPage.length,
    table,
    employeesData,
    refetch,
    departmentData,
    user,
    enqueueSnackbar,
    id,
    curLangAr,
  ]);

  const handleInactivateRows = useCallback(async () => {
    try {
      await axiosInstance.patch(`${endpoints.employees.all}/updatestatus`, {
        status: 'inactive',
        ids: table.selected,
      });
      socket.emit('updated', {
        user,
        link: paths.superadmin.unitservices.departments.employees.root(id, departmentData._id),
        msg: `inactivated many employees in department <strong>${departmentData.name_english}</strong>`,
      });
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      console.error(error);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: employeesData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    dataFiltered.length,
    dataInPage.length,
    table,
    employeesData,
    refetch,
    departmentData,
    user,
    enqueueSnackbar,
    id,
    curLangAr,
  ]);

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

  const handleEditRow = useCallback(
    (_id) => {
      router.push(paths.superadmin.unitservices.employees.edit(_id)); /// edit
    },
    [router]
  );

  const handleViewRow = useCallback(
    (_id) => {
      router.push(paths.superadmin.unitservices.employees.info(_id)); /// edit
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

  /* eslint-disable */
  useEffect(() => {
    socket.on('employeeStatusUpdated', () => {
      refetch();
    });
  }, []);
  /* eslint-enable */

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          // heading={`${departmentData.name_english || ''} ${t('department employees')}`} /// edit
          // links={[
          //   {
          //     name: t('dashboard'),
          //     href: paths.superadmin.unitservices.root,
          //   },
          //   {
          //     name: t('departments'),
          //     href: paths.superadmin.unitservices.departments.root(id),
          //   },
          //   { name: t('department employees') },
          // ]}
          action={
            checkAcl({ category: 'department', subcategory: 'employees', acl: 'create' }) && (
              <Button
                component={RouterLink}
                href={paths.superadmin.unitservices.departments.employees.new(
                  id,
                  departmentData._id
                )} /// edit
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('new employee')}
              </Button>
            ) /// edit
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
                    {tab.value === 'all' && employeesData.length}
                    {tab.value === 'active' &&
                      employeesData.filter((order) => order.status === 'active').length}
                    {tab.value === 'inactive' &&
                      employeesData.filter((order) => order.status === 'inactive').length}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <TableDetailToolbar
            onPrint={printHandler}
            filters={filters}
            onFilters={handleFilters}
            // onDownload={handleDownload}
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
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row, idx) => row._id)
                )
              }
              action={
                checkAcl({ category: 'department', subcategory: 'employees', acl: 'update' }) && (
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
                checkAcl({ category: 'department', subcategory: 'employees', acl: 'update' }) &&
                dataFiltered
                  .filter((row) => table.selected.includes(row._id))
                  .some((info) => info.status === 'inactive')
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
                        filters={filters}
                        setFilters={setFilters}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onActivate={() => handleActivate(row)}
                        onViewRow={() => handleViewRow(row._id)}
                        onInactivate={() => handleInactivate(row)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, employeesData.length)}
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

  const stabilizedThis = inputData?.map((el, index, idx) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el, idx) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) =>
        (data?.employee?.name_english &&
          data?.employee?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.name_arabic &&
          data?.employee?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.email &&
          data?.employee?.email?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.family_name &&
          data?.employee?.family_name?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.name_english &&
          data?.employee?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.country?.name_english &&
          data?.employee?.country?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        (data?.employee?.country?.name_arabic &&
          data?.employee?.country?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.city?.name_english &&
          data?.employee?.city?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.city?.name_arabic &&
          data?.employee?.city?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.employee?.nationality?.name_english &&
          data?.employee?.nationality?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        (data?.employee?.nationality?.name_arabic &&
          data?.employee?.nationality?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !==
            -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
EmployeesTableView.propTypes = {
  departmentData: PropTypes.node,
};
