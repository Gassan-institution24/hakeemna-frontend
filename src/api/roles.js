import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

const swrOptions = { revalidateOnFocus: false, keepPreviousData: true };

export function useGetUnitServiceRoles(unitServiceId) {
  const URL = endpoints.roles.unitservice(unitServiceId);
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      roles: data?.roles || [],
      loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = () => mutate(URL);
  return { ...memoizedValue, refetch };
}

export function useGetPermissionsList() {
  const URL = endpoints.roles.permissions;
  const { data, isLoading, error } = useSWR(URL, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      permissions: data?.permissions || [],
      templates: data?.templates || {},
      loading: isLoading,
      error,
    }),
    [data, error, isLoading]
  );
  return memoizedValue;
}
