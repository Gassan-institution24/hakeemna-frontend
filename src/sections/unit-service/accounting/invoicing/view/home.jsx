import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import useUSTypeGuard from 'src/auth/guard/USType-guard';
import { useGetUSAppointments, useGetAppointmentTypes } from 'src/api';

import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import AppointmentsRow from '../appointment-row';
import PatientHistoryToolbar from '../appointment-toolbar';
import HistoryFiltersResult from '../appointment-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'finished processing',
  types: '',
  shift: '',
  group: '',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function AppointmentsView() {
  const { t } = useTranslate();
  const { isMedLab } = useUSTypeGuard();

  const TABLE_HEAD = [
    { id: 'start_time', label: t('start time') },
    { id: 'appoint_number', label: t('number') },
    { id: 'appointment_type', label: t('appointment type') },
    { id: 'patient', label: t('patient') },
    isMedLab && { id: 'medicalAnalysis', label: t('medical analysis') },
    { id: 'work_group', label: t('work group') },
    { id: 'status', label: t('status') },
    { id: '' },
  ].filter(Boolean);

  const table = useTable({ defaultOrderBy: 'start_time', defaultOrder: 'desc' });

  const { user } = useAuthContext();

  const addModal = useBoolean();

  const { appointmenttypesData } = useGetAppointmentTypes();

  const [filters, setFilters] = useState({ ...defaultFilters, startDate: new Date() });

  const { appointmentsData, appointmentsLength, refetch, loading } = useGetUSAppointments(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
    {
      page: table.page || 0,
      sortBy: table.orderBy || 'code',
      rowsPerPage: table.rowsPerPage || 5,
      order: table.order || 'asc',
      invoiced: false,
      select: '_id appoint_number entrance unit_service work_group medicalAnalysis appointment_type patient start_time status',
      populate: [
        { path: 'unit_service', select: 'country', populate: [{ path: 'country', select: 'time_zone' }] },
        { path: 'work_group', select: 'name_english name_arabic' },
        { path: 'appointment_type', select: 'name_english name_arabic' },
        { path: 'appointment_type', select: 'name_english name_arabic' },
        { path: 'patient', select: 'name_english name_arabic' },
      ],
      ...filters,
    }
  );

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = appointmentsData;

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
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('invoicing')} /// edit
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          { name: t('invoicing') },
        ]}
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
          options={appointmenttypesData}
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
                rowCount={appointmentsLength}
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, appointmentsLength)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={appointmentsLength}
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
