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
import { fMinSec } from 'src/utils/format-time';

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

function getSortedData(data, order, orderBy) {
  return [...data].sort(getComparator(order, orderBy));
}

export default function VideoCallsTableView() {
  const table = useTable({ defaultOrderBy: 'code' });
  const { data, isLoading } = useGetVideoCalls();

  const videoCalls = data?.videoCalls || data || [];

  const videoCallsWithNames = videoCalls.map((row) => ({
    ...row,
    patient_name: row.patient?.name_english || '',
  }));

  const sortedData = getSortedData(videoCallsWithNames, table.order, table.orderBy);
  const dataInPage = sortedData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const notFound = !isLoading && !videoCalls.length;

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs heading="Video calls" links={[{ name: 'Video calls' }]} />
      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={videoCalls.length}
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
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={videoCalls.length}
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
