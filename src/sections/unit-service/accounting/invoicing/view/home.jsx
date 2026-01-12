import { isValid } from 'date-fns';
import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { ListItemText } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import useUSTypeGuard from 'src/auth/guard/USType-guard';
import { useGetUSAppointments, useGetAppointmentTypes } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import {
  useTable,
  MobileRow,
  TableNoData,
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
  appointype: '',
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
  const isMobile = useMediaQuery('(max-width:899px)');
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const table = useTable({ defaultOrderBy: 'start_time', defaultOrder: 'desc' });
  const router = useRouter();

  const { user } = useAuthContext();

  const addModal = useBoolean();

  const { appointmenttypesData } = useGetAppointmentTypes();

  const [filters, setFilters] = useState({ ...defaultFilters, startDate: new Date() });

  const { appointmentsData, lengths, refetch, loading } = useGetUSAppointments(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service._id,
    {
      page: table.page || 0,
      sortBy: table.orderBy || 'code',
      rowsPerPage: table.rowsPerPage || 5,
      order: table.order || 'asc',
      invoiced: false,
      select:
        '_id appoint_number entrance unit_service work_group medicalAnalysis appointment_type patient start_time status',
      populate: [
        {
          path: 'unit_service',
          select: 'country',
          populate: [{ path: 'country', select: 'time_zone' }],
        },
        { path: 'work_group', select: 'name_english name_arabic' },
        { path: 'appointment_type', select: 'name_english name_arabic' },
        { path: 'appointment_type', select: 'name_english name_arabic' },
        { path: 'patient', select: 'name_english name_arabic' },
        { path: 'unit_service_patient', select: 'name_english name_arabic' },
      ],
      ...filters,
    }
  );

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = appointmentsData;

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
  const getPatientName = (row) => {
    if (row?.patient) {
      return curLangAr ? row.patient.name_arabic : row.patient.name_english;
    }

    if (row?.unit_service_patient) {
      return curLangAr
        ? row.unit_service_patient.name_arabic
        : row.unit_service_patient.name_english;
    }

    return '-';
  };

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

        {isMobile ? (
          <>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <MobileRow
                  fields={[
                    {
                      label: t('start time'),
                      value: (
                        <ListItemText
                          primary={
                            isValid(new Date(row.start_time)) &&
                            new Date(row.start_time).toLocaleTimeString(t('en-US'), {
                              timeZone: row.unit_service?.country?.time_zone || 'Asia/Amman',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          }
                          secondary={
                            isValid(new Date(row.start_time)) &&
                            new Date(row.start_time).toLocaleDateString(t('en-US'), {
                              timeZone: row.unit_service?.country?.time_zone || 'Asia/Amman',
                            })
                          }
                          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                          secondaryTypographyProps={{
                            mt: 0.5,
                            component: 'span',
                            typography: 'caption',
                          }}
                        />
                      ),
                    },
                    {
                      label: t('number'),
                      value: row.appoint_number,
                    },
                    {
                      label: t('appointment type'),
                      value: curLangAr
                        ? row.appointment_type?.name_arabic
                        : row.appointment_type?.name_english,
                    },
                    {
                      label: t('patient'),
                      value: (
                        <Box
                          sx={{
                            cursor: 'pointer',
                            color: 'primary.main',
                            fontWeight: 600,
                          }}
                          onClick={() => {
                            if (row.unit_service_patient)
                              router.push(
                                paths.employee.patients.info(row.unit_service_patient?._id)
                              );
                          }}
                        >
                          {getPatientName(row)}
                        </Box>
                      ),
                    },
                    ...(isMedLab
                      ? [
                          {
                            label: t('medical analysis'),
                            value: (
                              <Iconify
                                icon={
                                  row.medicalAnalysis ? 'eva:checkmark-fill' : 'mingcute:close-line'
                                }
                                width={16}
                              />
                            ),
                          },
                        ]
                      : []),
                    {
                      label: t('work group'),
                      value: curLangAr ? row.work_group?.name_arabic : row.work_group?.name_english,
                    },
                    {
                      label: t('status'),
                      value: (
                        <Label
                          variant="soft"
                          color={
                            (row.status === 'processing' && 'info') ||
                            (row.status === 'late' && 'warning') ||
                            (row.status === 'booked' && 'info') ||
                            (row.status === 'finished' && 'success') ||
                            (row.status === 'not arrived' && 'error') ||
                            (row.status === 'canceled' && 'warning') ||
                            (row.status === 'available' && 'secondary') ||
                            (row.status === 'not booked' && 'secondary') ||
                            'default'
                          }
                        >
                          {t(row.status)}
                        </Label>
                      ),
                    },
                    {
                      label: t('actions'),
                      value: !row.invoiced && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            router.push(
                              `${paths.unitservice.accounting.economicmovements.add}?appointment=${row._id}${
                                row.entrance ? `&&entrance=${row.entrance}` : ''
                              }`
                            )
                          }
                        >
                          {t('make an invoice')}
                        </Button>
                      ),
                    },
                  ]}
                />
              ))}
          </>
        ) : (
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={lengths?.length}
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
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

        <TablePaginationCustom
          count={lengths?.length}
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
