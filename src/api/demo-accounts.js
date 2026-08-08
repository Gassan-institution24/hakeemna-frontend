import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------
// Demo / trial accounts (superadmin only).
// Same SWR shape as the rest of src/api — see src/api/user.js.
// ----------------------------------------------------------------------

export function useGetDemoAccounts() {
  const URL = endpoints.demoAccounts.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(() => {
    const demoAccounts = data?.data || [];

    return {
      demoAccounts,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && demoAccounts.length === 0,
    };
  }, [data, isLoading, error, isValidating]);

  const refetch = async () => {
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

/**
 * Provision a demo clinic + its admin user.
 * Revalidates both the demo list and the main users table, since the new account shows up in both.
 */
export async function createDemoAccount(payload) {
  const response = await axiosInstance.post(endpoints.demoAccounts.all, payload);

  await mutate(endpoints.demoAccounts.all);
  await mutate((key) => Array.isArray(key) && key[0] === endpoints.auth.users, undefined, {
    revalidate: true,
  });

  return response.data;
}

/** Extend a running (or lapsed) trial by `days` and bring the account back online. */
export async function extendDemoAccount(id, days) {
  const response = await axiosInstance.patch(endpoints.demoAccounts.extend(id), { days });

  await mutate(endpoints.demoAccounts.all);
  await mutate((key) => Array.isArray(key) && key[0] === endpoints.auth.users, undefined, {
    revalidate: true,
  });

  return response.data;
}
