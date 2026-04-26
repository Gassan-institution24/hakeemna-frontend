import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------
// Get Favorite Medication
export function useGetFavoriteMedication() {
  const URL = endpoints.favoriteMedication.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      favoriteMedication: data,
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

// ----------------------------------------------------------------------
// Get One Favorite Medication

export function useGetOneFavoriteMedication(id) {
  const URL = endpoints.favoriteMedication.one(id);

  const { data, isLoading, error, isValidating } = useSWR(id ? URL : null, fetcher);
  const memoizedValue = useMemo(
    () => ({
      favorite: data,
      loading: isLoading,
      error,
      validating: isValidating,
      notFound: !isLoading && !data,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };
  return { ...memoizedValue, refetch };
}
// ----------------------------------------------------------------------
// Get Favorite Medical Analysis
export function useGetFavoriteMedicalAnalysis() {
  const URL = endpoints.favoriteMedicalAnalysis.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      favoriteMedicalAnalysis: data || [],
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

// ----------------------------------------------------------------------
// Get One Favorite Medical Analysis
export function useGetOneFavoriteMedicalAnalysis(id) {
  const URL = endpoints.favoriteMedicalAnalysis.one(id);

  const { data, isLoading, error, isValidating } = useSWR(id ? URL : null, fetcher);
  const memoizedValue = useMemo(
    () => ({
      favorite: data,
      loading: isLoading,
      error,
      validating: isValidating,
      notFound: !isLoading && !data,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}


// ----------------------------------------------------------------------
// Get  Favorite Radiology
export function useGetFavoriteRadiology() {
  const URL = endpoints.favoriteRadiology.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      favoriteRadiology: data || [],
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

// ----------------------------------------------------------------------
// Get Favorite Diagnosis
export function useGetFavoriteDiagnosis() {
  const URL = endpoints.favoriteDiagnosis.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      favoriteDiagnosis: data || [],
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

// ----------------------------------------------------------------------
// Get One Favorite Diagnosis
export function useGetOneFavoriteDiagnosis(id) {
  const URL = endpoints.favoriteDiagnosis.one(id);

  const { data, isLoading, error, isValidating } = useSWR(id ? URL : null, fetcher);
  const memoizedValue = useMemo(
    () => ({
      favorite: data,
      loading: isLoading,
      error,
      validating: isValidating,
      notFound: !isLoading && !data,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

// ----------------------------------------------------------------------
// Get one Favorite Radiology
export function useGetOneFavoriteRadiology(id) {
  const URL = endpoints.favoriteRadiology.one(id);

  const { data, isLoading, error, isValidating } = useSWR(id ? URL : null, fetcher);
  const memoizedValue = useMemo(
    () => ({
      favorite: data,
      loading: isLoading,
      error,
      validating: isValidating,
      notFound: !isLoading && !data,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}