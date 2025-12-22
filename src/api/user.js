import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

export function useGetUsers(query) {
  const URL = [endpoints.auth.users, { params: query }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      usersData: data || [],
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

export function useGetUser(id) {
  const URL = `${endpoints.auth.user(id)}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data,
      Loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetPatientUser(id) {
  const URL = `${endpoints.auth.patientUser(id)}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data,
      Loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUserByQuery(query) {
  const URL = [endpoints.auth.users, { params: query }];
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data,
      Loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// Super Admin Level 2 Users
export function useGetSuperAdminsLevel2() {
  const URL = endpoints.auth.superAdminsLevel2;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  return useMemo(() => {
    const superAdmins = data?.data || [];

    return {
      data: superAdmins,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && superAdmins.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

// Super Admin By ID
export function useGetSuperAdminById(id) {
  const URL = id ? endpoints.auth.superAdmin(id) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  return useMemo(
    () => ({
      data,
      loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, isLoading, error, isValidating]
  );
}
// Update Super Admin Permissions
export async function updateSuperAdminPermissions(id, permissions) {
  await axiosInstance.patch(
    endpoints.auth.superAdminPermissions(id),
    { permissions }
  );

  // إعادة تحميل البيانات
  mutate(endpoints.auth.superAdminsLevel2);
  mutate(endpoints.auth.superAdmin(id));
}