import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import { ListItemText } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useGetUSDepartments } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useAclGuard } from 'src/auth/guard/acl-guard';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  MobileRow,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { fDate } from 'src/utils/format-time';

import { StatusOptions } from 'src/assets/data/status-options';

import { useSnackbar } from 'src/components/snackbar';
import CustomPopover from 'src/components/custom-popover';
import { LoadingScreen } from 'src/components/loading-screen';

import TableDetailRow from '../home-table-row'; /// edit
import TableDetailToolbar from '../home-table-toolbar';
import TableDetailFiltersResult from '../home-table-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'active',
};

// ----------------------------------------------------------------------

export default function UnitServicesTableView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const TABLE_HEAD = [
    /// to edit
    // { id: 'code', label: t('code') },
    { id: 'sequence_number', label: t('number') },
    { id: 'name_english', label: t('name') },
    { id: 'work_group', label: t('work group') },
    { id: 'status', label: t('status') },
    { id: '', width: 88 },
  ];
  const isMobile = useMediaQuery('(max-width:899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
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

  const { departmentsData, loading, refetch } = useGetUSDepartments(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service._id
  );

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
        category: data.category?.name_english,
        symptoms: data.symptoms?.map((symptom, idx) => symptom?.name_english),
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
    async (row) => {
      try {
        await axiosInstance.patch(`${endpoints.departments.one(row._id)}/updatestatus`, {
          status: 'active',
        });
        socket.emit('updated', {
          user,
          link: paths.unitservice.departments.info(row._id),
          msg: `activating department <strong>${row.name_english || ''}</strong>`,
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
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user, enqueueSnackbar, curLangAr]
  );
  const handleInactivate = useCallback(
    async (row) => {
      try {
        await axiosInstance.patch(`${endpoints.departments.one(row._id)}/updatestatus`, {
          status: 'inactive',
        });
        socket.emit('updated', {
          user,
          link: paths.unitservice.departments.info(row._id),
          msg: `inactivating department <strong>${row.name_english || ''}</strong>`,
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
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch, user, enqueueSnackbar, curLangAr]
  );

  const handleActivateRows = useCallback(async () => {
    try {
      await axiosInstance.patch(`${endpoints.departments.all}/updatestatus`, {
        status: 'active',
        ids: table.selected,
      });
      socket.emit('updated', {
        user,
        link: paths.unitservice.departments.root,
        msg: `activating many departments`,
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
    table.onUpdatePageDeleteRows({
      totalRows: departmentsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    dataFiltered.length,
    dataInPage.length,
    table,
    departmentsData,
    refetch,
    user,
    curLangAr,
    enqueueSnackbar,
  ]);

  const handleInactivateRows = useCallback(async () => {
    try {
      await axiosInstance.patch(`${endpoints.departments.all}/updatestatus`, {
        status: 'inactive',
        ids: table.selected,
      });
      socket.emit('updated', {
        user,
        link: paths.unitservice.departments.root,
        msg: `inactivating many departments`,
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
    table.onUpdatePageDeleteRows({
      totalRows: departmentsData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [
    dataFiltered.length,
    dataInPage.length,
    table,
    departmentsData,
    refetch,
    user,
    curLangAr,
    enqueueSnackbar,
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
    (id) => {
      router.push(paths.unitservice.departments.edit(id)); /// edit
    },
    [router]
  );

  const handleShowRow = useCallback(
    (id) => {
      router.push(paths.unitservice.departments.info(id)); /// edit
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
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={t('departments')} /// edit
          links={[
            {
              name: t('dashboard'),
              href: paths.unitservice.root,
            },
            { name: t('departments') }, /// edit
          ]}
          action={
            checkAcl('departments:create') && (
              <Button
                component={RouterLink}
                href={paths.unitservice.departments.new} /// edit
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('new department')}
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
                      // (tab.value === 'public' && 'success') ||
                      // (tab.value === 'private' && 'error') ||
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

          {isMobile ? (
            <>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <MobileRow
                    title={
                      <Box
                        sx={{
                          cursor: 'pointer',
                          color: 'primary.main',
                          fontWeight: 600,
                        }}
                        onClick={() => handleShowRow(row._id)}
                      >
                        {curLangAr ? row?.name_arabic : row?.name_english}
                      </Box>
                    }
                    fields={[
                      {
                        label: t('number'),
                        value: row.sequence_number,
                      },
                      {
                        label: t('work group'),
                        value: curLangAr
                          ? row.work_group?.name_arabic
                          : row.work_group?.name_english,
                      },
                      {
                        label: t('status'),
                        value: (
                          <Label
                            variant="soft"
                            color={row.status === 'active' ? 'success' : 'error'}
                          >
                            {t(row.status)}
                          </Label>
                        ),
                      },
                    ]}
                    actions={[
                      {
                        label: row.status === 'active' ? t('inactivate') : t('activate'),
                        icon: row.status === 'active' ? 'ic:baseline-pause' : 'bi:play-fill',
                        color: row.status === 'active' ? 'error.main' : 'success.main',
                        onClick:
                          row.status === 'active'
                            ? () => handleInactivate(row)
                            : () => handleActivate(row),
                      },
                      {
                        label: t('edit'),
                        icon: 'fluent:edit-32-filled',
                        onClick: () => handleEditRow(row._id),
                      },
                      {
                        label: t('DDL'),
                        icon: 'carbon:data-quality-definition',
                        onClick: (event) => {
                          setDdlRow(row);
                          setDdlAnchorEl(event.currentTarget);
                        },
                      },
                    ]}
                  />
                ))}
            </>
          ) : (
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
                          onShow={() => handleShowRow(row._id)}
                          onInactivate={() => handleInactivate(row)}
                          onEditRow={() => handleEditRow(row._id)}
                        />
                      ))}
                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          )}

          <CustomPopover
            open={ddlOpen}
            onClose={() => setDdlAnchorEl(null)}
            anchorEl={ddlAnchorEl}
            arrow="right-top"
            sx={{
              padding: 2,
              fontSize: '14px',
              minWidth: 260,
            }}
          >
            {ddlRow && (
              <>
                <Box sx={{ fontWeight: 600 }}>{t('creation time')}:</Box>
                <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                  <ListItemText
                    primary={fDate(ddlRow.created_at, 'dd MMMMMMMM yyyy')}
                    secondary={fDate(ddlRow.created_at, 'p')}
                    primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                    secondaryTypographyProps={{
                      component: 'span',
                      typography: 'caption',
                    }}
                  />
                </Box>
                <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by')}:</Box>
                <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                  {ddlRow.user_creation?.email}
                </Box>

                <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by IP')}:</Box>
                <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                  {ddlRow.ip_address_user_creation}
                </Box>
                <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editing time')}:</Box>
                <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                  <ListItemText
                    primary={fDate(ddlRow.updated_at, 'dd MMMMMMMM yyyy')}
                    secondary={fDate(ddlRow.updated_at, 'p')}
                    primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                    secondaryTypographyProps={{
                      component: 'span',
                      typography: 'caption',
                    }}
                  />
                </Box>
                <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor')}:</Box>
                <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                  {ddlRow.user_modification?.email}
                </Box>
                <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor IP')}:</Box>
                <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
                  {ddlRow.ip_address_user_modification}
                </Box>
                <Box sx={{ pt: 1, fontWeight: 600 }}>
                  {t('modifications no')}: {ddlRow.modifications_nums}
                </Box>
              </>
            )}
          </CustomPopover>
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
