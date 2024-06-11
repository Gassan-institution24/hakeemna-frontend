import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { useTranslate } from 'src/locales';
import { useGetAppointmentTypes } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useGetStakeholderProducts } from 'src/api/product';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import AppointmentsRow from '../product-table-row';
import PatientHistoryToolbar from '../product-table-toolbar';
import HistoryFiltersResult from '../product-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: '',
  category: '',
};

// ----------------------------------------------------------------------

export default function AppointmentsView({ employeeData }) {
  const { t } = useTranslate();

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'name_english', label: t('product') },
    { id: 'category', label: t('category') },
    { id: 'quantity', label: t('quantity') },
    { id: 'price', label: t('price') },
    // { id: 'currency', label: t('currency') },
    { id: 'status', label: t('status') },
    { id: '' },
  ];

  const table = useTable({ defaultOrderBy: 'code' });

  const { user } = useAuthContext();

  const addModal = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const {
    productsData,
    length,
    refetch,
  } = useGetStakeholderProducts(user.stakeholder._id, {
    page: table.page || 0,
    sortBy: table.orderBy || 'code',
    rowsPerPage: table.rowsPerPage || 25,
    order: table.order || 'asc',
    populate: 'category currency',
    ...filters,
  });

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = productsData;

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !isEqual(filters, defaultFilters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('products')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('products') },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.stakeholder.products.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('new product')}
          </Button>
        }
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
            results={dataFiltered.length}
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
                {dataFiltered
                  ?.map((row, idx) => (
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

AppointmentsView.propTypes = {
  employeeData: PropTypes.object,
};
