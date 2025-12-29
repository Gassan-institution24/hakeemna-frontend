import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';

import { fDate, fMinSec } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetVideoCalls } from 'src/api/video_calls';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import MobileRow from '../../MobileRow';

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
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
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
        (row.unit_service?.name_english &&
          row.unit_service.name_english.toLowerCase().includes(lower)) ||
        (row.employee?.name_english && row.employee.name_english.toLowerCase().includes(lower)) ||
        (row.patient?.name_english && row.patient.name_english.toLowerCase().includes(lower)) ||
        (row.work_group?.name_english &&
          row.work_group.name_english.toLowerCase().includes(lower)) ||
        (row.descriptionEn && row.descriptionEn.toLowerCase().includes(lower))
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
                  title={row?.name_english}
                  fields={[
                    {
                      label: 'Code',
                      value: row?.code,
                    },
                    {
                      label: 'Unit of Service',
                      value: row?.unit_service?.name_english,
                    },
                    {
                      label: 'Employee',
                      value: row?.employee?.name_english,
                    },
                    { label: 'Patient', value: row?.patient?.name_english },
                    { label: 'Work Group', value: row?.work_group?.name_english },
                    { label: 'Duration', value: fMinSec(row?.duration) },
                    { label: 'Description', value: row?.descriptionEn },
                  ]}
                  actions={[
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
                      <VideoCallTableRow row={row} idx={idx} t={t} />
                    ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

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
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow.user_creation?.email || '-'}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>created by IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          {ddlRow.ip_address_user_creation || '-'}
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
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('Editor')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          {ddlRow.user_modification?.email || '-'}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('Editor IP')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
          {ddlRow.ip_address_user_modification || '-'}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>
          {t('Modifications No')}: {ddlRow.modifications_nums || 0}
        </Box>
            </>
          )}
      </CustomPopover>
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
        aValue = a.descriptionEn || '';
        bValue = b.descriptionEn || '';
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

// ----------------------------------------------------------------------

function VideoCallTableRow({ row, idx, t }) {
  const popover = usePopover();
  const DDL = usePopover();

  return (
    <>
      <TableRow hover key={row.code || idx}>
        <TableCell align="center">{row.code}</TableCell>
        <TableCell align="center">{row.unit_service?.name_english || '-'}</TableCell>
        <TableCell align="center">{row.employee?.name_english || '-'}</TableCell>
        <TableCell align="center">{row.patient?.name_english || '-'}</TableCell>
        <TableCell align="center">{row.work_group?.name_english || '-'}</TableCell>
        <TableCell align="center">{fMinSec(row.duration)}</TableCell>
        <TableCell align="center">{row.descriptionEn || '-'}</TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem lang="ar" onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          {t('DDL')}
        </MenuItem>
      </CustomPopover>

      <CustomPopover
        open={DDL.open}
        onClose={DDL.onClose}
        arrow="right-top"
        sx={{
          padding: 2,
          fontSize: '14px',
        }}
      >
        <Box sx={{ fontWeight: 600 }}>Creation Time:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          <ListItemText
            primary={fDate(row.created_at, 'dd MMMMMMMM yyyy')}
            secondary={fDate(row.created_at, 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>created by:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{row.user_creation?.email || '-'}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>created by IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          {row.ip_address_user_creation || '-'}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editing Time:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          <ListItemText
            primary={fDate(row.updated_at, 'dd MMMMMMMM yyyy')}
            secondary={fDate(row.updated_at, 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('Editor')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          {row.user_modification?.email || '-'}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('Editor IP')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
          {row.ip_address_user_modification || '-'}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>
          {t('Modifications No')}: {row.modifications_nums || 0}
        </Box>
      </CustomPopover>
    </>
  );
}

VideoCallTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};
