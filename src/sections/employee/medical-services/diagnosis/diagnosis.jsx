/* eslint-disable import/no-unresolved */
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
import { useGetFavoriteDiagnosis } from 'src/api/doctor_favorite';

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
} from 'src/components/table';

import DiagnosisTableRow from './diagnosis_row';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

const defaultFilters = { name: '' };

export default function FavoriteDiagnosisList() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'favorite_name', label: t('name in english') },
    { id: 'favorite_name_ar', label: t('name in arabic') },
    { id: 'diagnoses', label: t('diagnoses') },
    { id: 'note', label: t('note') },
    { id: '', width: 88 },
  ];

  const isMobile = useMediaQuery('(max-width:899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);
  const ddlOpen = Boolean(ddlAnchorEl);

  const table = useTable({ defaultOrderBy: 'code' });
  const componentRef = useRef();
  const router = useRouter();

  const { favoriteDiagnosis, loading } = useGetFavoriteDiagnosis();
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: favoriteDiagnosis,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const canReset = !!filters?.name;
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const printHandler = useReactToPrint({ content: () => componentRef.current });

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [table]
  );

  const handleViewRow = useCallback(
    (id) => { router.push(paths.employee.medicalServices.diagnosis.view(id)); },
    [router]
  );

  const handleEditRow = useCallback(
    (id) => { router.push(paths.employee.medicalServices.diagnosis.edit(id)); },
    [router]
  );

  const handleResetFilters = useCallback(() => { setFilters(defaultFilters); }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('Favorite Diagnosis')}
        links={[
          { name: t('dashboard'), href: paths.superadmin.root },
          { name: t('favorite') },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.employee.medicalServices.diagnosis.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('create a favorite list')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 }, mt: { xs: 3, md: 5 } }}
      />

      <Card>
        <TableDetailToolbar
          onPrint={printHandler}
          filters={filters}
          onFilters={handleFilters}
          canReset={canReset}
          onResetFilters={handleResetFilters}
        />

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
              .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
              .map((row) => (
                <MobileRow
                  key={row._id}
                  title={
                    <Box
                      sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 600 }}
                      onClick={() => handleViewRow(row._id)}
                    >
                      {curLangAr ? row?.favorite_name_ar : row?.favorite_name}
                    </Box>
                  }
                  fields={[
                    { label: t('code'), value: row.code },
                    { label: t('name arabic'), value: row.favorite_name_ar },
                    { label: t('diagnoses'), value: row.diagnoses?.map((d) => d.name).join(', ') },
                    { label: t('note'), value: row.note },
                  ]}
                  actions={[
                    { label: t('view'), icon: 'solar:eye-bold', onClick: () => handleViewRow(row._id) },
                    { label: t('edit'), icon: 'fluent:edit-32-filled', onClick: () => handleEditRow(row._id) },
                    {
                      label: t('DDL'),
                      icon: 'carbon:data-quality-definition',
                      onClick: (event) => { setDdlRow(row); setDdlAnchorEl(event.currentTarget); },
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
                    .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                    .map((row, idx) => (
                      <DiagnosisTableRow
                        key={idx}
                        row={row}
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
          sx={{ padding: 2, fontSize: '14px', minWidth: 260 }}
        >
          {ddlRow && (
            <>
              <Box sx={{ fontWeight: 600 }}>{t('creation time')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                <ListItemText
                  primary={fDate(ddlRow.created_at, 'dd MMMMMMMM yyyy')}
                  secondary={fDate(ddlRow.created_at, 'p')}
                  primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                  secondaryTypographyProps={{ component: 'span', typography: 'caption' }}
                />
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow.user_creation?.email}</Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by IP')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow.ip_address_user_creation}</Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editing time')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                <ListItemText
                  primary={fDate(ddlRow.updated_at, 'dd MMMMMMMM yyyy')}
                  secondary={fDate(ddlRow.updated_at, 'p')}
                  primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                  secondaryTypographyProps={{ component: 'span', typography: 'caption' }}
                />
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow.user_modification?.email}</Box>
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
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}

function applyFilter({ inputData = [], comparator, filters }) {
  const { name } = filters;
  const stabilized = inputData.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  let result = stabilized.map((el) => el[0]);
  if (name) {
    const search = name.toLowerCase();
    result = result.filter((row) => {
      const nameEn = row.favorite_name?.toLowerCase() || '';
      const nameAr = row.favorite_name_ar?.toLowerCase() || '';
      const note = row.note?.toLowerCase() || '';
      const code = String(row.code || '');
      const diagMatch = row.diagnoses?.some((d) => d.name?.toLowerCase().includes(search)) || false;
      return nameEn.includes(search) || nameAr.includes(search) || note.includes(search) || code.includes(search) || diagMatch;
    });
  }
  return result;
}
