import isEqual from 'lodash/isEqual';
import orderBy from 'lodash/orderBy';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import {
  useGetCities,
  useGetCountries,
  useGetInsuranceCos,
  useGetUnitservices,
  useGetPaymentMethods,
  useGetAppointmentTypes,
} from 'src/api';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import AppointmentSort from './appointment-sort-user';
import ClinicAppointmentList from './appointment-clinic';
import AppointmentSearch from './appointment-search-user';
import AppointmentFilters from './appointment-filters-user';
import OnlineAppointmentList from './goToappointment-online';
import AppointmentFiltersResult from './appointment-filters-result-user';

// ----------------------------------------------------------------------

const defaultFilters = {
  unitServices: 'all',
  countries: 'all',
  insurance: 'all',
  start_date: null,
  end_date: null,
  rate: 'all',
  appointtypes: 'all',
  payment_methods: 'all',
  name: '',
};

// ----------------------------------------------------------------------

export default function AppointmentBooking() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const openFilters = useBoolean();
  const { user } = useAuthContext();
  const [sortBy, setSortBy] = useState('rateing');
  const [search, setSearch] = useState();

  // const { appointmentsData, refetch } = useGetAvailableAppointments();
  const { countriesData, refetch } = useGetCountries();
  const { tableData } = useGetCities();
  const { insuranseCosData } = useGetInsuranceCos();
  const { unitservicesData } = useGetUnitservices();
  const { appointmenttypesData } = useGetAppointmentTypes();
  const { paymentMethodsData } = useGetPaymentMethods();

  const [filters, setFilters] = useState(defaultFilters);

  const sortOptions = [{ value: 'rateing', label: t('Rateing') }];

  const dateError =
    filters.Offer_start_date && filters.Offer_end_date
      ? filters.Offer_start_date.getTime() > filters.Offer_end_date.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: unitservicesData,
    filters,
    search,
    sortBy,
    dateError,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSortBy = useCallback(() => {
    setSortBy(defaultFilters);
  }, []);

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
        // query={search.query}
        // results={search.results}
        onSearch={setSearch}
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
          insuranseCosData={insuranseCosData}
          citiesOptions={tableData}
          unitServicesOptions={unitservicesData}
          dataFiltered={dataFiltered}
          // usrate={usrate}
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

  const TABS = [
    {
      value: 'inclinic',
      label: t('In clinic'),
      icon: <Iconify icon="fa6-regular:hospital" width={24} />,
    },
    {
      value: 'online',
      label: t('Online'),
      icon: <Iconify icon="streamline:online-medical-call-service" width={24} />,
    },
  ];
  const [currentTab, setCurrentTab] = useState('inclinic');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>
      <Container>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>
        {currentTab === 'online' && (
          <OnlineAppointmentList
            patientData={user?.patient?._id}
            refetch={refetch}
            dataFiltered={dataFiltered}
          />
        )}
        {currentTab === 'inclinic' && <ClinicAppointmentList />}
      </Container>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, search, comparator, filters, sortBy }) {
  const { insurance } = filters;

  // SORT BY
  if (sortBy === 'rateing') {
    inputData = orderBy(inputData, ['rate'], ['desc']);
  }
  if (insurance !== 'all') {
    inputData = inputData.filter(
      (data) => data?.insurance && data?.insurance?.some((insur) => insur._id === insurance)
    );
  }

  if (search) {
    inputData = inputData.filter(
      (data) =>
        (data?.name_english &&
          data?.name_english?.toLowerCase()?.indexOf(search.toLowerCase()) !== -1) ||
        (data?.name_arabic &&
          data?.name_arabic?.toLowerCase()?.indexOf(search.toLowerCase()) !== -1) ||
        (data?.unit_service?.name_english &&
          data?.unit_service?.name_english?.toLowerCase()?.indexOf(search.toLowerCase()) !== -1) ||
        (data?.unit_service?.name_arabic &&
          data?.unit_service?.name_arabic?.toLowerCase()?.indexOf(search.toLowerCase()) !== -1) ||
        (data?.department?.name_english &&
          data?.department?.name_english?.toLowerCase()?.indexOf(search.toLowerCase()) !== -1) ||
        (data?.department?.name_english &&
          data?.department?.name_arabic?.toLowerCase()?.indexOf(search.toLowerCase()) !== -1) ||
        data?._id === search ||
        JSON.stringify(data.code) === search
    );
  }

  // if (status !== 'all') {
  //   inputData = inputData.filter((order) => order.status === status);
  // }
  // console.log('inputData',inputData)
  return inputData;
}
