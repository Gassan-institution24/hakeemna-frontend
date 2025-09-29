import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetMyLastAttendence() {
  const URL = endpoints.attendence.lastAttendance;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      attendence: data,
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

export function useGetEmployeeAttendence(id, params) {
  const URL = [endpoints.attendence.employee(id), { params }];
  console.log(params);
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      attendence: data?.data || [],
      length: data?.length || 0,
      hours: data?.hours || 0,
      annual: data?.annual || 0,
      public: data?.public || 0,
      sick: data?.sick || 0,
      unpaid: data?.unpaid || 0,
      other: data?.other || 0,
      ids: data?.ids || [],
      missingAttendanceData: data?.missingAttendanceData || [],
      missingAttendanceDataLength: data?.missingAttendanceDataLength || 0,
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
