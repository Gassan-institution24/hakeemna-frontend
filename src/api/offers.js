import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetOffers() {
  const URL = endpoints.offers.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      offersData: data || [],
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

export function useGetStakeholderOffers(id, query) {
  const URL = [endpoints.offers.stakeholder.one(id), { params: query }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      offersData: data?.offers || [],
      length: data?.length || 0,
      loading: isLoading,
      error,
      isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}


// export function useGetStakeholderOffers(id) {
//   const URL = endpoints.offers.stakeholder.one(id);

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
//   const memoizedValue = useMemo(
//     () => ({
//       offersData: data || [],
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

export function useGetOffer(id) {
  const URL = endpoints.offers.one(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      offerData: data,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
