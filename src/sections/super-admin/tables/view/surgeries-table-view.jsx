import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { ListItemText } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useGetSurgeries } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
// import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { fDate } from 'src/utils/format-time';

import CustomPopover from 'src/components/custom-popover';

import TableDetailRow from '../surgeries/table-details-row'; /// edit
import MobileRow from '../../mobile-row';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  /// to edit
  { id: 'code', label: 'Code' },
  { id: 'name_english', label: 'name' },
  { id: 'name_arabic', label: 'arabic name' },
  { id: 'description', label: 'description' },
  { id: 'diseases', label: 'diseases' },
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
  // status: 'active',
};

// ----------------------------------------------------------------------

export default function SurgeriesTableView() {
  /// edit
  const table = useTable({ defaultOrderBy: 'code' });
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
  const componentRef = useRef();

  const router = useRouter();
  const [openDiseases, setOpenDiseases] = useState(false);
  const [selectedDiseases, setSelectedDiseases] = useState([]);

  // const settings = useSettingsContext();

  const { tableData, loading } = useGetSurgeries();

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const canReset = !!filters?.name;
  // || filters.status !== 'active';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownload = () => {
    const excelBody = dataFiltered.reduce((acc, data) => {
      acc.push({
        code: data?.code,
        name: data.name_english,
        description: data.description,
        diseases: data.diseases?.map((disease, idx) => disease?.name_english),
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
    saveAs(data, 'surgeriesTable.xlsx'); /// edit
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

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.superadmin.tables.surgeries.edit(id)); /// edit
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Surgeries" /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Tables',
            href: paths.superadmin.tables.list,
          },
          { name: 'Surgeries' }, /// edit
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.superadmin.tables.surgeries.new} /// edit
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Surgery
          </Button> /// edit
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
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
                  key={row?._id}
                  title={row?.name_english}
                  fields={[
                    {
                      label: 'Code',
                      value: row.code,
                    },
                    {
                      label: 'arabic name',
                      value: row.name_arabic,
                    },
                    {
                      label: 'description',
                      value: row.description,
                    },
                    {
                      label: 'Diseases',
                      value: (
                        <Box
                          sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setSelectedDiseases(row.diseases || []);
                            setOpenDiseases(true);
                          }}
                        >
                          View Diseases ({row.diseases?.length || 0})
                        </Box>
                      ),
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
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
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
                        selected={table.selected.includes(row?._id)}
                        onSelectRow={() => table.onSelectRow(row?._id)}
                        onEditRow={() => handleEditRow(row?._id)}
                      />
                    ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

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
      <Dialog open={openDiseases} onClose={() => setOpenDiseases(false)} fullWidth>
        <DialogTitle>Diseases</DialogTitle>

        <DialogContent dividers>
          {selectedDiseases.length ? (
            selectedDiseases.map((disease) => (
              <Box
                key={disease?._id}
                sx={{
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                }}
              >
                <Box sx={{ fontWeight: 600 }}>{disease?.code}</Box>
                <Box>{disease?.name_english}</Box>
                <Box sx={{ color: 'text.secondary', fontSize: 13 }}>
                  {disease?.category?.name_english}
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{ color: 'text.disabled' }}>No diseases</Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name } = filters;

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
          data?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.name_arabic &&
          data?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.diseases[0] &&
          data?.diseases?.some(
            (disease) => disease?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1
          )) ||
        (data?.diseases[0] &&
          data?.diseases?.some(
            (disease) => disease?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1
          )) ||
        data?._id === name ||
        JSON.stringify(data?.code) === name
    );
  }

  // if (status !== 'all') {
  //   inputData = inputData.filter((order) => order.status === status);
  // }

  return inputData;
}
