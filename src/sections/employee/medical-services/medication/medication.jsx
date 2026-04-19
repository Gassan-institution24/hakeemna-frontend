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

import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover from 'src/components/custom-popover';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  MobileRow,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table'; /// edit

import { useGetFavoriteMedication } from 'src/api/doctor_favorite';

import TableDetailRow from './medication_row'; /// edit

import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function Medication() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'favorite_name', label: t('name in english') },
    { id: 'favorite_name_ar', label: t('name in arabic') },
    { id: 'medicine', label: t('medicines') },

    { id: '', width: 88 },
  ];
  const isMobile = useMediaQuery('(max-width:899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);

  /// edit
  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  const router = useRouter();
  const { favoriteMedication, loading } = useGetFavoriteMedication();
  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: favoriteMedication,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const canReset = !!filters?.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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

  // const handleEditRow = useCallback(
  //     (id) => {
  //         router.push(paths.unitservice.employees.edit(id)); /// edit
  //     },
  //     [router]
  // );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.employee.medicalServices.medication.view(id)); /// edit
    },
    [router]
  );
  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.employee.medicalServices.medication.edit(id)); /// edit
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
        heading={t('medicines')} /// edit
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.root,
          },
          { name: t('favorite') }, /// edit
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.employee.medicalServices.medication.new} /// edit
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('create a favorite list')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
          mt: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <TableDetailToolbar
          onPrint={printHandler}
          filters={filters}
          onFilters={handleFilters}
          // onDownload={handleDownload}
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
                      onClick={() => handleViewRow(row._id)}
                    >
                      {curLangAr ? row?.favorite_name_ar : row?.favorite_name}
                    </Box>
                  }
                  fields={[
                    { label: t('code'), value: row.code },
                    { label: t('name arabic'), value: row.favorite_name_ar },
                    {
                      label: t('medicines'),
                      value: row.medicines?.map((i) => i?.medicine?.trade_name).join(', '),
                    },
                  ]}
                  actions={[
                    {
                      label: t('view'),
                      icon: 'solar:eye-bold',
                      onClick: () => handleViewRow(row._id),
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
                        filters={filters}
                        setFilters={setFilters}
                        onViewRow={() => handleViewRow(row._id)}
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData = [], comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData = stabilizedThis.map((el) => el[0]);

  if (name) {
    const search = name.toLowerCase();

    filteredData = filteredData.filter((data) => {
      const nameEn = data.favorite_name?.toLowerCase() || '';
      const nameAr = data.favorite_name_ar?.toLowerCase() || '';
      const note = data.note?.toLowerCase() || '';
      const code = String(data.code || '');

      const analysesMatch =
        data.medical_analysis?.some(
          (analysis) =>
            analysis.name_english?.toLowerCase().includes(search) ||
            analysis.name_arabic?.toLowerCase().includes(search)
        ) || false;

      return (
        nameEn.includes(search) ||
        nameAr.includes(search) ||
        note.includes(search) ||
        code.includes(search) ||
        analysesMatch
      );
    });
  }

  return filteredData;
}
