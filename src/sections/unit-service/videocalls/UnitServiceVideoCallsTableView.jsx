import PropTypes from 'prop-types';
import { useTable, TableNoData, TableHeadCustom, TablePaginationCustom } from 'src/components/table';
import { getComparator } from 'src/components/table/utils';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
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
import { fMinSec } from 'src/utils/format-time';

import UnitServiceVideoCallsRow from './table-details-row';

export default function UnitServiceVideoCallsTableView({ patient }) {
  const table = useTable({ defaultOrderBy: 'code' });
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [search, setSearch] = useState('');

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
        (row.unit_service?.name_english && row.unit_service.name_english.toLowerCase().includes(lower)) ||
        (row.employee?.name_english && row.employee.name_english.toLowerCase().includes(lower)) ||
        (row.patient_name && row.patient_name.toLowerCase().includes(lower)) ||
        (row.work_group?.name_english && row.work_group.name_english.toLowerCase().includes(lower)) ||
        (row.description && row.description.toLowerCase().includes(lower))
    );
  }, [search, videoCallsWithNames]);

  const dataFiltered = applyFilter({
    inputData: filteredData,
    comparator: getCustomComparator(table.order, table.orderBy),
  });

  const notFound = (!dataFiltered.length && !!videoCallsWithNames.length) || (!isLoading && !videoCallsWithNames.length);

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs heading={t('Video calls')} links={[{ name: t('Video calls') }]} />
      <Card>
        <Stack spacing={2} alignItems={{ xs: 'flex-end', md: 'center' }} direction={{ xs: 'column', md: 'row' }} sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}>
          <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
            <TextField
              fullWidth
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('Search by code, patient, employee, or description...')}
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
                    <TableRow hover key={row.code || idx}>
                      <TableCell align="center">{row.code}</TableCell>
                      <TableCell align="center">
                        {curLangAr ? row.unit_service?.name_arabic || '-' : row.unit_service?.name_english || '-'}
                      </TableCell>
                      <TableCell align="center">
                        {curLangAr ? row.employee?.name_arabic || '-' : row.employee?.name_english || '-'}
                      </TableCell>
                      <TableCell align="center">
                        {curLangAr ? row.patient?.name_arabic || '-' : row.patient?.name_english || '-'}
                      </TableCell>
                      <TableCell align="center">
                        {curLangAr ? row.work_group?.name_arabic || '-' : row.work_group?.name_english || '-'}
                      </TableCell>
                      <TableCell align="center">{fMinSec(row.duration)}</TableCell>
                      <TableCell align="center">{row.description || '-'}</TableCell>
                      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                        <Iconify icon="eva:more-vertical-fill" />
                      </TableCell>
                    </TableRow>
                  ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
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

// ----------------------------------------------------------------------

function getCustomComparator(order, orderBy) {
  return (a, b) => {
    let aValue;
    let bValue;

    switch (orderBy) {
      case 'code':
        aValue = a.code || 0;
        bValue = b.code || 0;
        break;
      case 'unit_service':
        aValue = a.unit_service?.name_english || '';
        bValue = b.unit_service?.name_english || '';
        break;
      case 'employee':
        aValue = a.employee?.name_english || '';
        bValue = b.employee?.name_english || '';
        break;
      case 'patient_name':
        aValue = a.patient?.name_english || '';
        bValue = b.patient?.name_english || '';
        break;
      case 'work_group':
        aValue = a.work_group?.name_english || '';
        bValue = b.work_group?.name_english || '';
        break;
      case 'duration':
        aValue = a.duration || 0;
        bValue = b.duration || 0;
        break;
      case 'description':
        aValue = a.description || '';
        bValue = b.description || '';
        break;
      default:
        aValue = a[orderBy] || '';
        bValue = b[orderBy] || '';
    }

    // Handle numeric values for code and duration
    if (orderBy === 'code' || orderBy === 'duration') {
      if (order === 'desc') {
        return bValue - aValue;
      }
      return aValue - bValue;
    }

    // Handle string values
    if (order === 'desc') {
      return bValue.toString().localeCompare(aValue.toString());
    }
    return aValue.toString().localeCompare(bValue.toString());
  };
}

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}

UnitServiceVideoCallsTableView.propTypes = {
  patient: PropTypes.object.isRequired,
}; 