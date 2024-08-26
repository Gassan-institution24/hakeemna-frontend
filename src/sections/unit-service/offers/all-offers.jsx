import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetOffers } from 'src/api';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import AppointmentsRow from './product-table-row';
import PatientHistoryToolbar from './product-table-toolbar';
import HistoryFiltersResult from './product-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function OffersView({ employeeData }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'name_english', label: t('offer') },
    { id: 'stakeholder', label: t('supplier') },
    { id: 'products', label: t('products no.') },
  ];

  const table = useTable({ defaultOrderBy: 'code' });

  const { shid } = useParams();

  const addModal = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const queryOptions = useMemo(
    () => ({
      status: 'published',
      to_unit_service: true,
      populate: 'stakeholder products.product',
      unit_service:
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ._id,
      ...(shid && { stakeholder: shid }),
    }),
    [shid, user]
  );

  const { offersData, length, refetch } = useGetOffers(queryOptions);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: offersData,
    filters,
  });

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

OffersView.propTypes = {
  employeeData: PropTypes.object,
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, sortBy }) {
  const { name } = filters;

  if (name && name !== '') {
    inputData = inputData.filter(
      (data) =>
        (data?.name_english &&
          data?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.name_arabic &&
          data?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.stakeholder?.name_english &&
          data?.stakeholder?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.stakeholder?.name_arabic &&
          data?.stakeholder?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.products &&
          data?.products.some(
            (one) =>
              one?.name_english?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
              one?.name_arabic?.toLowerCase().indexOf(name.toLowerCase()) !== -1
          )) ||
        (data?.description_english &&
          data?.description_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.description_arabic &&
          data?.description_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        data?._id === name ||
        JSON.stringify(data.code) === name
    );
  }

  return inputData;
}
