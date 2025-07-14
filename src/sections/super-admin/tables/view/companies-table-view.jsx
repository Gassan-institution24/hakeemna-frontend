import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Box } from '@mui/system';
import { Checkbox, Typography } from '@mui/material';
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
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useCompaniesContext } from 'src/context/companiesContext';

import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import TableDetailFilters from './table-details-filters';
import TableDetailRow from '../companies_list/table-details-row';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

export default function CompaniesTableView() {
  const {
    filters: savedFilters,
    showAll: savedShowAll,
    enabledColumns: savedEnabledColumns,
    tablePage: savedTablePage,
    updateFilters,
    updateShowAll,
    updateEnabledColumns,
    updateTablePage,
  } = useCompaniesContext();

  // Local state
  const [filters, setFilters] = useState(savedFilters);
  const [showAll, setShowAll] = useState(savedShowAll);
  const [visibleColumns, setVisibleColumns] = useState(savedEnabledColumns);

  const table = useTable({ defaultOrderBy: 'code' });
  const componentRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { companiesData, loading } = useGetCompanies();

  // Define table columns with useMemo
  const TABLE_HEAD = useMemo(() => [
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
    ...(showAll ? [
      { id: 'insurance', label: 'insurance' },
      { id: 'info', label: 'info' },
      { id: 'work_shift', label: 'work_shift' },
      { id: 'constitution_objective', label: 'constitution_objective' },
      { id: 'type_of_specialty_1', label: 'type_of_specialty_1' },
      { id: 'type_of_specialty_2', label: 'type_of_specialty_2' },
      { id: 'subscribe_to', label: 'subscribe_to' },
      { id: 'social_network', label: 'social_network' },
      { id: 'notes', label: 'notes' },
    ] : []),
  ], [showAll]);

  // Initialize visible columns
  useEffect(() => {
    if (!visibleColumns || Object.keys(visibleColumns).length === 0) {
      const initialColumns = Object.fromEntries(TABLE_HEAD.map((col) => [col.id, true]));
      setVisibleColumns(initialColumns);
      updateEnabledColumns(initialColumns);
    }
  }, [visibleColumns, TABLE_HEAD, updateEnabledColumns]);

  // Sync table page only on initial load
  useEffect(() => {
    if (savedTablePage !== undefined && savedTablePage !== table.page) {
      table.setPage(savedTablePage);
    }
  }, [savedTablePage, table]);

  // Handle URL parameters
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
      updateFilters(newFilters);
    }

    if (page !== 0) {
      table.setPage(page);
    }
  }, [searchParams, updateFilters, table]);

  // Handle upload record
  const upload_record = searchParams.get('upload_record');
  useEffect(() => {
    if (upload_record) {
      const newFilters = { ...filters, name: upload_record };
      setFilters(newFilters);
      updateFilters(newFilters);
    }
  }, [upload_record, filters, updateFilters]);

  // Filter and process data
  const dataFiltered = useMemo(() => {
    if (!companiesData || !Array.isArray(companiesData)) {
      return [];
    }

    let filtered = companiesData.filter(item => item != null);

    // Apply filters
    if (filters.name) {
      const searchTerm = filters.name.toLowerCase();
      filtered = filtered.filter(item => 
        item && (
          (item.name_english && item.name_english.toLowerCase().includes(searchTerm)) ||
          (item.name_arabic && item.name_arabic.toLowerCase().includes(searchTerm)) ||
          (item.commercial_name && item.commercial_name.toLowerCase().includes(searchTerm)) ||
          (item.province && item.province.toLowerCase().includes(searchTerm)) ||
          (item.country && item.country.toLowerCase().includes(searchTerm)) ||
          (item.city && item.city.toLowerCase().includes(searchTerm)) ||
          (item.email && item.email.toLowerCase().includes(searchTerm)) ||
          (item.phone_number_1 && item.phone_number_1.toLowerCase().includes(searchTerm)) ||
          (item.type_of_specialty_1 && item.type_of_specialty_1.toLowerCase().includes(searchTerm)) ||
          (item.type_of_specialty_2 && item.type_of_specialty_2.toLowerCase().includes(searchTerm)) ||
          (item.unit_service_type && item.unit_service_type.toLowerCase().includes(searchTerm)) ||
          (item.sector && item.sector.toLowerCase().includes(searchTerm)) ||
          (item.info && item.info.toLowerCase().includes(searchTerm)) ||
          (item.upload_record === filters.name) ||
          (item._id === filters.name) ||
          (item.code && JSON.stringify(item.code) === filters.name)
        )
      );
    }

    if (filters.USType) {
      const searchTerm = filters.USType.toLowerCase();
      filtered = filtered.filter(item => 
        item && item.unit_service_type && item.unit_service_type.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.city) {
      const searchTerm = filters.city.toLowerCase();
      filtered = filtered.filter(item => 
        item && item.city && item.city.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.sector) {
      const searchTerm = filters.sector.toLowerCase();
      filtered = filtered.filter(item => 
        item && item.sector && item.sector.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.province) {
      const searchTerm = filters.province.toLowerCase();
      filtered = filtered.filter(item => 
        item && item.province && item.province.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.speciality1) {
      const searchTerm = filters.speciality1.toLowerCase();
      filtered = filtered.filter(item => 
        item && item.type_of_specialty_1 && item.type_of_specialty_1.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.speciality2) {
      const searchTerm = filters.speciality2.toLowerCase();
      filtered = filtered.filter(item => 
        item && item.type_of_specialty_2 && item.type_of_specialty_2.toLowerCase().includes(searchTerm)
      );
    }

    // Sort data
    const stabilizedThis = filtered.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = getComparator(table.order, table.orderBy)(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
  }, [companiesData, filters, table.order, table.orderBy]);

  // Get unique values for filters
  const uniqueUnitServiceTypes = useMemo(() => 
    [...new Set(dataFiltered.filter(item => item?.unit_service_type).map(item => item.unit_service_type))],
    [dataFiltered]
  );
  const uniqueCities = useMemo(() => 
    [...new Set(dataFiltered.filter(item => item?.city).map(item => item.city))],
    [dataFiltered]
  );
  const uniqueSectors = useMemo(() => 
    [...new Set(dataFiltered.filter(item => item?.sector).map(item => item.sector))],
    [dataFiltered]
  );
  const uniqueProvince = useMemo(() => 
    [...new Set(dataFiltered.filter(item => item?.province).map(item => item.province))],
    [dataFiltered]
  );

  const displayedColumns = TABLE_HEAD.filter((col) => visibleColumns[col.id]);
  const canReset = !!filters?.name;
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownload = () => {
    const excelBody = dataFiltered
      .filter(data => data != null)
      .map(data => ({
        code: data?.code || '',
        name: data?.name_english || '',
        description: data?.description || '',
      }));

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
      updateFilters(newFilters);
    },
    [table, filters, updateFilters]
  );

  const handleEditRow = useCallback(
    (id) => {
      const search = new URLSearchParams({
        ...(filters.name && { name: filters.name }),
        ...(filters.USType && { ust: filters.USType }),
        ...(filters.city && { city: filters.city }),
        ...(filters.sector && { sector: filters.sector }),
        ...(filters.province && { province: filters.province }),
        page: table.page,
      }).toString();

      router.push(`${paths.superadmin.tables.companies.edit(id)}?${search}`);
    },
    [router, filters, table.page]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({ name: '', USType: '', city: '', sector: '', province: '', speciality1: '', speciality2: '' });
    updateFilters({ name: '', USType: '', city: '', sector: '', province: '', speciality1: '', speciality2: '' });
  }, [updateFilters]);

  const handleShowAllChange = useCallback((newShowAll) => {
    setShowAll(newShowAll);
    updateShowAll(newShowAll);
  }, [updateShowAll]);

  const handleVisibleColumnsChange = useCallback((newVisibleColumns) => {
    setVisibleColumns(newVisibleColumns);
    updateEnabledColumns(newVisibleColumns);
  }, [updateEnabledColumns]);

  const handlePageChange = useCallback((event, newPage) => {
    table.onChangePage(event, newPage); // update table UI immediately
    updateTablePage(newPage);           // update context
  }, [table, updateTablePage]);

  const handleRowsPerPageChange = useCallback((event) => {
    table.onChangeRowsPerPage(event);   // update table UI immediately
    updateTablePage(0);                 // reset context page to 0
  }, [table, updateTablePage]);

  if (loading) {
    return <LoadingScreen />;
  }

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
            <Table ref={componentRef} size={table.dense ? 'small' : 'medium'}>
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
                      key={row?._id || idx}
                      index={idx}
                      row={row}
                      showAll={showAll}
                      selected={table.selected.includes(row?._id)}
                      onSelectRow={() => table.onSelectRow(row?._id)}
                      onEditRow={() => handleEditRow(row?._id)}
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
          setPage={(newPage) => {
            table.setPage(newPage);
            updateTablePage(newPage);
          }}
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



