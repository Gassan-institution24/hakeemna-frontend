import { Helmet } from 'react-helmet-async';
import { useState, useCallback } from 'react';

import {
  Card,
  Table,
  Stack,
  TableRow,
  TableCell,
  TextField,
  Container,
  TableBody,
  InputAdornment,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetUSPatients } from 'src/api';
import { useDebounce } from 'src/hooks/use-debounce';
import { useLocales, useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------

export default function DentalHomePage() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const router = useRouter();
  const { user } = useAuthContext();

  const table = useTable({ defaultOrderBy: 'code' });
  const [name, setName] = useState('');
  const filtersToSend = useDebounce({ name, status: 'active' });

  const unitServiceId =
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service?._id;

  const { patientsData, length } = useGetUSPatients(unitServiceId, {
    select: 'patient name_english name_arabic file_code',
    populate: [
      {
        path: 'patient',
        select: 'name_english name_arabic sequence_number',
        populate: { path: 'nationality', select: 'code' },
      },
    ],
    page: table.page || 0,
    sortBy: table.orderBy || 'code',
    rowsPerPage: table.rowsPerPage || 10,
    order: table.order || 'asc',
    ...filtersToSend,
  });

  const TABLE_HEAD = [
    { id: 'name_english', label: t('name in english') },
    { id: 'name_arabic', label: t('name in arabic') },
    { id: 'file_code', label: t('file code') },
    { id: 'open', label: '', width: 60 },
  ];

  const notFound = !patientsData.length;

  const handleSearch = useCallback(
    (event) => {
      table.onResetPage();
      setName(event.target.value);
    },
    [table]
  );

  const openChart = (patientId) => router.push(paths.unitservice.dental.patient(patientId));

  return (
    <>
      <Helmet>
        <title> {t('dental chart')} </title>
      </Helmet>

      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={t('dental chart')}
          links={[
            { name: t('dashboard'), href: paths.superadmin.root },
            { name: t('dental chart') },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Stack sx={{ p: 2.5 }}>
            <TextField
              value={name}
              onChange={handleSearch}
              placeholder={t('search')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <TableContainer>
            <Scrollbar>
              <Table>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={table.onSort}
                />

                <TableBody>
                  {patientsData.map((row) => (
                    <TableRow
                      key={row._id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => openChart(row._id)}
                    >
                      <TableCell>{row.name_english || row.patient?.name_english}</TableCell>
                      <TableCell>{row.name_arabic || row.patient?.name_arabic}</TableCell>
                      <TableCell>{row.file_code}</TableCell>
                      <TableCell align="right">
                        <Iconify
                          icon="mdi:tooth-outline"
                          sx={{ color: 'primary.main' }}
                          title={t('dental chart')}
                        />
                      </TableCell>
                    </TableRow>
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
          />
        </Card>
      </Container>
    </>
  );
}
