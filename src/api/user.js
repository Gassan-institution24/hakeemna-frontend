import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetUser() {
  const URL = `${endpoints.tables.patient('65781d46a0705623e0333d41')}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data: data || [],
      Loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetpatientAppointment() {
  const URL = `${endpoints.appointment.patientsappointments}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data: data || [],
      Loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetOffers() {
  const URL = `${endpoints.offers.getoffers}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data: data || [],
      Loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    await mutate(URL);
  };
  return { ...memoizedValue, refetch };
}

export function useGetStackholder() {
  const URL = `${endpoints.stakeholder.getstakeholder}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      stakeholder: data || [],
      Loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    await mutate(URL);
  };
  return { ...memoizedValue, refetch };
}

export function useGetPosts() {
  const URL = `${endpoints.posts.getAll}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      posts: data || [],
      Loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    await mutate(URL);
  };
  return { ...memoizedValue, refetch };
}

export function useGetOffer(id) {
  const URL = endpoints.offers.getoffer(id);
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data: data || [],
      Loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetCountries() {
  const URL = `${endpoints.countries.getAllcountries}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      countries: data || [],
      Loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
