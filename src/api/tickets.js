import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetTickets(query) {
  console.log('query', query);
  const URL = query ? [endpoints.tickets.all, { params: query }] : endpoints.tickets.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      ticketsData: data?.tickets || [],
      length: data?.length || 0,
      pendingLength: data?.pendingLength || 0,
      proccessingLength: data?.proccessingLength || 0,
      waitingLength: data?.waitingLength || 0,
      completedLength: data?.completedLength || 0,
      closedLength: data?.closedLength || 0,
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
export function useGetTicket(id) {
  const URL = endpoints.tickets.one(id);

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
