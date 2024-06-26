import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useGetCompanies } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
// import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { MenuItem, Select, TableCell, TableRow } from '@mui/material';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import TableDetailRow from '../companies_list/table-details-row'; /// edit
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  /// to edit
  { id: 'code', label: 'code' },
  { id: 'unit_service_type', label: 'unit_service_type' },
  { id: 'country', label: 'country' },
  { id: 'city', label: 'city' },
  { id: 'email', label: 'email' },
  { id: 'insurance', label: 'insurance' },
  { id: 'info', label: 'info' },
  { id: 'sector', label: 'sector' },
  { id: 'commercial_name', label: 'commercial_name' },
  { id: 'province', label: 'province' },
  { id: 'address', label: 'address' },
  { id: 'phone_number_1', label: 'phone_number_1' },
  { id: 'Phone_number_2', label: 'Phone_number_2' },
  { id: 'work_shift', label: 'work_shift' },
  { id: 'constitution_objective', label: 'constitution_objective' },
  { id: 'type_of_specialty_1', label: 'type_of_specialty_1' },
  { id: 'type_of_specialty_2', label: 'type_of_specialty_2' },
  { id: 'subscribe_to', label: 'subscribe_to' },
  { id: 'social_network', label: 'social_network' },
  { id: 'notes', label: 'notes' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  USType: '',
  city: '',
  sector: '',
  province: '',
  speciality1: '',
  speciality2: '',
  // status: 'active',
};

// ----------------------------------------------------------------------

export default function CompaniesTableView() {
  /// edit
  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  // const settings = useSettingsContext();

  const router = useRouter();

  const { companiesData, loading } = useGetCompanies();

  const [filters, setFilters] = useState(defaultFilters);

  const searchParams = useSearchParams();

  const upload_record = searchParams.get('upload_record');

  useEffect(() => {
    if (upload_record) {
      setFilters((prev) => ({ ...prev, name: upload_record }));
    }
  }, [upload_record]);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: companiesData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters?.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownload = () => {
    const excelBody = dataFiltered.reduce((acc, data) => {
      acc.push({
        code: data.code,
        name: data.name_english,
        description: data.description, /// edit
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
    saveAs(data, 'companiesTable.xlsx'); /// edit
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
      router.push(paths.superadmin.tables.companies.edit(id)); /// edit
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

  if (loading) {
    return <LoadingScreen />;
  }

  const uniqueUnitServiceTypes = [...new Set(dataFiltered.map((one) => one.unit_service_type))];
  const uniqueCities = [...new Set(dataFiltered.map((one) => one.city))];
  const uniqueSectors = [...new Set(dataFiltered.map((one) => one.sector))];
  const uniqueProvince = [...new Set(dataFiltered.map((one) => one.province))];
  const uniqueSpecialities1 = [...new Set(dataFiltered.map((one) => one.type_of_specialty_1))];
  const uniqueSpecialities2 = [...new Set(dataFiltered.map((one) => one.type_of_specialty_2))];

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="companies" /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Tables',
            href: paths.superadmin.tables.list,
          },
          { name: 'companies' }, /// edit
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.superadmin.tables.companies.new} /// edit
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New company
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

        <TableContainer>
          <Scrollbar sx={{ height: '60vh', position: 'relative' }}>
            <Table ref={componentRef} size={table.dense ? 'small' : 'medium'} >
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                sx={{ position: 'sticky', top: 0, zIndex: 5 }}
              />

              <TableBody sx={{ position: 'relative' }}>
                <TableRow sx={{ position: 'sticky', top: 57, backgroundColor: 'white' }}>
                  <TableCell />
                  <TableCell >
                    <Select fullWidth size='small' value={filters.USType} onChange={(e) => handleFilters('USType', e.target.value)}>
                      <MenuItem value=''>all</MenuItem>
                      {uniqueUnitServiceTypes.map((one, index) => (
                        one && <MenuItem key={index} value={one}>{one}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell />
                  <TableCell >
                    <Select fullWidth size='small' value={filters.city} onChange={(e) => handleFilters('city', e.target.value)}>
                      <MenuItem value=''>all</MenuItem>
                      {uniqueCities.map((one, index) => (
                        one && <MenuItem key={index} value={one}>{one}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell >
                    <Select fullWidth size='small' value={filters.sector} onChange={(e) => handleFilters('sector', e.target.value)}>
                      <MenuItem value=''>all</MenuItem>
                      {uniqueSectors.map((one, index) => (
                        one && <MenuItem key={index} value={one}>{one}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell />
                  <TableCell >
                    <Select fullWidth size='small' value={filters.province} onChange={(e) => handleFilters('province', e.target.value)}>
                      <MenuItem value=''>all</MenuItem>
                      {uniqueProvince.map((one, index) => (
                        one && <MenuItem key={index} value={one}>{one}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell >
                    <Select fullWidth size='small' value={filters.speciality1} onChange={(e) => handleFilters('speciality1', e.target.value)}>
                      <MenuItem value=''>all</MenuItem>
                      {uniqueSpecialities1.map((one, index) => (
                        one && <MenuItem key={index} value={one}>{one}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell >
                    <Select fullWidth size='small' value={filters.speciality2} onChange={(e) => handleFilters('speciality2', e.target.value)}>
                      <MenuItem value=''>all</MenuItem>
                      {uniqueSpecialities2.map((one, index) => (
                        one && <MenuItem key={index} value={one}>{one}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, idx) => (
                    <TableDetailRow
                      key={idx}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, companiesData.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          setPage={table.setPage}
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

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, USType, city, sector, province, speciality1, speciality2 } = filters;

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
        (data?.commercial_name &&
          data?.commercial_name?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.province && data?.province?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.country && data?.country?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.city && data?.city?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.email && data?.email?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.phone_number_1 &&
          data?.phone_number_1?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.type_of_specialty_1 &&
          data?.type_of_specialty_1?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.type_of_specialty_2 &&
          data?.type_of_specialty_2?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.unit_service_type &&
          data?.unit_service_type?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.sector && data?.sector?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.info && data?.info?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?.upload_record === name ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }
  if (USType) {
    inputData = inputData.filter(
      (data) => data.USType?.toLowerCase().indexOf(USType.toLowerCase()) !== -1)
  }
  if (city) {
    inputData = inputData.filter(
      (data) => data.city?.toLowerCase().indexOf(city.toLowerCase()) !== -1)
  }
  if (sector) {
    inputData = inputData.filter(
      (data) => data.sector?.toLowerCase().indexOf(sector.toLowerCase()) !== -1)
  }
  if (province) {
    inputData = inputData.filter(
      (data) => data.province?.toLowerCase().indexOf(province.toLowerCase()) !== -1)
  }
  if (speciality1) {
    inputData = inputData.filter(
      (data) => data.type_of_specialty_1?.toLowerCase().indexOf(speciality1.toLowerCase()) !== -1)
  }
  if (speciality2) {
    inputData = inputData.filter(
      (data) => data.type_of_specialty_2?.toLowerCase().indexOf(speciality2.toLowerCase()) !== -1)
  }

  // if (status !== 'all') {
  //   inputData = inputData.filter((order) => order.status === status);
  // }

  return inputData;
}
