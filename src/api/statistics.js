import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetStatistics() {
  const URL = endpoints.statistics.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      unitServicesNumber: data?.unitServicesNumber || 0,
      employeesNumber: data?.employeesNumber || 0,
      patientsNumber: data?.patientsNumber || 0,
      usersNumber: data?.usersNumber || 0,
      specialitiesEmployees: data?.specialitiesEmployees || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}