import PropTypes from 'prop-types';

import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  _jobs,
  _roles,
  JOB_SORT_OPTIONS,
  JOB_BENEFIT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_EMPLOYMENT_TYPE_OPTIONS,
} from 'src/_mock';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useGetAvailableAppointments,
  useGetCities,
  useGetUnitservices,
  useGetCountries,
  useGetAppointmentTypes,
  useGetPaymentMethods,
} from 'src/api/tables';
import { fTimestamp } from 'src/utils/format-time';

import AppointmentList from '../super-admin/patients/history/book-appointment/appointment-list';
import AppointmentSort from '../super-admin/patients/history/book-appointment/appointment-sort';
import AppointmentSearch from '../super-admin/patients/history/book-appointment/appointment-search';
import AppointmentFilters from '../super-admin/patients/history/book-appointment/appointment-filters';
import AppointmentFiltersResult from '../super-admin/patients/history/book-appointment/appointment-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  unitServices: 'all',
  countries: 'all',
  start_date: null,
  end_date: null,
  appointtypes: 'all',
  payment_methods: 'all',
};

// ----------------------------------------------------------------------

export default function AppointmentBooking({ patientData }) {
  const settings = useSettingsContext();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const [search, setSearch] = useState({
    query: '',
    results: [],
  });

  const { appointmentsData, refetch } = useGetAvailableAppointments();
  const { countriesData } = useGetCountries();
  const { tableData } = useGetCities();
  const { unitservicesData } = useGetUnitservices();
  const { appointmenttypesData } = useGetAppointmentTypes();
  const { paymentMethodsData } = useGetPaymentMethods();

  const [filters, setFilters] = useState(defaultFilters);

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  const dateError =
    filters.Offer_start_date && filters.Offer_end_date
      ? filters.Offer_start_date.getTime() > filters.Offer_end_date.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: appointmentsData,
    filters,
    sortBy,
    dateError,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length;

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = appointmentsData.filter(
          (appointment) =>
            (appointment.name_english &&
              appointment.name_english?.toLowerCase().indexOf(search.query.toLowerCase()) !== -1) ||
            (appointment.name_arabic &&
              appointment.name_arabic?.toLowerCase().indexOf(search.query.toLowerCase()) !== -1) ||
            (appointment.unit_service &&
              appointment.unit_service.name_english
                ?.toLowerCase()
                .indexOf(search.query.toLowerCase()) !== -1) ||
            (appointment.unit_service &&
              appointment.unit_service.name_arabic
                ?.toLowerCase()
                .indexOf(search.query.toLowerCase()) !== -1) ||
            (appointment.work_group &&
              appointment.work_group.employees &&
              appointment.work_group.employees.some(
                (employee) =>
                  employee.first_name?.toLowerCase().indexOf(search.query.toLowerCase()) !== -1
              )) ||
            (appointment.work_group &&
              appointment.work_group.employees &&
              appointment.work_group.employees.some(
                (employee) =>
                  employee.last_name?.toLowerCase().indexOf(search.query.toLowerCase()) !== -1
              )) ||
            (appointment.work_group &&
              appointment.work_group.employees &&
              appointment.work_group.employees.some(
                (employee) =>
                  employee.name_arabic?.toLowerCase().indexOf(search.query.toLowerCase()) !== -1
              )) ||
            appointment?._id === search.query.toLowerCase() ||
            JSON.stringify(appointment.code) === search.query.toLowerCase()
        );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    [search.query, appointmentsData]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <AppointmentSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        hrefItem={(id) => paths.dashboard.job.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <AppointmentFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          //
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          //
          countriesOptions={countriesData}
          citiesOptions={tableData}
          unitServicesOptions={unitservicesData}
          appointmentTypeOptions={appointmenttypesData}
          paymentMethodsOptions={paymentMethodsData}
          dateError={dateError}
        />

        <AppointmentSort sort={sortBy} onSort={handleSortBy} sortOptions={sortOptions} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <AppointmentFiltersResult
      countriesOptions={countriesData}
      citiesOptions={tableData}
      unitServicesOptions={unitservicesData}
      appointmentTypeOptions={appointmenttypesData}
      paymentMethodsOptions={paymentMethodsData}
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Book Appointment"
        links={[
          { name: 'Dashboard', href: paths.superadmin.root },
          {
            name: 'Patients',
            href: paths.superadmin.patients.root,
          },
          {
            name: 'History',
            href: paths.superadmin.patients.history.root(patientData._id),
          },
          { name: 'Appointments' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound && <EmptyContent filled title="No Data" sx={{ py: 10 }} />}

      <AppointmentList patientData={patientData} refetch={refetch} appointments={dataFiltered} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy, dateError }) => {
  const {
    appointtypes,
    payment_methods,
    date,
    start_date,
    end_date,
    unitServices,
    countries,
    cities,
  } = filters;

  // SORT BY
  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['start_time'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['start_time'], ['asc']);
  }

  // FILTERS

  if (appointtypes !== 'all') {
    inputData = inputData.filter(
      (appointment) => appointment?.appointment_type?._id === appointtypes
    );
  }
  if (payment_methods !== 'all') {
    inputData = inputData.filter(
      (appointment) => appointment?.payment_method?._id === payment_methods
    );
  }
  if (!dateError) {
    if (start_date && end_date) {
      inputData = inputData.filter(
        (appointment) =>
          fTimestamp(appointment.start_time) >= fTimestamp(start_date) &&
          fTimestamp(appointment.end_time) <= fTimestamp(end_date)
      );
    }
  }
  if (unitServices !== 'all') {
    inputData = inputData.filter((appointment) => appointment?.unit_service?._id === unitServices);
  }
  if (countries !== 'all') {
    inputData = inputData.filter((appointment) => appointment?.unit_service?.country === countries);
  }

  return inputData;
};
AppointmentBooking.propTypes = {
  patientData: PropTypes.object,
};
