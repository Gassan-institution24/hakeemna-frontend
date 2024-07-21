import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetUSOrders } from 'src/api';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import AppointmentsRow from '../orders-table-row';
import PatientHistoryToolbar from '../orders-table-toolbar';
import HistoryFiltersResult from '../orders-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: '',
  // category: '',
};

// ----------------------------------------------------------------------

export default function OrdersView() {
  const { t } = useTranslate();

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'stakeholder', label: t('stakeholder') },
    { id: 'products', label: t('products no.') },
    { id: 'note', label: t('note') },
    { id: 'status', label: t('status') },
    { id: '' },
  ];

  const searchParams = useSearchParams();

  const search = searchParams.get('name');

  const table = useTable({ defaultOrderBy: 'code' });

  const { user } = useAuthContext();

  const addModal = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const { ordersData, length, refetch } = useGetUSOrders(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    {
      page: table.page || 0,
      sortBy: table.orderBy || 'code',
      rowsPerPage: table.rowsPerPage || 10,
      order: table.order || 'asc',
      populate: 'stakeholder',
      ...filters,
    }
  );

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = ordersData;

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !isEqual(filters, defaultFilters);

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

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

  useEffect(() => {
    if (search) {
      setFilters((prev) => ({ ...prev, name: search }));
    }
  }, [search]);

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('orders')}
        links={[{ name: t('dashboard'), href: paths.dashboard.root }, { name: t('orders') }]}
        // action={
        //   <Button
        //     component={RouterLink}
        //     href={paths.stakeholder.products.new}
        //     variant="contained"
        //     startIcon={<Iconify icon="mingcute:add-line" />}
        //   >
        //     {t('new product')}
        //   </Button>
        // }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card>
        <PatientHistoryToolbar
          filters={filters}
          onFilters={handleFilters}
          onAdd={() => addModal.onTrue()}
          //
          dateError={dateError}
        />

        {canReset && (
          <HistoryFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={dataFiltered?.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered?.map((row, idx) => (
                  <AppointmentsRow
                    refetch={refetch}
                    key={idx}
                    row={row}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, length)}
                />

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
