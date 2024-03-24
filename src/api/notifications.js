import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';


export function useGetNotifications() {
  const URL = endpoints.notifications.all;

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
export function useGetMyNotifications(id, emid, page) {
  // console.log(id, emid);
  const URL = endpoints.notifications.my(id, emid, page);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      notifications: data?.notifications || [],
      hasMore: data?.hasMore || false,
      unread: data?.unread || 0,
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
// export function useGetPatientNotifications(id) {
//   const URL = endpoints.notifications.pateint(id);

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
//   const memoizedValue = useMemo(
//     () => ({
//       patientNotifications: data?.notifications || [],
//       hasMore: data?.hasMore || false,
//       unread: data?.unread || 0,
//       loading: isLoading,
//       error,
//       validating: isValidating,
//       empty: !isLoading && !data?.length,
//     }),
//     [data, error, isLoading, isValidating]
//   );

//   const refetch = async () => {
//     // Use the mutate function to re-fetch the data for the specified key (URL)
//     await mutate(URL);
//   };

//   return { ...memoizedValue, refetch };
// }
