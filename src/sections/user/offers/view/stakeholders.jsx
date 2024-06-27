import orderBy from 'lodash/orderBy';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useGetStakeholders } from 'src/api';

import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import JobList from '../job-list';
import JobSearch from '../job-search';

// ----------------------------------------------------------------------

export default function JobListView() {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const [search, setSearch] = useState({
    query: '',
    results: [],
  });

  const { stakeholdersData } = useGetStakeholders();

  const dataFiltered = applyFilter({
    inputData: stakeholdersData,
  });

  const notFound = !dataFiltered.length;

  const handleSearch = useCallback(
    (inputValue) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = stakeholdersData.filter(
          (one) =>
            (one.name_english &&
              one.name_english.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) ||
            (one.name_arabic &&
              one.name_arabic.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1)
        );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    [stakeholdersData]
  );

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <JobSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        hrefItem={(id) => paths.dashboard.user.products.stakeholder.one(id)}
      />
    </Stack>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('suppliers')}
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
      </Stack>

      {notFound && <EmptyContent filled title={t('No Data')} sx={{ py: 10 }} />}

      <JobList jobs={dataFiltered} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy }) => {
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

  return inputData;
};
