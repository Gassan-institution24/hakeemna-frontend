import sumBy from 'lodash/sumBy';
import PropTypes from 'prop-types';

import {
  Box,
  Card,
  Stack,
  Table,
  Divider,
  TableRow,
  Skeleton,
  Container,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { useGetPatientIncomePaymentControl } from 'src/api';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { ProfilePaneHeader } from 'src/sections/shared/patient-profile/profile-pane';

// ----------------------------------------------------------------------

// Derive a status from the stored fields (the backend does not persist one).
function getStatus(row) {
  if (row?.recieved) return 'paid';
  if (row?.due_date && new Date(row.due_date).getTime() < Date.now()) return 'overdue';
  return 'pending';
}

const STATUS_COLOR = { paid: 'success', pending: 'warning', overdue: 'error' };

function getPaidAmount(row) {
  if (!row?.recieved) return 0;
  return row.real_amount_approved ?? row.total_amount ?? row.required_amount ?? 0;
}

// ----------------------------------------------------------------------

export default function PatientFinancial({ patient }) {
  const { t } = useTranslate();

  const patientId = patient?.patient?._id;

  const table = useTable({ defaultOrderBy: 'code', defaultOrder: 'desc' });

  const { incomePaymentData, loading } = useGetPatientIncomePaymentControl(patientId);

  const rows = Array.isArray(incomePaymentData) ? incomePaymentData : [];

  const totalRequired = sumBy(rows, (r) => r.required_amount || 0);
  const totalPaid = sumBy(rows, (r) => getPaidAmount(r));
  const balance = totalRequired - totalPaid;

  const TABLE_HEAD = [
    { id: 'code', label: t('Code') },
    { id: 'concept', label: t('Concept') },
    { id: 'required_amount', label: t('Required Amount') },
    { id: 'paid_amount', label: t('Paid Amount') },
    { id: 'due_date', label: t('Due Date') },
    { id: 'status', label: t('Status') },
  ];

  const header = (
    <ProfilePaneHeader
      icon="solar:wallet-money-bold-duotone"
      title={t('Financial Information')}
      count={rows.length}
    />
  );

  // A walk-in with no linked patient account has no ledger to show. Say that
  // under the same heading rather than swapping the whole pane for one line.
  if (!patientId) {
    return (
      <Container sx={{ py: 3 }} maxWidth="xl">
        {header}
        <Card sx={{ py: 8, textAlign: 'center' }}>
          <Typography color="text.secondary">{t('No financial records')}</Typography>
        </Card>
      </Container>
    );
  }

  // A full-screen LoadingScreen used to take over here, blanking the banner and
  // the rail with it -- so the whole chart flickered when you opened this one
  // section. The skeleton stays inside the pane instead.
  if (loading) {
    return (
      <Container sx={{ py: 3 }} maxWidth="xl">
        {header}
        <Card sx={{ mb: 3, p: 2 }}>
          <Skeleton variant="rounded" height={56} />
        </Card>
        <Card sx={{ p: 2 }}>
          <Skeleton variant="rounded" height={320} />
        </Card>
      </Container>
    );
  }

  const paginated = rows.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  return (
    <Container sx={{ py: 3 }} maxWidth="xl">
      {header}

      {/* Summary */}
      <Card sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
          sx={{ py: 2 }}
        >
          <SummaryItem label={t('Total')} value={rows.length} />
          <SummaryItem label={t('Required Amount')} value={fCurrency(totalRequired)} />
          <SummaryItem label={t('Paid Amount')} value={fCurrency(totalPaid)} color="success.main" />
          <SummaryItem
            label={t('Balance')}
            value={fCurrency(balance)}
            color={balance > 0 ? 'error.main' : 'text.primary'}
          />
        </Stack>
      </Card>

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size="medium" sx={{ minWidth: 720 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={rows.length}
                onSort={table.onSort}
              />

              <TableBody>
                {paginated.map((row) => {
                  const status = getStatus(row);
                  return (
                    <TableRow key={row._id} hover>
                      <TableCell align="center">{row.code || '-'}</TableCell>
                      <TableCell align="center">
                        {row.concept || t(row.movements_type) || '-'}
                      </TableCell>
                      <TableCell align="center">{fCurrency(row.required_amount || 0)}</TableCell>
                      <TableCell align="center">{fCurrency(getPaidAmount(row))}</TableCell>
                      <TableCell align="center">
                        {row.due_date ? fDate(row.due_date) : '-'}
                      </TableCell>
                      <TableCell align="center">
                        <Label variant="soft" color={STATUS_COLOR[status] || 'default'}>
                          {t(status)}
                        </Label>
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableNoData notFound={!rows.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={rows.length}
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

PatientFinancial.propTypes = { patient: PropTypes.object };

// ----------------------------------------------------------------------

function SummaryItem({ label, value, color = 'text.primary' }) {
  return (
    <Box sx={{ px: 3, py: 0.5, flex: 1, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ color }}>
        {value}
      </Typography>
    </Box>
  );
}

SummaryItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
