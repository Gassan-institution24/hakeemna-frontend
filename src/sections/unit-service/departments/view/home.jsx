import { useState, useCallback, useRef } from 'react';

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
import TableContainer from '@mui/material/TableContainer';
import { RouterLink } from 'src/routes/components';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';

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

import { useGetUSDepartments } from 'src/api/tables'; /// edit
import axiosHandler from 'src/utils/axios-handler';
import { endpoints } from 'src/utils/axios';
import TableDetailRow from '../home-table-row'; /// edit
import TableDetailToolbar from '../home-table-toolbar';
import TableDetailFiltersResult from '../home-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  /// to edit
  { id: 'code', label: 'Code' },
  { id: 'name_english', label: 'Name' },
  { id: 'status', label: 'Status' },
  { id: 'Accounting', label: 'Accounting' },
  // { id: 'Appointment Config', label: 'Appointment Configuration' },
  { id: 'Appointments', label: 'Appointments' },
  { id: 'Activities', label: 'Activities' },
  { id: 'Employees', label: 'Employees' },
  { id: 'Quality Control', label: 'Quality Control' },
  { id: 'Rooms', label: 'Rooms' },
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
];

export default function UnitServicesTableView() {
  /// edit
  const table = useTable({ defaultOrderBy: 'code' });

  const { user } = useAuthContext();

  const componentRef = useRef();

  const settings = useSettingsContext();

  const confirmActivate = useBoolean();
  const confirmInactivate = useBoolean();

  const router = useRouter();

  const { departmentsData, refetch } = useGetUSDepartments(user?.unit_service._id);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: departmentsData,
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
        category: data.category?.name_english,
        symptoms: data.symptoms?.map((symptom) => symptom?.name_english),
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
    saveAs(data, 'unitservicesTable.xlsx'); /// edit
  };
  const handleActivate = useCallback(
    async (id) => {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.department(id)}/updatestatus`,
        data: { status: 'active' },
      });
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch]
  );
  const handleInactivate = useCallback(
    async (id) => {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.department(id)}/updatestatus`,
        data: { status: 'inactive' },
      });
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch]
  );

  const handleActivateRows = useCallback(async () => {
    await axiosHandler({
      method: 'PATCH',
      path: `${endpoints.tables.departments}/updatestatus`,
      data: { status: 'active', ids: table.selected },
    });
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: departmentsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, departmentsData, refetch]);

  const handleInactivateRows = useCallback(async () => {
    await axiosHandler({
      method: 'PATCH',
      path: `${endpoints.tables.departments}/updatestatus`,
      data: { status: 'inactive', ids: table.selected },
    });
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: departmentsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, departmentsData, refetch]);

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
    (id) => {
      router.push(paths.unitservice.departments.edit(id)); /// edit
    },
    [router]
  );

  const handleShowAccountingRow = useCallback(
    (id) => {
      router.push(paths.unitservice.departments.accounting(id)); /// edit
    },
    [router]
  );
  const handleShowActivitiesRow = useCallback(
    (id) => {
      router.push(paths.unitservice.departments.activities.root(id)); /// edit
    },
    [router]
  );
  const handleShowAppointmentConfidRow = useCallback(
    (id) => {
      router.push(paths.unitservice.departments.appointmentconfiguration(id)); /// edit
    },
    [router]
  );
  const handleShowAppointmentsRow = useCallback(
    (id) => {
      router.push(paths.unitservice.departments.appointments(id)); /// edit
    },
    [router]
  );
  const handleShowemployeesRow = useCallback(
    (id) => {
      router.push(paths.unitservice.departments.employees.root(id)); /// edit
    },
    [router]
  );
  const handleShowQualityControlRow = useCallback(
    (id) => {
      router.push(paths.unitservice.departments.qualityControl(id)); /// edit
    },
    [router]
  );
  const handleShowRoomsRow = useCallback(
    (id) => {
      router.push(paths.unitservice.departments.rooms.root(id)); /// edit
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

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Departments" /// edit
          links={[
            {
              name: 'Dashboard',
              href: paths.unitservice.root,
            },
            { name: 'Departments' }, /// edit
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.unitservice.departments.new} /// edit
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Department
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
                      // (tab.value === 'public' && 'success') ||
                      // (tab.value === 'privet' && 'error') ||
                      // (tab.value === 'charity' && 'success') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && departmentsData.length}
                    {tab.value === 'active' &&
                      departmentsData.filter((order) => order.status === 'active').length}
                    {tab.value === 'inactive' &&
                      departmentsData.filter((order) => order.status === 'inactive').length}
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
                        filters={filters}
                        setFilters={setFilters}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onActivate={() => handleActivate(row._id)}
                        showAccounting={() => handleShowAccountingRow(row._id)}
                        showActivities={() => handleShowActivitiesRow(row._id)}
                        showAppointmentConfig={() => handleShowAppointmentConfidRow(row._id)}
                        showAppointments={() => handleShowAppointmentsRow(row._id)}
                        showEmployees={() => handleShowemployeesRow(row._id)}
                        showQualityControl={() => handleShowQualityControlRow(row._id)}
                        showRooms={() => handleShowRoomsRow(row._id)}
                        onInactivate={() => handleInactivate(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, departmentsData.length)}
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
        (data?.name_arabic &&
          data?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.name_english &&
          data?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
