import { useSnackbar } from 'notistack';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import axiosInstance from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { fDate } from 'src/utils/format-time';

import { useGetuserContact } from 'src/api';

import Label from 'src/components/label';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import MobileRow from '../../MobileRow';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

const TABLE_HEAD = [
  /// edit
  { id: 'code', label: 'Code' },
  { id: 'name', label: 'name' },
  { id: 'Body', label: 'Body' },
  { id: 'email', label: 'email' },
  { id: 'country', label: 'Country' },
  { id: 'number', label: 'Number' },
  { id: 'created_at', label: 'Date' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function AppointmentTypesTableView() {
  const table = useTable({ defaultOrderBy: 'code' });
  const popover = usePopover();
  const [selectedRow, setSelectedRow] = useState(null);

  const componentRef = useRef();
  const { enqueueSnackbar } = useSnackbar();

  const isMobile = useMediaQuery('(max-width: 899px)');

  const { userContactData, loading, refetch } = useGetuserContact();

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: userContactData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });
  const canReset = !!filters?.name;

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

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
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleStatusChange = async (id, status) => {
    try {
      await axiosInstance.patch(`/api/userContact/${id}`, { status });

      enqueueSnackbar(`Status updated to ${status}`, {
        variant: 'success',
      });
      refetch(); // تحديث البيانات بعد التعديل
      popover.onClose(); // 🔥
    } catch (e) {
      enqueueSnackbar('Error updating status', {
        variant: 'error',
      });
    }
  };
  const TABS = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="user Contact" /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Tables',
            href: paths.superadmin.tables.list,
          },
          { name: 'user Contact' }, /// edit
        ]}
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
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={(tab.value === filters.status && 'filled') || 'soft'}
                  color={
                    (tab.value === 'pending' && 'warning') ||
                    (tab.value === 'in progress' && 'info') ||
                    (tab.value === 'resolved' && 'success') ||
                    'default'
                  }
                >
                  {tab.value === 'all' && userContactData.length}

                  {tab.value === 'pending' &&
                    userContactData.filter((item) => item.status === 'pending').length}

                  {tab.value === 'in progress' &&
                    userContactData.filter((item) => item.status === 'in progress').length}

                  {tab.value === 'resolved' &&
                    userContactData.filter((item) => item.status === 'resolved').length}
                </Label>
              }
            />
          ))}
        </Tabs>
        <TableDetailToolbar
          filters={filters}
          onFilters={handleFilters}
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

        {isMobile ? (
          <>
            {dataFiltered
              ?.slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <MobileRow
                  key={row?._id}
                  title={row?.name}
                  fields={[
                    {
                      label: 'Code',
                      value: row?.code,
                    },
                    {
                      label: 'email',
                      value: row?.email,
                    },
                    {
                      label: 'number',
                      value: row?.number,
                    },
                    {
                      label: 'country',
                      value: row?.country?.name_english,
                    },
                    {
                      label: 'body',
                      value: row?.Body,
                    },
                    {
                      label: 'Status',
                      value: () => (
                        <Label
                          color={
                            (row.status === 'pending' && 'warning') ||
                            (row.status === 'in progress' && 'info') ||
                            (row.status === 'resolved' && 'success') ||
                            'default'
                          }
                        >
                          {row.status}
                        </Label>
                      ),
                    },
                    {
                      label: 'Date',
                      value: () => (
                        <Box>
                          <Box sx={{ fontWeight: 500 }}>{fDate(row.created_at, 'dd MMM yyyy')}</Box>
                        </Box>
                      ),
                    },
                  ]}
                  actions={[
                    {
                      label: 'Pending',
                      show: row.status !== 'pending',
                      onClick: () => handleStatusChange(row._id, 'pending'),
                    },
                    {
                      label: 'In Progress',
                      show: row.status !== 'in progress',
                      onClick: () => handleStatusChange(row._id, 'in progress'),
                    },
                    {
                      label: 'Resolved',
                      show: row.status !== 'resolved',
                      onClick: () => handleStatusChange(row._id, 'resolved'),
                    },
                  ]}
                />
              ))}
          </>
        ) : (
          <TableContainer>
            <Scrollbar>
              <Table ref={componentRef} size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered?.length}
                  numSelected={table.selected?.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    ?.slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, idx) => (
                      <TableRow hover>
                        <TableCell align="center">
                          <Box>{row.code}</Box>
                        </TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{row.Body}</TableCell>
                        <TableCell align="center">{row.email}</TableCell>
                        <TableCell align="center">{row.country?.name_english}</TableCell>
                        <TableCell align="center">{row.number}</TableCell>
                        <TableCell align="center">
                          {fDate(row.created_at, 'dd MMM yyyy')}
                        </TableCell>

                        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                          <IconButton
                            onClick={(e) => {
                              popover.onOpen(e);
                              setSelectedRow(row); // 🔥 هاي أهم سطر
                            }}
                          >
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>

                          <CustomPopover
                            open={popover.open}
                            onClose={popover.onClose}
                            arrow="right-top"
                            sx={{ width: 140 }}
                          >
                            {[
                              {
                                label: 'Pending',
                                value: 'pending',
                                show: selectedRow?.status !== 'pending',
                              },
                              {
                                label: 'In Progress',
                                value: 'in progress',
                                show: selectedRow?.status !== 'in progress',
                              },
                              {
                                label: 'Resolved',
                                value: 'resolved',
                                show: selectedRow?.status !== 'resolved',
                              },
                            ]
                              .filter((a) => a.show !== false)
                              .map((action) => (
                                <MenuItem
                                  key={action.value}
                                  onClick={() => handleStatusChange(selectedRow._id, action.value)}
                                >
                                  {action.label}
                                </MenuItem>
                              ))}
                          </CustomPopover>
                        </TableCell>
                      </TableRow>
                    ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

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
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    const search = name.toLowerCase();

    inputData = inputData?.filter(
      (data) =>
        (data?.name && data.name.toLowerCase().includes(search)) ||
        (data?.email && data.email.toLowerCase().includes(search)) ||
        (data?.number && String(data.number).includes(search))
    );
  }
  if (status && status !== 'all') {
    inputData = inputData?.filter((data) => data.status === status);
  }

  return inputData;
}
