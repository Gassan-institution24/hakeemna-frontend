import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetOrders() {
  const URL = endpoints.orders.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      ordersData: data || [],
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

// ----------------------------------------------------------------------

export function useGetStakeholderOrders(id, query) {
  const URL = id ? [endpoints.orders.stakeholder(id), { params: query }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      ordersData: data?.orders || [],
      length: data?.length || 0,
      loading: isLoading,
      error,
      isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetUSOrders(id, query) {
  const URL = id?[endpoints.orders.unitservice(id), { params: query }]:'';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      ordersData: data?.orders || [],
      length: data?.length || 0,
      loading: isLoading,
      error,
      isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetPatientOrders(id, query) {
  const URL = id?[endpoints.orders.patient(id), { params: query }]:'';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      ordersData: data?.orders || [],
      length: data?.length || 0,
      loading: isLoading,
      error,
      isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetOrder(id) {
  const URL = endpoints.orders.one(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      orderData: data,
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
