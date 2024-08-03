// import { debounce } from 'lodash';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetIncomePaymentControl } from 'src/api';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import InvoiceTableRow from './financial-info-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sequence_number', label: 'sequence' },
  { id: 'due_date', label: 'due date' },
  { id: 'type', label: 'type' },
  { id: 'unit_service', label: 'unit of service' },
  { id: 'required_amount', label: 'required amount' },
  { id: 'balance', label: 'balance' },
  { id: '', width: 120 },
];

const defaultFilters = {
  status: 'all',
};

// ----------------------------------------------------------------------

export default function PaymentControlView() {
  const theme = useTheme();
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const { user } = useAuthContext();
  const { id } = useParams()

  const { t } = useTranslate();

  const [filters, setFilters] = useState({
    ...defaultFilters,
  });

  const { incomePaymentData, lengths, refetch } = useGetIncomePaymentControl({
    patient: user?.patient?._id,
    page: table.page || 0,
    sortBy: table.orderBy || 'created_at',
    rowsPerPage: table.rowsPerPage || 10,
    order: table.order || 'desc',
    economic_movement: id,
    select:
      'sequence_number receipt_voucher_num unit_service created_at economic_movement insurance is_it_installment due_date required_amount recieved balance',
    populate: [
      { path: 'unit_service', select: 'name_english name_arabic' },
      {
        path: 'receipt_voucher_num',
        populate: [
          { path: 'unit_service', select: 'name_english name_arabic company_logo address phone' },
          { path: 'patient', select: 'name_english name_arabic address mobile_num1' },
          { path: 'economic_movement', select: 'Total_Amount sequence_number' },
        ]
      }
    ],
    ...filters,
  });


  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !!filters.startDate || !!filters.endDate;

  const notFound = (!incomePaymentData.length && canReset) || !incomePaymentData.length;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: lengths.allLength || 0 },
    {
      value: 'paid',
      label: 'paid',
      color: 'success',
      count: lengths.paidLength || 0,
    },
    {
      value: 'pending',
      label: 'pending',
      color: 'warning',
      count: lengths.pendingLength || 0,
    },
  ];

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

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={t(tab.label)}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={incomePaymentData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {incomePaymentData.map((row) => (
                  <InvoiceTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    // onViewRow={() => handleViewRow(row.id)}
                    refetch={refetch}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, lengths.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={lengths.length}
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
