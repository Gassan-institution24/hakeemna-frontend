import isEqual from 'lodash/isEqual';
import { useMemo, useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetProducts } from 'src/api/product';

import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { useCheckoutContext } from 'src/sections/unit-service/checkout/context';

import ProductList from './product-list';
import CartIcon from './common/cart-icon';
import ProductSearch from './product-search';
import ProductFiltersResult from './product-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  gender: [],
  colors: [],
  rating: '',
  name: '',
  category: 'all',
  priceRange: [0, 200],
};

// ----------------------------------------------------------------------

export default function ProductShopView() {
  const settings = useSettingsContext();

  const checkout = useCheckoutContext();
  const { t } = useTranslate();

  const { shid } = useParams();

  const [filters, setFilters] = useState(defaultFilters);

  const queryOptions = useMemo(
    () => ({
      status: 'published',
      populate: 'category stakeholder',
      to_patients: true,
      ...(shid && { stakeholder: shid }),
    }),
    [shid]
  );

  const { products, productsLoading, productsEmpty } = useGetProducts(queryOptions);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const dataFiltered = applyFilter({
    inputData: products,
    filters,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length && canReset;

  const handleSearch = useCallback(
    (e) => {
      handleFilters('name', e.target.value);
    },
    [handleFilters]
  );
  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <ProductSearch
        filters={filters}
        onSearch={handleSearch}
        hrefItem={(id) => paths.product.details(id)}
      />
    </Stack>
  );

  const renderResults = (
    <ProductFiltersResult
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      //
      results={dataFiltered.length}
    />
  );

  const renderNotFound = <EmptyContent filled title={t('No Data')} sx={{ py: 10 }} />;

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        mb: 15,
      }}
    >
      <CartIcon totalItems={checkout.totalItems} />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {(notFound || productsEmpty) && renderNotFound}

      <ProductList products={dataFiltered} loading={productsLoading} />
    </Container>
  );
}

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
        (data?.category?.name_english &&
          data?.category?.name_english.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
        (data?.category?.name_arabic &&
          data?.category?.name_arabic.toLowerCase().indexOf(name.toLowerCase()) !== -1) ||
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
