import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect, useCallback, useContext } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { Checkbox, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { CompaniesContext } from 'src/context/companiesContext';
import { useGetCompanies } from 'src/api';

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
} from 'src/components/table';
import { Box } from '@mui/system';
import TableDetailFilters from './table-details-filters'
import TableDetailRow from '../companies_list/table-details-row';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  USType: '',
  city: '',
  sector: '',
  province: '',
  speciality1: '',
  speciality2: '',
};

// ----------------------------------------------------------------------

export default function CompaniesTableView() {
  const { state, setState } = useContext(CompaniesContext);
  const { savedFilters, savedPage, savedVisibleColumns, savedShowAll } = state;

  const handleSetState = useCallback((newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, [setState]);

  const [showAll, setShowAll] = useState(savedShowAll || false);
  const [filters, setFilters] = useState(savedFilters || defaultFilters);
  const [visibleColumns, setVisibleColumns] = useState(
    savedVisibleColumns || {}
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const TABLE_HEAD = [
    { id: 'code', label: 'code' },
    { id: 'unit_service_type', label: 'unit_service_type' },
    { id: 'country', label: 'country' },
    { id: 'city', label: 'city' },
    { id: 'email', label: 'email' },
    { id: 'sector', label: 'sector' },
    { id: 'commercial_name', label: 'commercial_name' },
    { id: 'province', label: 'province' },
    { id: 'address', label: 'address' },
    { id: 'phone_number_1', label: 'phone_number_1' },
    { id: 'Phone_number_2', label: 'Phone_number_2' },
    { id: '', label: 'communication' },
    { id: 'status', label: 'status', width: 120 },
    { id: 'com_note', label: 'com_note', width: 200 },
    showAll && { id: 'insurance', label: 'insurance' },
    showAll && { id: 'info', label: 'info' },
    showAll && { id: 'work_shift', label: 'work_shift' },
    showAll && { id: 'constitution_objective', label: 'constitution_objective' },
    showAll && { id: 'type_of_specialty_1', label: 'type_of_specialty_1' },
    showAll && { id: 'type_of_specialty_2', label: 'type_of_specialty_2' },
    showAll && { id: 'subscribe_to', label: 'subscribe_to' },
    showAll && { id: 'social_network', label: 'social_network' },
    showAll && { id: 'notes', label: 'notes' },
  ].filter(Boolean);
  
  const table = useTable({ defaultOrderBy: 'code' });

  useEffect(() => {
    if (Object.keys(visibleColumns).length === 0) {
      const initialColumns = Object.fromEntries(TABLE_HEAD.map((col) => [col.id, true]));
      setVisibleColumns(initialColumns);
      handleSetState({ savedVisibleColumns: initialColumns });
    }
  }, [visibleColumns, setVisibleColumns, TABLE_HEAD, handleSetState]);

  useEffect(() => {
    if (!isInitialized && savedPage !== undefined) {
      table.setPage(savedPage);
      setIsInitialized(true);
    }
  }, [savedPage, table, isInitialized]);

  useEffect(() => {
    if (isInitialized && savedPage !== undefined && savedPage !== table.page) {
      table.setPage(savedPage);
    }
  }, [savedPage, table, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      if (table.page !== savedPage) {
        handleSetState({ savedPage: table.page });
      }
    }, 100);

  // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutId);
  }, [table.page, savedPage, handleSetState, isInitialized]);

  const displayedColumns = TABLE_HEAD.filter((col) => visibleColumns[col.id]);

  const componentRef = useRef();

  const router = useRouter();

  const { companiesData, loading } = useGetCompanies();

  const searchParams = useSearchParams();

  const upload_record = searchParams.get('upload_record');

  useEffect(() => {
    const name = searchParams.get('name');
    const USType = searchParams.get('ust');
    const city = searchParams.get('city');
    const sector = searchParams.get('sector');
    const province = searchParams.get('province');
    const page = Number(searchParams.get('page') || '0');

    if (name || USType || city || sector || province) {
      const newFilters = {
        name: name || '',
        USType: USType || '',
        city: city || '',
        sector: sector || '',
        province: province || '',
        speciality1: '',
        speciality2: '',
      };
      setFilters(newFilters);
      handleSetState({ savedFilters: newFilters });
    }

    if (page !== 0) {
      table.setPage(page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  useEffect(() => {
    if (upload_record) {
      const newFilters = { ...filters, name: upload_record };
      setFilters(newFilters);
      handleSetState({ savedFilters: newFilters });
    }
  }, [upload_record, filters, handleSetState]);

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
        description: data.description, 
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
    saveAs(data, 'companiesTable.xlsx');
  };

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      const newFilters = { ...filters, [name]: value };
      setFilters(newFilters);
      handleSetState({ savedFilters: newFilters });
    },
    [table, filters, handleSetState]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(`${paths.superadmin.tables.companies.edit(id)}`);
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    handleSetState({ savedFilters: defaultFilters });
  }, [handleSetState]);

  const handleShowAllChange = useCallback((newShowAll) => {
    setShowAll(newShowAll);
    handleSetState({ savedShowAll: newShowAll });
  }, [handleSetState]);

  const handleVisibleColumnsChange = useCallback((newVisibleColumns) => {
    setVisibleColumns(newVisibleColumns);
    handleSetState({ savedVisibleColumns: newVisibleColumns });
  }, [handleSetState]);

  const handlePageChange = useCallback((event, newPage) => {
    table.onChangePage(event, newPage);
    handleSetState({ savedPage: newPage });
  }, [table, handleSetState]);

  const handleSetPage = useCallback((newPage) => {
    table.setPage(newPage);
    handleSetState({ savedPage: newPage });
  }, [table, handleSetState]);

  const handleRowsPerPageChange = useCallback((event) => {
    table.onChangeRowsPerPage(event);
    handleSetState({ savedPage: 0 });
  }, [table, handleSetState]);

  if (loading) {
    return <LoadingScreen />;
  }

  const uniqueUnitServiceTypes = [...new Set(dataFiltered.map((one) => one.unit_service_type))];
  const uniqueCities = [...new Set(dataFiltered.map((one) => one.city))];
  const uniqueSectors = [...new Set(dataFiltered.map((one) => one.sector))];
  const uniqueProvince = [...new Set(dataFiltered.map((one) => one.province))];

  return (
    <Container maxWidth="">
      <CustomBreadcrumbs
        heading="companies"
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Tables',
            href: paths.superadmin.tables.list,
          },
          { name: 'companies' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.superadmin.tables.companies.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New company
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableDetailFilters
        uniqueUnitServiceTypes={uniqueUnitServiceTypes}
        uniqueCities={uniqueCities}
        uniqueSectors={uniqueSectors}
        uniqueProvince={uniqueProvince}
        filters={filters}
        onFilters={handleFilters}
        onReset={handleResetFilters}
      />
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        {TABLE_HEAD.map((col) => (
          <Box key={col.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Checkbox
              size="small"
              checked={visibleColumns[col.id] || false}
              onChange={(e) =>
                handleVisibleColumnsChange({
                  ...visibleColumns,
                  [col.id]: e.target.checked,
                })
              }
            />
            <Typography variant="body2">{col.label}</Typography>
          </Box>
        ))}
      </Box>
      <Card>
        <TableDetailToolbar
          onPrint={printHandler}
          filters={filters}
          onFilters={handleFilters}
          onDownload={handleDownload}
          canReset={canReset}
          onResetFilters={handleResetFilters}
        />
        <Checkbox checked={showAll} onChange={(e) => handleShowAllChange(e.target.checked)} />
        show all
        {canReset && (
          <TableDetailFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}
        <TableContainer>
          <Scrollbar sx={{ height: '100vh', position: 'relative' }}>
            <Table ref={componentRef} size={table.dense ? 'small' : 'medium'} >
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={displayedColumns}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                sx={{ position: { sm: 'sticky' }, top: 0, zIndex: { sm: 5 } }}
              />

              <TableBody sx={{ position: 'relative' }}>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, idx) => (
                    <TableDetailRow
                      key={idx}
                      index={idx}
                      row={row}
                      showAll={showAll}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      displayedColumns={displayedColumns}
                    />
                  ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          setPage={handleSetPage}
          rowsPerPage={table.rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
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
      (data) => data.unit_service_type?.toLowerCase().indexOf(USType.toLowerCase()) !== -1
    );
  }
  if (city) {
    inputData = inputData.filter(
      (data) => data.city?.toLowerCase().indexOf(city.toLowerCase()) !== -1
    );
  }
  if (sector) {
    inputData = inputData.filter(
      (data) => data.sector?.toLowerCase().indexOf(sector.toLowerCase()) !== -1
    );
  }
  if (province) {
    inputData = inputData.filter(
      (data) => data.province?.toLowerCase().indexOf(province.toLowerCase()) !== -1
    );
  }
  if (speciality1) {
    inputData = inputData.filter(
      (data) => data.type_of_specialty_1?.toLowerCase().indexOf(speciality1.toLowerCase()) !== -1
    );
  }
  if (speciality2) {
    inputData = inputData.filter(
      (data) => data.type_of_specialty_2?.toLowerCase().indexOf(speciality2.toLowerCase()) !== -1
    );
  }

  return inputData;
}



