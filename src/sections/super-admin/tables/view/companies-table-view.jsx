import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';
import { Checkbox, Typography, ListItemText } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetCompanies } from 'src/api';
import { CompaniesContext } from 'src/context/companiesContext';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover from 'src/components/custom-popover';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import MobileRow from '../../mobile-row';
import TableDetailFilters from './table-details-filters';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailRow from '../companies_list/table-details-row';
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
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
  const handleSetState = useCallback(
    (newState) => {
      setState((prevState) => ({ ...prevState, ...newState }));
    },
    [setState]
  );

  const [showAll, setShowAll] = useState(savedShowAll || false);
  const [filters, setFilters] = useState(savedFilters || defaultFilters);
  const [visibleColumns, setVisibleColumns] = useState(savedVisibleColumns || {});
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

  const handleShowAllChange = useCallback(
    (newShowAll) => {
      setShowAll(newShowAll);
      handleSetState({ savedShowAll: newShowAll });
    },
    [handleSetState]
  );

  const handleVisibleColumnsChange = useCallback(
    (newVisibleColumns) => {
      setVisibleColumns(newVisibleColumns);
      handleSetState({ savedVisibleColumns: newVisibleColumns });
    },
    [handleSetState]
  );

  const handlePageChange = useCallback(
    (event, newPage) => {
      table.onChangePage(event, newPage);
      handleSetState({ savedPage: newPage });
    },
    [table, handleSetState]
  );

  const handleSetPage = useCallback(
    (newPage) => {
      table.setPage(newPage);
      handleSetState({ savedPage: newPage });
    },
    [table, handleSetState]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      table.onChangeRowsPerPage(event);
      handleSetState({ savedPage: 0 });
    },
    [table, handleSetState]
  );
  const getMobileFields = (row) =>
    TABLE_HEAD.filter((col) => col.id && visibleColumns[col.id]).map((col) => ({
      label: col.label,
      value: renderCompanyCell({
        columnId: col.id,
        row,
        showAll,
        handlers: {
          onStatusChange: async (e) => {
            await axiosInstance.patch(endpoints.companies.one(row._id), { status: e.target.value });
          },
        },
      }),
    }));

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
                  title={row?.commercial_name || row?.name_english}
                  fields={getMobileFields(row)}
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
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.user_creation?.email}
              </Box>

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
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.ip_address_user_modification}
              </Box>

              <Box sx={{ pt: 1, fontWeight: 600 }}>
                Modifications No: {ddlRow.modifications_nums}
              </Box>
            </>
          )}
        </CustomPopover>
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
    const trimmedName = name.trim().toLowerCase();
    inputData = inputData.filter(
      (data) =>
        // Basic company names (English and Arabic)
        (data?.name_english &&
          data?.name_english?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.name_arabic &&
          data?.name_arabic?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.commercial_name &&
          data?.commercial_name?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        // Location fields (English and Arabic)
        (data?.province_english &&
          data?.province_english?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.province_arabic &&
          data?.province_arabic?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.province && data?.province?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.country_english &&
          data?.country_english?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.country_arabic &&
          data?.country_arabic?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.country && data?.country?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.city_english &&
          data?.city_english?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.city_arabic &&
          data?.city_arabic?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.city && data?.city?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        // Service and sector fields (English and Arabic)
        (data?.unit_service_type_english &&
          data?.unit_service_type_english?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.unit_service_type_arabic &&
          data?.unit_service_type_arabic?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.unit_service_type &&
          data?.unit_service_type?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.sector_english &&
          data?.sector_english?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.sector_arabic &&
          data?.sector_arabic?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.sector && data?.sector?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        // Specialty fields (English and Arabic)
        (data?.type_of_specialty_1_english &&
          data?.type_of_specialty_1_english?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.type_of_specialty_1_arabic &&
          data?.type_of_specialty_1_arabic?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.type_of_specialty_1 &&
          data?.type_of_specialty_1?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.type_of_specialty_2_english &&
          data?.type_of_specialty_2_english?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.type_of_specialty_2_arabic &&
          data?.type_of_specialty_2_arabic?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.type_of_specialty_2 &&
          data?.type_of_specialty_2?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        // Other fields
        (data?.email && data?.email?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.phone_number_1 &&
          data?.phone_number_1?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.info_english &&
          data?.info_english?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.info_arabic &&
          data?.info_arabic?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        (data?.info && data?.info?.trim()?.toLowerCase().indexOf(trimmedName) !== -1) ||
        // Exact matches
        data?.upload_record === name ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  if (USType) {
    const trimmedUSType = USType.trim().toLowerCase();
    inputData = inputData.filter(
      (data) =>
        (data?.unit_service_type_english &&
          data?.unit_service_type_english?.trim()?.toLowerCase().indexOf(trimmedUSType) !== -1) ||
        (data?.unit_service_type_arabic &&
          data?.unit_service_type_arabic?.trim()?.toLowerCase().indexOf(trimmedUSType) !== -1) ||
        (data?.unit_service_type &&
          data?.unit_service_type?.trim()?.toLowerCase().indexOf(trimmedUSType) !== -1)
    );
  }

  if (city) {
    const trimmedCity = city.trim().toLowerCase();
    inputData = inputData.filter(
      (data) =>
        (data?.city_english &&
          data?.city_english?.trim()?.toLowerCase().indexOf(trimmedCity) !== -1) ||
        (data?.city_arabic &&
          data?.city_arabic?.trim()?.toLowerCase().indexOf(trimmedCity) !== -1) ||
        (data?.city && data?.city?.trim()?.toLowerCase().indexOf(trimmedCity) !== -1)
    );
  }

  if (sector) {
    const trimmedSector = sector.trim().toLowerCase();
    inputData = inputData.filter(
      (data) =>
        (data?.sector_english &&
          data?.sector_english?.trim()?.toLowerCase().indexOf(trimmedSector) !== -1) ||
        (data?.sector_arabic &&
          data?.sector_arabic?.trim()?.toLowerCase().indexOf(trimmedSector) !== -1) ||
        (data?.sector && data?.sector?.trim()?.toLowerCase().indexOf(trimmedSector) !== -1)
    );
  }

  if (province) {
    const trimmedProvince = province.trim().toLowerCase();
    inputData = inputData.filter(
      (data) =>
        (data?.province_english &&
          data?.province_english?.trim()?.toLowerCase().indexOf(trimmedProvince) !== -1) ||
        (data?.province_arabic &&
          data?.province_arabic?.trim()?.toLowerCase().indexOf(trimmedProvince) !== -1) ||
        (data?.province && data?.province?.trim()?.toLowerCase().indexOf(trimmedProvince) !== -1)
    );
  }

  if (speciality1) {
    const trimmedSpeciality1 = speciality1.trim().toLowerCase();
    inputData = inputData.filter(
      (data) =>
        (data?.type_of_specialty_1_english &&
          data?.type_of_specialty_1_english?.trim()?.toLowerCase().indexOf(trimmedSpeciality1) !==
            -1) ||
        (data?.type_of_specialty_1_arabic &&
          data?.type_of_specialty_1_arabic?.trim()?.toLowerCase().indexOf(trimmedSpeciality1) !==
            -1) ||
        (data?.type_of_specialty_1 &&
          data?.type_of_specialty_1?.trim()?.toLowerCase().indexOf(trimmedSpeciality1) !== -1)
    );
  }

  if (speciality2) {
    const trimmedSpeciality2 = speciality2.trim().toLowerCase();
    inputData = inputData.filter(
      (data) =>
        (data?.type_of_specialty_2_english &&
          data?.type_of_specialty_2_english?.trim()?.toLowerCase().indexOf(trimmedSpeciality2) !==
            -1) ||
        (data?.type_of_specialty_2_arabic &&
          data?.type_of_specialty_2_arabic?.trim()?.toLowerCase().indexOf(trimmedSpeciality2) !==
            -1) ||
        (data?.type_of_specialty_2 &&
          data?.type_of_specialty_2?.trim()?.toLowerCase().indexOf(trimmedSpeciality2) !== -1)
    );
  }

  return inputData;
}

const renderCompanyCell = ({ columnId, row, showAll, handlers, isMobile = false }) => {
  const {
    code,
    unit_service_type,
    country,
    city,
    email,
    insurance,
    info,
    sector,
    commercial_name,
    province,
    address,
    phone_number_1,
    Phone_number_2,
    status,
    notes,
  } = row || {};

  switch (columnId) {
    case 'code':
      return <Box>{code || ''}</Box>;
    case 'unit_service_type':
      return unit_service_type || '';
    case 'country':
      return country || '';
    case 'city':
      return city || '';
    case 'email':
      return email || '';
    case 'sector':
      return sector || '';
    case 'commercial_name':
      return commercial_name || '';
    case 'province':
      return province || '';
    case 'address':
      return address || '';
    case 'phone_number_1':
      return phone_number_1 ? <a href={`tel:${phone_number_1}`}>{phone_number_1}</a> : '';
    case 'Phone_number_2':
      return Phone_number_2 ? <a href={`tel:${Phone_number_2}`}>{Phone_number_2}</a> : '';
    case 'status':
  return (
    <TextField select fullWidth value={status || ''} onChange={handlers?.onStatusChange}>
      <MenuItem value="not contact">لم يتم التواصل</MenuItem>
      <MenuItem value="agreed">قبول</MenuItem>
      <MenuItem value="refused">رفض</MenuItem>
    </TextField>
  );
    case 'insurance':
      return showAll && insurance;
    case 'info':
      return showAll && info;
    case 'notes':
      return showAll && notes;
    default:
      return null;
  }
};
