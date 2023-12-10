import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetServiceTypes() {
    const URL = endpoints.tables.servicetypes;
  
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
    const memoizedValue = useMemo(
      () => ({
        serviceTypesData: data || [],
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
  
  export function useGetServiceType(id) {
    const URL = endpoints.tables.servicetype(id);
  
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