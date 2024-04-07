import isEqual from 'lodash/isEqual';
import orderBy from 'lodash/orderBy';
import { useState, useCallback } from 'react';

// import Tab from '@mui/material/Tab';
// import Tabs from '@mui/material/Tabs';
// import { useParams } from 'react-router';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
// import { useAuthContext } from 'src/auth/hooks';
import {
  useGetCities,
  useGetCountries,
  useGetInsuranceCos,
  useGetAppointmentTypes,
  useGetActiveUnitservices,
  useGetEmployeeEngsBySpecialty,
} from 'src/api';

// import Iconify from 'src/components/iconify';
// import { useSettingsContext } from 'src/components/settings';

import AppointmentSort from './appointment-sort-user';
import ClinicAppointmentList from './appointment-clinic';
import AppointmentSearch from './appointment-search-user';
import AppointmentFilters from './appointment-filters-user';
// import OnlineAppointmentList from './goToappointment-online';
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
  // const settings = useSettingsContext();
  const { t } = useTranslate();
  const { id } = useParams();
  const openFilters = useBoolean();
  const [sortBy, setSortBy] = useState('rateing');
  const [search, setSearch] = useState();
  const { data } = useGetEmployeeEngsBySpecialty(id);

  const { countriesData } = useGetCountries();
  const { tableData } = useGetCities();
  const { insuranseCosData } = useGetInsuranceCos();
  const { unitservicesData } = useGetActiveUnitservices();
  const { appointmenttypesData } = useGetAppointmentTypes();

  const [filters, setFilters] = useState(defaultFilters);

  const sortOptions = [{ value: 'rateing', label: t('Rateing') }];

  const dateError =
    filters.Offer_start_date && filters.Offer_end_date
      ? filters.Offer_start_date.getTime() > filters.Offer_end_date.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: data,
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
        hrefItem={(idd) => paths.dashboard.job.details(idd)}
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
      data={data}
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  // const TABS = [
  //   {
  //     value: 'inclinic',
  //     label: t('In clinic'),
  //     icon: <Iconify icon="fa6-regular:hospital" width={24} />,
  //   },
  //   // {
  //   //   value: 'online',
  //   //   label: t('Online'),
  //   //   icon: <Iconify icon="streamline:online-medical-call-service" width={24} />,
  //   // },
  // ];
  // const [currentTab, setCurrentTab] = useState('inclinic');
  // const handleChangeTab = useCallback((event, newValue) => {
  // setCurrentTab(newValue);
  // }, []);

  return (
    <Container maxWidth="xl">
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
        {/* <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab, idx)  => (
            <Tab key={idx} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>
        {/* {currentTab === 'online' && (
          <OnlineAppointmentList
            patientData={user?.patient?._id}
            refetch={refetch}
            dataFiltered={dataFiltered}
          />
        // )} */}
        {/* {currentTab === 'inclinic' && <ClinicAppointmentList />} */}
        <ClinicAppointmentList doc={dataFiltered} />
      </Container>
    </Container>
  );
}
// ----------------------------------------------------------------------

function applyFilter({ inputData, search, comparator, filters, sortBy }) {
  const { insurance } = filters;
  const { countries } = filters;

  // SORT BY
  if (sortBy === 'rateing') {
    inputData = orderBy(inputData, ['employee.rate'], ['desc']);
  }
  if (insurance !== 'all') {
    inputData = inputData.filter(
      (data) =>
        data?.unit_service?.insurance &&
        data?.unit_service?.insurance?.some((insur) => insur._id === insurance)
    );
  }
  if (countries !== 'all') {
    inputData = inputData.filter(
      (data) => data?.unit_service && data?.unit_service?.country?._id === countries
    );
  }

  if (search) {
    inputData = inputData.filter(
      (data) =>
        (data?.employee &&
          data?.employee?.name_english.toLowerCase()?.indexOf(search.toLowerCase()) !== -1) ||
        (data?.unit_service &&
          data?.unit_service?.name_arabic?.indexOf(search.toLowerCase()) !== -1) ||
        (data?.unit_service &&
          data?.unit_service?.name_english.toLowerCase()?.indexOf(search.toLowerCase()) !== -1) ||
        data?._id === search ||
        JSON.stringify(data.code) === search
    );
  }

  // console.log('inputData',inputData)
  return inputData;
}
