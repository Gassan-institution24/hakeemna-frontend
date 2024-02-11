import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetUnreadNotificationCount() {
  const URL = endpoints.tables.unreadNotificationsCount;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      notificationscount: data || [],
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

  return { ...memoizedValue, recount: refetch };
}

export function useGetMyUnreadNotificationCount(id, emid) {
  const URL = endpoints.tables.myUnreadNotifications(id, emid);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      notificationscount: data || [],
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

  return { ...memoizedValue, recount: refetch };
}
export function useGetNotifications() {
  const URL = endpoints.tables.notifications;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      notifications: data || [],
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
export function useGetMyNotifications(id, emid) {
  console.log(id, emid);
  const URL = endpoints.tables.myNotifications(id, emid);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      notifications: data,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
