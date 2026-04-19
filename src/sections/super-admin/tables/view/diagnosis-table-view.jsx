import { useSnackbar } from 'notistack';
import { useRef, useState, useCallback } from 'react';

import {
  Box,
  Card,
  Table,
  Button,
  Dialog,
  TableRow,
  MenuItem,
  TextField,
  TableCell,
  Container,
  TableBody,
  IconButton,
  useMediaQuery,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import axiosInstance from 'src/utils/axios';
import { fDate } from 'src/utils/format-time';

import { useGetdiagnosis } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
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

import MobileRow from '../../mobile-row';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'created_at', label: 'Date' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function DiagnosisTableView() {
  const table = useTable({ defaultOrderBy: 'code' });
  const popover = usePopover();
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    icd_code: '',
    _id: null,
  });
  const { diagnosisData, refetch, isLoading } = useGetdiagnosis();
  console.log('diagnosisData', diagnosisData);
  const componentRef = useRef();
  const { enqueueSnackbar } = useSnackbar();

  const isMobile = useMediaQuery('(max-width: 899px)');

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: diagnosisData,
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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/diagnosis/${id}`);
      enqueueSnackbar('Deleted successfully', { variant: 'success' });
      refetch();
      popover.onClose();
    } catch (e) {
      enqueueSnackbar('Error deleting', { variant: 'error' });
    }
  };

  const handleSubmit = async () => {
    try {
      if (form._id) {
        // update
        await axiosInstance.patch(`/api/diagnosis/${form._id}`, form);
        enqueueSnackbar('Updated successfully', { variant: 'success' });
      } else {
        // create
        await axiosInstance.post('/api/diagnosis', form);
        enqueueSnackbar('Created successfully', { variant: 'success' });
      }

      setOpenDialog(false);
      refetch();
    } catch (e) {
      enqueueSnackbar('Error saving', { variant: 'error' });
    }
  };
  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading="product categories" /// edit
          links={[
            {
              name: 'dashboard',
              href: paths.superadmin.root,
            },
            {
              name: 'Tables',
              href: paths.superadmin.tables.list,
            },
            { name: 'product categories' }, /// edit
          ]}
          action={
            <Button
              variant="contained"
              onClick={() => {
                setForm({
                  name: '',
                  description: '',
                  icd_code: '',
                  _id: null,
                });
                setOpenDialog(true);
              }}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Diagnosis
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
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
                ?.map((row) => (
                  <MobileRow
                    key={row?._id}
                    title={row?.name}
                    fields={[
                      {
                        label: 'Code',
                        value: row?.code,
                      },
                      {
                        label: 'name',
                        value: row?.name,
                      },
                      {
                        label: 'description',
                        value: row?.description,
                      },
                      {
                        label: 'Date',
                        value: () => (
                          <Box>
                            <Box sx={{ fontWeight: 500 }}>
                              {fDate(row.created_at, 'dd MMM yyyy')}
                            </Box>
                          </Box>
                        ),
                      },
                    ]}
                    actions={[
                      {
                        label: 'Edit',
                        onClick: () => {
                          setForm({
                            name: row.name,
                            description: row.description,
                            icd_code: row.icd_code,
                            _id: row._id,
                          });
                          setOpenDialog(true);
                        },
                      },
                      {
                        label: 'Delete',
                        onClick: () => handleDelete(row._id),
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
                      ?.map((row, idx) => (
                        <TableRow hover>
                          <TableCell align="center">
                            <Box>{row.code}</Box>
                          </TableCell>
                          <TableCell align="center">{row.name}</TableCell>
                          <TableCell align="center">{row.description}</TableCell>
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

                            <CustomPopover open={popover.open} onClose={popover.onClose}>
                              <MenuItem
                                onClick={() => {
                                  setForm({
                                    name: selectedRow.name,
                                    description: selectedRow.description,
                                    icd_code: selectedRow.icd_code,
                                    _id: selectedRow._id,
                                  });
                                  setOpenDialog(true);
                                  popover.onClose();
                                }}
                              >
                                Edit
                              </MenuItem>

                              <MenuItem
                                onClick={() => handleDelete(selectedRow._id)}
                                sx={{ color: 'error.main' }}
                              >
                                Delete
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
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <Box sx={{ p: 3, width: 400 }}>
          <Box sx={{ fontSize: 18, fontWeight: 600, mb: 2 }}>
            {form._id ? 'Edit Diagnosis' : 'New Diagnosis'}
          </Box>

          <TextField
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            fullWidth
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="icd code"
            fullWidth
            value={form.icd_code}
            onChange={(e) => setForm({ ...form, icd_code: e.target.value })}
            sx={{ mb: 3 }}
          />

          <Button fullWidth variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

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
        data?.name?.toLowerCase().includes(search) ||
        data?.description?.toLowerCase().includes(search) ||
        data?.code?.toString().includes(search)
    );
  }

  return inputData;
}
