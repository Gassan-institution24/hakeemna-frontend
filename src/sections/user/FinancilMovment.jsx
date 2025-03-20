import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEconomicMovements } from 'src/api';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import InvoiceTableRow from './financial-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sequence_number', label: 'sequence' },
  { id: 'created_at', label: 'date' },
  { id: 'unit_service', label: 'unit of service' },
  { id: 'stakeholder', label: 'stakeholder' },
  { id: 'Balance', label: 'total amount' },
  { id: 'status', label: 'status' },
  { id: '', width: 120 },
];

const defaultFilters = {
  status: 'all',
};

// ----------------------------------------------------------------------

export default function InvoiceListView() {
  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'created_at' });
  const { user } = useAuthContext();

  const { t } = useTranslate();

  const [filters, setFilters] = useState(defaultFilters);

  const { economecMovementsData, lengths } = useGetEconomicMovements({
    patient: user?.patient._id,
    page: table.page || 0,
    sortBy: table.orderBy || 'created_at',
    rowsPerPage: table.rowsPerPage || 10,
    order: table.order || 'desc',
    populate: [
      { path: 'stakeholder', select: 'name_english name_arabic company_logo address phone ' },
      { path: 'unit_service', select: 'name_english name_arabic company_logo address phone ' },
      { path: 'patient', select: 'name_english name_arabic address mobile_num1' },
      { path: 'Provided_services', populate: 'service_type' },
      { path: 'provided_products', populate: 'product' },
    ],
    ...filters,
  });

  const canReset = !!filters.startDate || !!filters.endDate;

  const notFound = (!economecMovementsData.length && canReset) || !economecMovementsData.length;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: lengths.allLength || 0 },
    {
      value: 'paid',
      label: 'paid',
      color: 'success',
      count: lengths.paidLength || 0,
    },
    {
      value: 'installment',
      label: 'installment',
      color: 'warning',
      count: lengths.installmentLength || 0,
    },
    {
      value: 'insurance',
      label: 'insurance',
      color: 'info',
      count: lengths.insuranceLength || 0,
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

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.financilmovmentInfo(id));
    },
    [router]
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
                rowCount={economecMovementsData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {economecMovementsData.map((row) => (
                  <InvoiceTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                    onViewRow={() => handleViewRow(row._id)}
                    // onEditRow={() => handleEditRow(row.id)}
                  />
                ))}
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
