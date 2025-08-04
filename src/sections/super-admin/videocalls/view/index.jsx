import PropTypes from 'prop-types';
import { useState, useCallback, useMemo } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Scrollbar from 'src/components/scrollbar';
import { fMinSec } from 'src/utils/format-time';
import { useGetVideoCalls } from 'src/api/video_calls';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

const TABLE_HEAD = [
  { id: 'code', label: 'code' },
  { id: 'unit_service', label: 'unit of service' },
  { id: 'employee', label: 'employee' },
  { id: 'patient_name', label: 'patient' },
  { id: 'work_group', label: 'work group' },
  { id: 'duration', label: 'duration' },
  { id: 'description', label: 'description' },
  { id: 'actions', label: '', align: 'right' },
];

export default function VideoCallsTableView() {
  const table = useTable({ defaultOrderBy: 'code' });
  const { t } = useTranslate();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetVideoCalls({
    page: 1,
    limit: 10,
  });

  // Filter by search
  const filteredData = useMemo(() => {
    if (!search) return data || [];
    const lower = search.toLowerCase();
    return (data || []).filter(
      (row) =>
        (row.code && row.code.toString().toLowerCase().includes(lower)) ||
        (row.unit_service?.name_english && row.unit_service.name_english.toLowerCase().includes(lower)) ||
        (row.employee?.name_english && row.employee.name_english.toLowerCase().includes(lower)) ||
        (row.patient?.name_english && row.patient.name_english.toLowerCase().includes(lower)) ||
        (row.work_group?.name_english && row.work_group.name_english.toLowerCase().includes(lower)) ||
        (row.description && row.description.toLowerCase().includes(lower))
    );
  }, [search, data]);

  const dataFiltered = applyFilter({
    inputData: filteredData,
    comparator: getCustomComparator(table.order, table.orderBy),
  });

  const notFound = (!dataFiltered.length && !!data?.length) || (!isLoading && !data?.length);

  if (isLoading) return <LoadingScreen />;

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Video Calls')}
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          { name: 'video calls' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <Stack
          spacing={2}
          alignItems={{ xs: 'flex-end', md: 'center' }}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
        >
          <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
            <TextField
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                      <TableCell align="center">{row.unit_service?.name_english || '-'}</TableCell>
                      <TableCell align="center">{row.employee?.name_english || '-'}</TableCell>
                      <TableCell align="center">{row.patient?.name_english || '-'}</TableCell>
                      <TableCell align="center">{row.work_group?.name_english || '-'}</TableCell>
                      <TableCell align="center">{fMinSec(row.duration)}</TableCell>
                      <TableCell align="center">{row.description || '-'}</TableCell>
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
          //
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
