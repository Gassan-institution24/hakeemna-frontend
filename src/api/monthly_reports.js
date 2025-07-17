import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetMonthlyReports(params) {
  const URL = [endpoints.monthlyReport.all, { params }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      reportsData: data?.data || [],
      hasMore: data?.hasMore,
      annual: data?.annual,
      sick: data?.sick,
      unpaid: data?.unpaid,
      other: data?.other,
      public: data?.public,
      hours: data?.hours,
      salary: data?.salary,
      total: data?.total,
      ids: data?.ids || [],
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

export function useGetMonthlyReportInterval(enabled = true, params = {}) {
  const shouldFetch = enabled && params?.startDate && params?.endDate;

  const URL = shouldFetch ? [endpoints.monthlyReport.interval, { params }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  return {
    data: data || [],
    isLoading,
    error,
    isValidating,
  };
}