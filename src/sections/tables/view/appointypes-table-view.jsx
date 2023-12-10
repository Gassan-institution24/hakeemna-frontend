import { useState, useCallback, useRef } from 'react';

// import Tab from '@mui/material/Tab';
// import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
// import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
// import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { RouterLink } from 'src/routes/components';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// import { useBoolean } from 'src/hooks/use-boolean';

// import { fTimestamp } from 'src/utils/format-time';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
// import { ConfirmDialog } from 'src/components/custom-dialog';
// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  // TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { useGetAppointmentTypes } from 'src/api/tables'; /// edit
// import axiosHandler from 'src/utils/axios-handler';
import TableDetailRow from '../appointmentTypes/table-details-row'; /// edit
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...ORDER_STATUS_OPTIONS];

const TABLE_HEAD = [
  /// edit
  { id: 'code', label: 'Code' },
  { id: 'name_english', label: 'name' },
  { id: 'description', label: 'description' },
  // { id: 'created_at', label: 'Date Of Creation' },
  // { id: 'user_creation', label: 'Creater' },
  // { id: 'ip_address_user_creation', label: 'IP Of Creator' },
  // { id: 'updated_at', label: 'Date Of Updating' },
  // { id: 'user_modification', label: 'Last Modifier' },
  // { id: 'ip_address_user_modification', label: 'IP Of Modifier' },
  // { id: 'modifications_nums', label: 'No Of Modifications' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function AppointmentTypesTableView() {
  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  // const settings = useSettingsContext();

  const router = useRouter();

  // const confirmActivate = useBoolean();
  // const confirmInactivate = useBoolean();

  const { appointmenttypesData } = useGetAppointmentTypes();

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: appointmenttypesData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage
  // );
  console.log(dataFiltered);
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
    saveAs(data, 'appointmentTypesTable.xlsx'); /// edit
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

  // const handleActivate = useCallback(
  //   async (id) => {
  //     await axiosHandler({
  //       method: 'PATCH',
  //       path: `insurance/companies/${id}/updatestatus`, /// edit
  //       data: { status: 'active' },
  //     });
  //     refetch();
  //     table.onUpdatePageDeleteRow(dataInPage.length);
  //   },
  //   [dataInPage.length, table, refetch]
  // );
  // const handleInactivate = useCallback(
  //   async (id) => {
  //     await axiosHandler({
  //       method: 'PATCH',
  //       path: `insurance/companies/${id}/updatestatus`, /// edit
  //       data: { status: 'inactive' },
  //     });
  //     refetch();
  //     table.onUpdatePageDeleteRow(dataInPage.length);
  //   },
  //   [dataInPage.length, table, refetch]
  // );

  // const handleActivateRows = useCallback(async () => {
  //   await axiosHandler({
  //     method: 'PATCH',
  //     path: `insurance/companies/updatestatus`, /// edit
  //     data: { status: 'active', ids: table.selected },
  //   });
  //   refetch();
  //   table.onUpdatePageDeleteRows({
  //     totalRows: appointmenttypesData.length,
  //     totalRowsInPage: dataInPage.length,
  //     totalRowsFiltered: dataFiltered.length,
  //   });
  // }, [dataFiltered.length, dataInPage.length, table, appointmenttypesData, refetch]);

  // const handleInactivateRows = useCallback(async () => {
  //   await axiosHandler({
  //     method: 'PATCH',
  //     path: `insurance/companies/updatestatus`, /// edit
  //     data: { status: 'inactive', ids: table.selected },
  //   });
  //   refetch();
  //   table.onUpdatePageDeleteRows({
  //     totalRows: appointmenttypesData.length,
  //     totalRowsInPage: dataInPage.length,
  //     totalRowsFiltered: dataFiltered.length,
  //   });
  // }, [dataFiltered.length, dataInPage.length, table, appointmenttypesData, refetch]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.superadmin.tables.appointypes.edit(id));
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

  // const handleFilterStatus = useCallback(
  //   (event, newValue) => {
  //     handleFilters('status', newValue);
  //   },
  //   [handleFilters]
  // );
  return (
    <>
      <Container maxWidth={false}>
        <CustomBreadcrumbs
          heading="Appointment Types" /// edit
          links={[
            {
              name: 'Super',
              href: paths.superadmin.root,
            },
            {
              name: 'Tables',
              href: paths.superadmin.tables.list,
            },
            { name: 'Appointment Types' }, /// edit
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.superadmin.tables.appointypes.new} /// edit
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Appointment Type
            </Button> /// edit
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
                    {tab.value === 'all' && appointmenttypesData.length}
                    {tab.value === 'active' &&
                      appointmenttypesData.filter((order) => order.status === 'active').length}
                    {tab.value === 'inactive' &&
                      appointmenttypesData.filter((order) => order.status === 'inactive').length}
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
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer>
            {/* <TableSelectedAction
              // dense={table.dense}
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
            /> */}

            <Scrollbar>
              <Table ref={componentRef} size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={false}
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
                        // onSelectRow={() => table.onSelectRow(row._id)}
                        // onActivate={() => handleActivate(row._id)}
                        // onInactivate={() => handleInactivate(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      appointmenttypesData.length
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

      {/* <ConfirmDialog
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
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name } = filters;

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
        (data?.name_english &&
          data?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.name_arabic &&
          data?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
