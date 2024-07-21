import isEqual from 'lodash/isEqual';
import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetTrainings } from 'src/api';
import { useTranslate } from 'src/locales';

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

import TrainingRow from '../training-row';
import TrainingToolbar from '../training-toolbar';
import TrainingFiltersResult from '../training-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: '',
  // category: '',
};

// ----------------------------------------------------------------------

export default function TrainingsView() {
  const { t } = useTranslate();

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'full_name', label: t('name') },
    { id: 'topic', label: t('topic') },
    { id: 'email', label: t('email') },
    { id: 'mobile_num1', label: t('mobile number') },
    { id: 'status', label: t('status') },
    { id: '' },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const searchParams = useSearchParams();

  const search = searchParams.get('name');

  const table = useTable({ defaultOrderBy: 'code' });

  const addModal = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const { trainingData, length, refetch } = useGetTrainings({
    page: table.page || 0,
    sortBy: table.orderBy || 'code',
    rowsPerPage: table.rowsPerPage || 10,
    order: table.order || 'asc',
    populate: 'stakeholder',
    ...filters,
  });

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = trainingData;

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

  const handleChangeStatus = useCallback(
    async (id, status) => {
      try {
        await axiosInstance.patch(endpoints.training.one(id), { status });
        enqueueSnackbar('changed successfully');
        refetch();
      } catch (e) {
        enqueueSnackbar(e.message, { variant: 'error' });
      }
    },
    [enqueueSnackbar, refetch]
  );

  useEffect(() => {
    if (search) {
      setFilters((prev) => ({ ...prev, name: search }));
    }
  }, [search]);

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('training')}
        links={[{ name: t('dashboard'), href: paths.dashboard.root }, { name: t('training') }]}
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
        <TrainingToolbar
          filters={filters}
          onFilters={handleFilters}
          onAdd={() => addModal.onTrue()}
          //
          dateError={dateError}
        />

        {canReset && (
          <TrainingFiltersResult
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
                  <TrainingRow
                    refetch={refetch}
                    key={idx}
                    row={row}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                    onChangeStatus={handleChangeStatus}
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
