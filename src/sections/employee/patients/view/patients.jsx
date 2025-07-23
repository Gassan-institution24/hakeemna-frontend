import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { useGetUSPatients } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table'; /// edit

import { useSnackbar } from 'notistack';

import { Button } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useDebounce } from 'src/hooks/use-debounce';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';

import Iconify from 'src/components/iconify';
import { addWorkGroupColors } from 'src/utils/workgroupColors';

import TableDetailRow from '../patients_row'; /// edit
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'active',
};

// ----------------------------------------------------------------------

export default function PatientTableView() {
  const table = useTable({ defaultOrderBy: 'code' });

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'name_english', label: t('name in english') },
    { id: 'name_arabic', label: t('name in arabic') },
    { id: 'work_group', label: t('work group') },
    { id: 'file_code', label: t('file code') },
  ];

  const checkAcl = useAclGuard();

  const componentRef = useRef();

  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState(defaultFilters);
  const filtersToSend = useDebounce(filters);

  const { patientsData, refetch, length } = useGetUSPatients(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service?._id,
    {
      select: 'patient name_english name_arabic file_code',
      populate: [
        {
          path: 'patient',
          select: 'name_english name_arabic sequence_number',
          populate: { path: 'nationality', select: 'code' },
        },
        { path: 'work_group', select: 'name_english name_arabic' },
      ],
      employee: user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?._id,
      page: table.page || 0,
      sortBy: table.orderBy || 'code',
      rowsPerPage: table.rowsPerPage || 5,
      order: table.order || 'asc',
      ...filtersToSend,
    }
  );

  const patientsDataWithColors = addWorkGroupColors(patientsData, 'hex');

  const canReset = !!filters?.name || filters.status !== 'active';

  const notFound = (!patientsData.length && canReset) || !patientsData.length;

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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await axiosInstance.delete(endpoints.usPatients.one(id));
        enqueueSnackbar(t('deleted successfully'));
        refetch();
      } catch (error) {
        enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
          variant: 'error',
        });
      }
    },
    [enqueueSnackbar, refetch, curLangAr, t]
  );

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('patients')} /// edit
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.root,
          },
          { name: t("institution's patients") }, /// edit
        ]}
        action={
          checkAcl({
            category: 'unit_service',
            subcategory: 'unit_service_info',
            acl: 'create',
          }) && (
            <Button
              component={RouterLink}
              href={paths.employee.patients.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('add')}
            </Button>
          ) /// edit
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
            results={length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer>
          <TableSelectedAction
            numSelected={table.selected.length}
            rowCount={patientsData.length}
            color={
              patientsData
                .filter((row) => table.selected.includes(row._id))
                .some((info) => info.status === 'inactive')
                ? 'primary'
                : 'error'
            }
          />

          <Scrollbar>
            <Table ref={componentRef} size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={patientsData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {patientsDataWithColors.map((row, idx) => (
                  <TableDetailRow
                    key={idx}
                    row={row}
                    filters={filters}
                    setFilters={setFilters}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                    onDeleteRow={() => handleDeleteRow(row._id)}
                  />
                ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={length}
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
