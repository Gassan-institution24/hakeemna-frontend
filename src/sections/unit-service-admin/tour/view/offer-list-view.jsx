import orderBy from 'lodash/orderBy';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';

import { useGetOffers } from 'src/api';
import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TourList from '../offer-list';
import TourSort from '../offer-sort';
import TourFilters from '../offer-filters';
import TourFiltersResult from '../offer-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  cities: [],
  tourGuides: [],
  stakeholder: [],
  Offer_start_date: null,
  Offer_end_date: null,
};

// ----------------------------------------------------------------------

export default function TourListView() {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const [search, setSearch] = useState({
    query: '',
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.Offer_start_date && filters.Offer_end_date
      ? filters.Offer_start_date.getTime() > filters.Offer_end_date.getTime()
      : false;

  const { data, refetch } = useGetOffers();
  const dataFiltered = applyFilter({
    inputData: data,
    filters,
    sortBy,
    dateError,
  });
  const canReset =
    !!filters.cities.length ||
    !!filters.tourGuides.length ||
    !!filters.stakeholder.length ||
    (!!filters.Offer_start_date && !!filters.Offer_end_date);

  const notFound = !dataFiltered.length && canReset;

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
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
      {/* <TourSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        hrefItem={(id) => paths.dashboard.tour.details(id)}
      /> */}

      <Stack direction="row" spacing={1} flexShrink={0}>
        <TourFilters
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

          // citiesOptions={countries}
          //
          dateError={dateError}
        />

        <TourSort sort={sortBy} onSort={handleSortBy} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <TourFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered}
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          {
            name: 'Tour',
            href: paths.dashboard.tour.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.tour.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create Offer
          </Button>
        }
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

      {notFound && <EmptyContent title="No Data" filled sx={{ py: 10 }} />}

      <TourList refetch={refetch} offers={dataFiltered} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy, dateError }) => {
  const { stakeholder, cities, Offer_start_date, Offer_end_date, tourGuides } = filters;

  const tourGuideIds = tourGuides.map((tourGuide) => tourGuide.id);

  // SORT BY
  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    inputData = orderBy(inputData, ['totalViews'], ['desc']);
  }

  // FILTERS
  if (!dateError) {
    if (Offer_start_date && Offer_end_date) {
      inputData = inputData.filter(
        (tour) =>
          fTimestamp(tour.Offer_start_date) >= fTimestamp(Offer_start_date) &&
          fTimestamp(tour.Offer_end_date) <= fTimestamp(Offer_end_date)
      );
    }
  }

  if (cities.length) {
    inputData = inputData.filter((tour) => cities.includes(tour.cities._id));
  }

  if (tourGuideIds.length) {
    inputData = inputData.filter((tour) =>
      tour.tourGuides.some((filterItem) => tourGuideIds.includes(filterItem.id))
    );
  }

  if (stakeholder.length) {
    inputData = inputData.filter((tour) => stakeholder.includes(tour.stakeholder));
  }

  return inputData;
};
