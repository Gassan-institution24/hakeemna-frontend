import PropTypes from 'prop-types';
import { useState, useCallback, useRef } from 'react';

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
import { RouterLink } from 'src/routes/components';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';

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

import { socket } from 'src/socket';
import { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import axiosHandler from 'src/utils/axios-handler';
import { useLocales, useTranslate } from 'src/locales';
import { LoadingScreen } from 'src/components/loading-screen';
import { useGetDepartmentRooms } from 'src/api/tables'; /// edit
import { StatusOptions } from 'src/assets/data/status-options';

import TableDetailRow from '../rooms/table-details-row'; /// edit
import TableDetailToolbar from '../rooms/table-details-toolbar';
import TableDetailFiltersResult from '../rooms/table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function RoomsTableView({ departmentData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'name', label: t('name') },
    { id: 'general_info', label: t('general info') },
    { id: 'status', label: t('status') },
    { id: '', width: 88 },
  ];

  const { user } = useAuthContext();

  const { STATUS_OPTIONS } = StatusOptions();

  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirmActivate = useBoolean();
  const confirmInactivate = useBoolean();

  const { roomsData, loading, refetch } = useGetDepartmentRooms(departmentData._id);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: roomsData,
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
        await axiosHandler({
          method: 'PATCH',
          path: `${endpoints.tables.room(row._id)}/updatestatus`, /// edit
          data: { status: 'active' },
        });
        socket.emit('updated', {
          user,
          link: paths.unitservice.departments.rooms.root(departmentData._id),
          msg: `activated room <strong>[ ${row.name_english} ]</strong> in department <strong>${departmentData.name_english}</strong>`,
        });
      } catch (e) {
        console.error(e);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user, departmentData]
  );
  const handleInactivate = useCallback(
    async (row) => {
      try {
        await axiosHandler({
          method: 'PATCH',
          path: `${endpoints.tables.room(row._id)}/updatestatus`, /// edit
          data: { status: 'inactive' },
        });
        socket.emit('updated', {
          user,
          link: paths.unitservice.departments.rooms.root(departmentData._id),
          msg: `inactivated room <strong>[ ${row.name_english} ]</strong> in department <strong>${departmentData.name_english}</strong>`,
        });
      } catch (e) {
        console.error(e);
      }
      refetch();
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user, departmentData]
  );

  const handleActivateRows = useCallback(async () => {
    try {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.rooms}/updatestatus`, /// edit
        data: { status: 'active', ids: table.selected },
      });
      socket.emit('updated', {
        user,
        link: paths.unitservice.departments.rooms.root(departmentData._id),
        msg: `activated many rooms in department <strong>${departmentData.name_english}</strong>`,
      });
    } catch (e) {
      console.error(e);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: roomsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, roomsData, refetch, user, departmentData]);

  const handleInactivateRows = useCallback(async () => {
    try {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.rooms}/updatestatus`, /// edit
        data: { status: 'inactive', ids: table.selected },
      });
      socket.emit('updated', {
        user,
        link: paths.unitservice.departments.rooms.root(departmentData._id),
        msg: `inactivated many rooms in department <strong>${departmentData.name_english}</strong>`,
      });
    } catch (e) {
      console.error(e);
    }
    refetch();
    table.onUpdatePageDeleteRows({
      totalRows: roomsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, roomsData, refetch, user, departmentData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.unitservice.departments.rooms.edit(departmentData._id, id));
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
          // heading={`${curLangAr?departmentData.name_arabic:departmentData.name_english || ''} ${t('department rooms')}`} /// edit
          // links={[
          //   {
          //     name: t('dashboard'),
          //     href: paths.unitservice.root,
          //   },
          //   {
          //     name: t('departments'),
          //     href: paths.unitservice.departments.root,
          //   },
          //   { name: t('department rooms') },
          // ]}
          action={
            ACLGuard({ category: 'department', subcategory: 'rooms', acl: 'create' }) && (
              <Button
                component={RouterLink}
                href={paths.unitservice.departments.rooms.new(departmentData._id)}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('new room')}
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
                    {tab.value === 'all' && roomsData.length}
                    {tab.value === 'active' &&
                      roomsData.filter((order) => order.status === 'active').length}
                    {tab.value === 'inactive' &&
                      roomsData.filter((order) => order.status === 'inactive').length}
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
                  dataFiltered.map((row) => row._id)
                )
              }
              action={
                ACLGuard({ category: 'department', subcategory: 'rooms', acl: 'update' }) && (
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
                ACLGuard({ category: 'department', subcategory: 'rooms', acl: 'update' }) &&
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
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onActivate={() => handleActivate(row)}
                        onInactivate={() => handleInactivate(row)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, roomsData.length)}
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
        data?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        (data?.name_arabic &&
          data?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.department?.name_english &&
          data?.department?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.department?.name_arabic &&
          data?.department?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
RoomsTableView.propTypes = {
  departmentData: PropTypes.object,
};
