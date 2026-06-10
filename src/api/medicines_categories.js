import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetMedicinesCategories() {
  const URL = endpoints.medicinesCategories.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      medicinesCategories: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetMedicineCategoriesBySpeciality(specialityId) {
  const URL = endpoints.medicinesCategories.bySpeciality(specialityId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      categoriesBySpeciality: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetMedicinesCategory(id) {
  const URL = endpoints.medicinesCategories.one(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      data,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
