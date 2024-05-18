import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetEntranceManagement() {
  const URL = endpoints.entranceManagement.inwating;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      entranceData: data || [],
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
export function useGetfinishedAppointments() {
  const URL = endpoints.entranceManagement.finishedAppointments;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      finishedAppointmentsData: data || [],
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
export function useGetAllEntranceManagement() {
  const URL = endpoints.entranceManagement.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      entranceData: data || [],
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

// export function useGetpatientNotify(id) {
//   const URL = endpoints.appointments.patient.notify(id);

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
//   const memoizedValue = useMemo(
//     () => ({
//       notifyData: data || [],
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
