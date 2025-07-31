import PropTypes from 'prop-types';
import { useTable, TableNoData, TableHeadCustom, TablePaginationCustom } from 'src/components/table';
import { getComparator } from 'src/components/table/utils';
import { LoadingScreen } from 'src/components/loading-screen';
import { useGetVideoCalls } from 'src/api/video_calls';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Scrollbar from 'src/components/scrollbar';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useTranslate, useLocales } from 'src/locales';
import { useState, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';

import UnitServiceVideoCallsRow from './table-details-row';

function getSortedData(data, order, orderBy) {
  return [...data].sort(getComparator(order, orderBy));
}

export default function UnitServiceVideoCallsTableView({ patient }) {
  const table = useTable({ defaultOrderBy: 'code' });
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'unit_service', label: t('unit of service') },
    { id: 'employee', label: t('employee') },
    { id: 'patient_name', label: t('patient') },
    { id: 'work_group', label: t('work group') },
    { id: 'duration', label: t('duration') },
    { id: 'description', label: t('description') },
    { id: 'actions', label: '', align: 'right' },
  ];

  const { data, isLoading } = useGetVideoCalls({ patient_id: patient?._id });
  const [search, setSearch] = useState('');
  
  const videoCalls = data?.videoCalls || data || [];
  const videoCallsWithNames = videoCalls.map((row) => ({
    ...row,
    patient_name: row.patient?.name_english || '',
  }));

  // Filter by search
  const filteredData = useMemo(() => {
    if (!search) return videoCallsWithNames;
    const lower = search.toLowerCase();
    return videoCallsWithNames.filter(
      (row) =>
        (row.code && row.code.toString().toLowerCase().includes(lower)) ||
        (row.patient_name && row.patient_name.toLowerCase().includes(lower)) ||
        (row.description && row.description.toLowerCase().includes(lower))
    );
  }, [search, videoCallsWithNames]);

  const sortedData = getSortedData(filteredData, table.order, table.orderBy);
  const dataInPage = sortedData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );
  const notFound = !isLoading && !filteredData.length;

  return (
    <Container maxWidth="xl">
      <Card>
        <Stack spacing={2} alignItems={{ xs: 'flex-end', md: 'center' }} direction={{ xs: 'column', md: 'row' }} sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}>
          <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
            <TextField
              fullWidth
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('Search by code, patient, or description...')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Stack>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={filteredData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length} align="center">
                      <LoadingScreen loading={isLoading} />
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && notFound && <TableNoData notFound={notFound} />}
                {!isLoading && !notFound &&
                  dataInPage.map((row, idx) => (
                    <UnitServiceVideoCallsRow
                      key={row.code || idx}
                      row={row}
                    />
                  ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={filteredData.length}
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

UnitServiceVideoCallsTableView.propTypes = {
  patient: PropTypes.object.isRequired,
}; 