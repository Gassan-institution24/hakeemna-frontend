import { useSnackbar } from 'notistack';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { ListItemText } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useGetuserContact } from 'src/api';

import { useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import axiosInstance, { endpoints } from 'src/utils/axios';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { fDate } from 'src/utils/format-time';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import MobileRow from '../../MobileRow';

import TableDetailFiltersResult from '../table-details-filters-result';

const TABLE_HEAD = [
  /// edit
  { id: 'code', label: 'Code' },
  { id: 'Body', label: 'Body' },
  { id: 'email', label: 'email' },
  { id: 'number', label: 'number' },
  { id: 'status', label: 'status' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function AppointmentTypesTableView() {
  const table = useTable({ defaultOrderBy: 'code' });
  const popover = usePopover();
  const DDL = usePopover();
  const [selectedRow, setSelectedRow] = useState(null);

  const componentRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const isMobile = useMediaQuery('(max-width: 899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);

  const router = useRouter();

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

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

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
      router.push(paths.superadmin.tables.appointypes.edit(id));
    },
    [router]
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
                  title={row?.name_english}
                  fields={[
                    {
                      label: 'Code',
                      value: row?.code,
                    },
                    {
                      label: 'Name Arabic',
                      value: row?.name_arabic,
                    },
                    {
                      label: 'Description',
                      value: row?.description,
                    },
                  ]}
                  actions={[
                    {
                      label: 'Edit',
                      icon: 'fluent:edit-32-filled',
                      onClick: () => handleEditRow(row._id),
                    },
                    {
                      label: 'DDL',
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
                        <TableCell align="center">{row.Body}</TableCell>
                        <TableCell align="center">{row.email}</TableCell>
                        <TableCell align="center">{row.number}</TableCell>
                        <TableCell align="center">{row.status}</TableCell>

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
                            <MenuItem
                              onClick={() => handleStatusChange(selectedRow._id, 'pending')}
                            >
                              Pending
                            </MenuItem>

                            <MenuItem
                              onClick={() => handleStatusChange(selectedRow._id, 'in progress')}
                            >
                              In Progress
                            </MenuItem>

                            <MenuItem
                              onClick={() => handleStatusChange(selectedRow._id, 'resolved')}
                            >
                              Resolved
                            </MenuItem>
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
            <Box sx={{ fontWeight: 600 }}>Creation Time:</Box>
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
            <Box sx={{ pt: 1, fontWeight: 600 }}>created by:</Box>
            <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow.user_creation?.email}</Box>

            <Box sx={{ pt: 1, fontWeight: 600 }}>created by IP:</Box>
            <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
              {ddlRow.ip_address_user_creation}
            </Box>
            <Box sx={{ pt: 1, fontWeight: 600 }}>Editing Time:</Box>
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
            <Box sx={{ pt: 1, fontWeight: 600 }}>Editor:</Box>
            <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
              {ddlRow.user_modification?.email}
            </Box>
            <Box sx={{ pt: 1, fontWeight: 600 }}>Editor IP:</Box>
            <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
              {ddlRow.ip_address_user_modification}
            </Box>
            <Box sx={{ pt: 1, fontWeight: 600 }}>Modifications No: {ddlRow.modifications_nums}</Box>
          </>
        )}
      </CustomPopover>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name } = filters;

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
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  return inputData;
}
