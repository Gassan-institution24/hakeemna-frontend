import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
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

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetDepartmentActivities } from 'src/api';
import { useAclGuard } from 'src/auth/guard/acl-guard';

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
} from 'src/components/table'; /// edit
import { useSnackbar } from 'notistack';

import { StatusOptions } from 'src/assets/data/status-options';

import { LoadingScreen } from 'src/components/loading-screen';

import TableDetailRow from '../activities/table-details-row'; /// edit
import TableDetailToolbar from '../activities/table-details-toolbar';
import TableDetailFiltersResult from '../activities/table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function ActivitesTableView({ departmentData }) {
  const { t } = useTranslate();
  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'name', label: t('name') },
    { id: 'details', label: t('details') },
    { id: 'status', label: t('status') },
    { id: '', width: 88 },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const checkAcl = useAclGuard();

  const { user } = useAuthContext();

  const { STATUS_OPTIONS } = StatusOptions();

  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirmActivate = useBoolean();
  const confirmInactivate = useBoolean();

  const { activitiesData, loading, refetch } = useGetDepartmentActivities(departmentData._id);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: activitiesData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );
  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters?.name || filters.status !== 'all';

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
    saveAs(data, 'ActivitiesTable.xlsx'); /// edit
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
          `${endpoints.activities.one(row._id)}/updatestatus`, /// edit
          { status: 'active' }
        );
        socket.emit('updated', {
          user,
          link: paths.unitservice.departments.activities.root(departmentData._id),
          msg: `activated activity <strong>[ ${row.name_english} ]</strong> in department <strong>${departmentData.name_english}</strong>`,
        });
      } catch (error) {
        socket.emit('error', { error, user, location: window.location.pathname });
        enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, departmentData, user, enqueueSnackbar]
  );
  const handleInactivate = useCallback(
    async (row) => {
      try {
        await axiosInstance.patch(
          `${endpoints.activities.one(row._id)}/updatestatus`, /// edit
          { status: 'inactive' }
        );
        socket.emit('updated', {
          user,
          link: paths.unitservice.departments.activities.root(departmentData._id),
          msg: `inactivated activity <strong>[ ${row.name_english} ]</strong> in department <strong>${departmentData.name_english}</strong>`,
        });
      } catch (error) {
        socket.emit('error', { error, user, location: window.location.pathname });
        enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
        console.error(error);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, departmentData, user, enqueueSnackbar]
  );

  const handleActivateRows = useCallback(async () => {
    try {
      await axiosInstance.patch(
        `${endpoints.activities.all}/updatestatus`, /// edit
        { status: 'active', ids: table.selected }
      );
      socket.emit('updated', {
        user,
        link: paths.unitservice.departments.activities.root(departmentData._id),
        msg: `activated many activities in department <strong>${departmentData.name_english}</strong>`,
      });
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.pathname });
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
      console.error(error);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: activitiesData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    dataFiltered.length,
    dataInPage.length,
    table,
    activitiesData,
    refetch,
    departmentData,
    user,
    enqueueSnackbar,
  ]);

  const handleInactivateRows = useCallback(async () => {
    try {
      await axiosInstance.patch(
        `${endpoints.activities.all}/updatestatus`, /// edit
        { status: 'inactive', ids: table.selected }
      );
      socket.emit('updated', {
        user,
        link: paths.unitservice.departments.activities.root(departmentData._id),
        msg: `inactivated many activities in department <strong>${departmentData.name_english}</strong>`,
      });
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.pathname });
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
      console.error(error);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: activitiesData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    dataFiltered.length,
    dataInPage.length,
    table,
    activitiesData,
    refetch,
    departmentData,
    user,
    enqueueSnackbar,
  ]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.unitservice.departments.activities.edit(departmentData._id, id));
    },
    [router, departmentData]
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
          // heading={`${departmentData.name_english || t('department')} ${t('activities')}`} /// edit
          // links={[
          //   {
          //     name: t('dashboard'),
          //     href: paths.unitservice.root,
          //   },
          //   {
          //     name: t('departments'),
          //     href: paths.unitservice.departments.root,
          //   },
          //   { name: t('activities') },
          // ]}
          action={
            checkAcl({
              category: 'department',
              subcategory: 'management_tables',
              acl: 'create',
            }) && (
              <Button
                component={RouterLink}
                href={paths.unitservice.departments.activities.new(departmentData._id)}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('new activity')}
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
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    lang="ar"
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'inactive' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && activitiesData.length}
                    {tab.value === 'active' &&
                      activitiesData.filter((order) => order.status === 'active').length}
                    {tab.value === 'inactive' &&
                      activitiesData.filter((order) => order.status === 'inactive').length}
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
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row._id)
                )
              }
              action={
                checkAcl({
                  category: 'department',
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
                      dataFiltered.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <TableDetailRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        setFilters={setFilters}
                        filters={filters}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onActivate={() => handleActivate(row)}
                        onInactivate={() => handleInactivate(row)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, activitiesData.length)}
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

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) =>
        (data?.name_english &&
          data?.name_english?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1) ||
        (data?.name_arabic &&
          data?.name_arabic?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
ActivitesTableView.propTypes = {
  departmentData: PropTypes.object,
};
