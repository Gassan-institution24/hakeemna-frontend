import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetVideoCalls(params) {
  const URL = [endpoints.videoCalls.all, { params }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data,
      isLoading,
      error,
      isValidating,
    }),
    [data, isLoading, error, isValidating]
  );

  const refetch = async () => {
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}


